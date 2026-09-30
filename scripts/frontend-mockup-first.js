#!/usr/bin/env node
/**
 * Remind the agent: new frontend screens need a palette-matched mockup first.
 *
 * Events:
 *   beforeSubmitPrompt → inject additional_context when the prompt asks for a new screen
 *   preToolUse         → agent_message when writing likely new screen/page files
 *
 * Fail-open: never block the agent.
 */
const fs = require('fs');

const NEW_SCREEN_PROMPT_RE =
  /\b(new\s+(screen|page|route|view|ui)|add\s+(a\s+)?(screen|page|route|view)|create\s+(a\s+)?(screen|page|route|view|landing)|build\s+(a\s+)?(screen|page|landing)|frontend\s+screen)\b/i;

const SCREEN_PATH_RE =
  /(?:^|[\\/])(?:app|pages|screens|views|routes)[\\/].+\.(?:tsx|jsx|vue|svelte)$/i;

const MOCKUP_PATH_RE = /(?:^|[\\/])mockups?[\\/]/i;

const CONTEXT = [
  'FRONTEND MOCKUP-FIRST: For any new screen/page, first extract the existing app palette',
  '(CSS variables / theme tokens / Tailwind theme) and build a lightweight mockup that',
  'reuses those exact colors. Get approval (or an explicit skip) before implementing',
  'production UI. Load hallmark + frontend-design for visual work.',
].join(' ');

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

function pathFromToolInput(input) {
  const ti = input.tool_input || input.arguments || input.input || {};
  return (
    ti.path ||
    ti.file_path ||
    ti.filePath ||
    ti.target_file ||
    input.file_path ||
    input.path ||
    ''
  );
}

function main() {
  const input = readStdin();
  const event = input.hook_event_name || '';

  if (event === 'beforeSubmitPrompt') {
    const prompt = String(input.prompt || input.text || '');
    if (NEW_SCREEN_PROMPT_RE.test(prompt)) {
      writeJson({ continue: true, additional_context: CONTEXT });
      return;
    }
    writeJson({ continue: true });
    return;
  }

  if (event === 'preToolUse') {
    const tool = String(input.tool_name || input.toolName || input.tool || '');
    if (!/^(Write|StrReplace|Edit|search_replace)$/i.test(tool) && tool) {
      // Some hosts omit tool_name; still check path.
    }
    const filePath = String(pathFromToolInput(input));
    if (filePath && SCREEN_PATH_RE.test(filePath) && !MOCKUP_PATH_RE.test(filePath)) {
      writeJson({
        permission: 'allow',
        agent_message: CONTEXT,
      });
      return;
    }
    writeJson({ permission: 'allow' });
    return;
  }

  writeJson({});
}

try {
  main();
} catch {
  writeJson({});
  process.exit(0);
}
