#!/usr/bin/env node
/**
 * CodeGraph Cursor hook — keep the local graph fresh.
 *
 * Events:
 *   sessionStart   → ensure .codegraph exists, sync, inject explore reminder
 *   beforeReadFile → sync graph (debounced)
 *   afterFileEdit  → sync graph (debounced)
 *
 * Fail-open: never block the agent if codegraph is missing or sync fails.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DEBOUNCE_MS = 2000;
const SKIP_PATH_RE =
  /(?:^|[\\/])(?:\.codegraph|\.git|node_modules|vendor|\.cursor[\\/]hooks)(?:[\\/]|$)/i;

function projectRoot() {
  return (
    process.env.CURSOR_PROJECT_DIR ||
    process.env.CLAUDE_PROJECT_DIR ||
    process.cwd()
  );
}

function readStdin() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    if (!raw.trim()) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeJson(obj) {
  process.stdout.write(JSON.stringify(obj));
}

function resolveCodegraphInvocation() {
  // Prefer invoking the npm shim via node (reliable on Windows; avoids .cmd EINVAL).
  const candidates = [];
  if (process.env.CODEGRAPH_SHIM) candidates.push(process.env.CODEGRAPH_SHIM);

  const pathDirs = (process.env.PATH || process.env.Path || '').split(path.delimiter);
  for (const dir of pathDirs) {
    if (!dir) continue;
    candidates.push(path.join(dir, 'node_modules', '@colbymchenry', 'codegraph', 'npm-shim.js'));
    // Global npm layout: <prefix>/node_modules/@colbymchenry/codegraph/npm-shim.js
    // where <prefix>/codegraph.cmd sits next to node.exe
    candidates.push(path.join(dir, 'node_modules', '@colbymchenry', 'codegraph', 'npm-shim.js'));
  }

  // Common global prefixes
  if (process.env.APPDATA) {
    candidates.push(
      path.join(process.env.APPDATA, 'npm', 'node_modules', '@colbymchenry', 'codegraph', 'npm-shim.js')
    );
  }
  candidates.push(
    path.join(
      path.dirname(process.execPath),
      'node_modules',
      '@colbymchenry',
      'codegraph',
      'npm-shim.js'
    )
  );

  for (const c of candidates) {
    try {
      if (c && fs.existsSync(c)) return { command: process.execPath, argsPrefix: [c] };
    } catch {
      /* continue */
    }
  }

  // Last resort: shell out to `codegraph` (needs shell:true on Windows for .cmd)
  return {
    command: 'codegraph',
    argsPrefix: [],
    shell: process.platform === 'win32',
  };
}

function runCodegraph(args, cwd) {
  const inv = resolveCodegraphInvocation();
  return spawnSync(inv.command, [...inv.argsPrefix, ...args], {
    cwd,
    encoding: 'utf8',
    windowsHide: true,
    timeout: 60000,
    env: process.env,
    shell: Boolean(inv.shell),
  });
}

function debouncePath(root) {
  return path.join(os.tmpdir(), `codegraph-sync-${Buffer.from(root).toString('hex').slice(0, 32)}.ts`);
}

function shouldDebounce(root) {
  const stamp = debouncePath(root);
  try {
    const prev = Number(fs.readFileSync(stamp, 'utf8'));
    if (Number.isFinite(prev) && Date.now() - prev < DEBOUNCE_MS) return true;
  } catch {
    /* first run */
  }
  try {
    fs.writeFileSync(stamp, String(Date.now()), 'utf8');
  } catch {
    /* ignore stamp failures */
  }
  return false;
}

function shouldSkipFile(filePath) {
  if (!filePath || typeof filePath !== 'string') return false;
  return SKIP_PATH_RE.test(filePath);
}

function ensureIndex(root) {
  const marker = path.join(root, '.codegraph');
  if (fs.existsSync(marker)) return { ok: true, action: 'present' };
  const init = runCodegraph(['init', '--yes'], root);
  if (init.status === 0) return { ok: true, action: 'init' };
  return {
    ok: false,
    action: 'init-failed',
    detail: (init.stderr || init.stdout || init.error?.message || '').trim().slice(0, 200),
  };
}

function syncIndex(root, { force = false } = {}) {
  if (!force && shouldDebounce(root)) return { ok: true, action: 'debounced' };
  if (!fs.existsSync(path.join(root, '.codegraph'))) {
    return ensureIndex(root);
  }
  const sync = runCodegraph(['sync', '--quiet'], root);
  if (sync.status === 0) return { ok: true, action: 'synced' };
  // Do not stamp debounce on failure — allow an immediate retry next event
  try {
    fs.unlinkSync(debouncePath(root));
  } catch {
    /* ignore */
  }
  return {
    ok: false,
    action: 'sync-failed',
    detail: (sync.stderr || sync.stdout || sync.error?.message || '').trim().slice(0, 200),
  };
}

function main() {
  const input = readStdin();
  const event = input.hook_event_name || '';
  const root = projectRoot();
  const fileHint = input.file_path || input.path || input.filePath || '';

  if (shouldSkipFile(fileHint)) {
    writeJson({});
    return;
  }

  if (event === 'sessionStart') {
    const ensured = ensureIndex(root);
    const synced = ensured.ok ? syncIndex(root, { force: true }) : ensured;
    const status = synced.ok
      ? `CodeGraph ready (${ensured.action}/${synced.action}). Prefer codegraph_explore MCP for structural questions before grep/Read.`
      : `CodeGraph hook could not refresh the index (${synced.action}${synced.detail ? `: ${synced.detail}` : ''}). Install CLI: npm i -g @colbymchenry/codegraph then run codegraph init.`;
    writeJson({ additional_context: status });
    return;
  }

  if (event === 'beforeReadFile' || event === 'afterFileEdit') {
    syncIndex(root);
    writeJson({});
    return;
  }

  // Unknown / shared script path — sync quietly
  syncIndex(root);
  writeJson({});
}

try {
  main();
} catch {
  writeJson({});
  process.exit(0);
}
