#!/usr/bin/env node
// Shared runner: no shell evaluation, no implicit test selection, no secret output.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const mode = process.argv[2] ?? 'manual';
try {
  if (mode !== 'manual') {
    let input = '';
    for await (const chunk of process.stdin) {
      input += chunk;
      if (input.length > 65536) throw new Error('Hook input exceeds limit');
    }
    const event = input.trim() ? JSON.parse(input) : {};
    // A Stop hook must not recursively prevent the host from stopping.
    if (event.stop_hook_active) process.exit(0);
  }
  const deadline = Date.now() + 45000;
  const config = JSON.parse(fs.readFileSync(path.join(project, '.developer/checks.json'), 'utf8'));
  if (!Array.isArray(config.commands)) throw new Error('commands must be an array');
  const failed = [];
  for (const check of config.commands) {
    if (!check || typeof check.command !== 'string' || !check.command || !Array.isArray(check.args) || check.args.some(a => typeof a !== 'string')) throw new Error('Each check needs command and string args');
    const relative = check.cwd ?? '.';
    if (typeof relative !== 'string') throw new Error('cwd must be a relative path');
    const cwd = path.resolve(project, relative);
    if (cwd !== project && !cwd.startsWith(project + path.sep)) throw new Error('Check cwd must stay in project');
    const real = fs.realpathSync(cwd);
    if (real !== fs.realpathSync(project) && !real.startsWith(fs.realpathSync(project) + path.sep)) throw new Error('Check cwd must not escape through symlinks');
    const timeout = check.timeoutMs ?? 30000;
    if (!Number.isInteger(timeout) || timeout < 1 || timeout > 45000) throw new Error('timeoutMs must be between 1 and 45000');
    if (Date.now() >= deadline) throw new Error('Hook checks exceeded the total time budget');
    const result = spawnSync(check.command, check.args, { cwd, timeout: Math.min(timeout, deadline - Date.now()), encoding: 'utf8', shell: false, maxBuffer: 1024 * 1024 });
    // Suppress subprocess output: project scripts can print credentials.
    if (result.error || result.status !== 0) failed.push(`${check.command}: ${result.error?.code ?? `exit ${result.status ?? result.signal}`}`);
  }
  if (!config.commands.length && mode === 'manual') console.log('No checks configured. Edit .developer/checks.json; this does not establish readiness.');
  if (failed.length) {
    if (mode === 'cursor') { console.log('{}'); console.error(failed.join('\n')); }
    else { console.error(failed.join('\n')); process.exitCode = mode === 'claude' || mode === 'codex' ? 2 : 1; }
  } else if (mode === 'cursor') console.log('{}');
  else if (mode === 'manual' && config.commands.length) console.log(`${config.commands.length} configured checks passed.`);
} catch (error) {
  if (mode === 'cursor') console.log('{}');
  console.error(`Developer hook: ${error.message}`);
  process.exitCode = mode === 'claude' || mode === 'codex' ? 2 : 1;
}
