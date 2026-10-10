#!/usr/bin/env node

import fs from 'node:fs';
import { installToolkit, platforms } from './installer.mjs';
import { agentNames, parseWorkflowArgs, scaffold, verify } from './workflow.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');

const packageJson = JSON.parse(
  fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8')
);

const SKILLS = [
  {
    name: 'css-design-tokens',
    description: 'Token-first architecture: defines locked OKLCH color roles, spacing scales, and Tailwind v4 @theme directives before UI components.',
    folder: 'css-design-tokens'
  },
  {
    name: 'frontend-designer',
    description: 'Autonomous Frontend Architect agent synthesizing Hallmark, Tailwind, ASW UI/UX, and MCP tools.',
    folder: 'frontend-designer'
  },
  {
    name: 'hallmark',
    description: 'Anti-AI-slop design system enforcing structural variety, honest copy, and locked tokens.',
    folder: 'hallmark'
  },
  {
    name: 'micro-animation-interaction',
    description: 'Tactile spring physics, GPU-composited animations, and interactive micro-states.',
    folder: 'micro-animation-interaction'
  },
  {
    name: 'scroll-craft',
    description: 'Scrollytelling timeline engine with dimensional layered heroes and 8 page grammars.',
    folder: 'scroll-craft'
  },
  {
    name: 'tailwindcss',
    description: 'Tailwind CSS utility architecture, responsive breakpoints, and theme configuration.',
    folder: 'tailwindcss'
  }
];

for (const name of fs.readdirSync(path.join(packageRoot, 'workflows/skills'))) {
  const content = fs.readFileSync(path.join(packageRoot, 'workflows/skills', name, 'SKILL.md'), 'utf8');
  SKILLS.push({ name, folder: name, description: content.match(/^description: (.*)$/m)[1], fullstack: true });
}

function printHeader() {
  console.log('\x1b[1m\x1b[36m');
  console.log('╭──────────────────────────────────────────────────────────╮');
  console.log('│                    THE-DEVELOPER                         │');
  console.log(`│       Full-Stack Agent Workflow Toolkit       v${packageJson.version.padEnd(8)}│`);
  console.log('╰──────────────────────────────────────────────────────────╯');
  console.log('\x1b[0m');
}

function printHelp() {
  printHeader();
  console.log(`\x1b[1mUSAGE:\x1b[0m`);
  console.log(`  npx the-developer <command> [options]\n`);
  console.log(`\x1b[1mCOMMANDS:\x1b[0m`);
  console.log(`  \x1b[32minstall [dir] [flags]\x1b[0m   Install the full toolkit (default: antigravity; --all for every host)`);
  console.log('  init [dir] --preset=frontend|fullstack [--target=cursor]');
  console.log('  specify|plan|tasks|verify <feature> [--project=dir]');
  console.log('  targets                          Show host capabilities');
  console.log('  install [dir] --all [--dry-run]    All skills, agents, hooks and workflows');
  console.log('  agents list                      List portable role definitions');
  console.log(`  \x1b[32mlist\x1b[0m                   List all available skills and descriptions`);
  console.log(`  \x1b[32minfo <skill>\x1b[0m           Display detailed documentation for a specific skill`);
  console.log(`  \x1b[32mmcp\x1b[0m                    Print recommended MCP server configurations (Inspo, Stitch, etc.)`);
  console.log(`  \x1b[32m--version, -v\x1b[0m          Show version`);
  console.log(`  \x1b[32m--help, -h\x1b[0m             Show this help message\n`);
  console.log(`\x1b[1mINSTALL TARGET FLAGS:\x1b[0m`);
  console.log(`  \x1b[33m--target=antigravity\x1b[0m   Install to .agents/skills (default)`);
  console.log(`  \x1b[33m--target=cursor\x1b[0m        Install to .cursor/skills (Cursor IDE)`);
  console.log(`  \x1b[33m--target=claude\x1b[0m        Install to .claude/skills (Claude Code)`);
  console.log(`  \x1b[33m--target=windsurf\x1b[0m      Install to .windsurf/skills (Windsurf)`);
  console.log(`  \x1b[33m--target=copilot\x1b[0m       Install to .github/skills (GitHub Copilot)`);
  console.log('  --target=codex          Install Codex role TOML and shared skills');
  console.log(`  \x1b[33m--target=all, --all\x1b[0m    Install to all six supported ecosystems\n`);
  console.log(`\x1b[1mEXAMPLES:\x1b[0m`);
  console.log(`  npx the-developer install`);
  console.log(`  npx the-developer install --target=cursor`);
  console.log(`  npx the-developer install --target=claude`);
  console.log(`  npx the-developer install --all`);
  console.log(`  npx the-developer install ./my-project --target=cursor`);
  console.log(`  npx the-developer list\n`);
}

function listSkills() {
  printHeader();
  console.log(`\x1b[1mAvailable Skills & Agents (${SKILLS.length}):\x1b[0m\n`);
  for (const skill of SKILLS) {
    console.log(`  \x1b[33m• ${skill.name.padEnd(28)}\x1b[0m ${skill.description}`);
  }
  console.log('\nSupported Ecosystems: \x1b[36mAntigravity, Cursor, Claude Code, Windsurf, Copilot, Codex\x1b[0m');
  console.log('Install them using: \x1b[36mnpx the-developer install [--target=<name> | --all]\x1b[0m\n');
}

function showSkillInfo(skillName) {
  const skill = SKILLS.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
  if (!skill) {
    console.error(`\x1b[31mError: Skill "${skillName}" not found.\x1b[0m`);
    console.log(`Run \x1b[33mnpx the-developer list\x1b[0m to see all available skills.`);
    process.exit(1);
  }

  const skillFilePath = path.join(packageRoot, skill.fullstack ? 'workflows' : '.agents', 'skills', skill.folder, 'SKILL.md');
  if (!fs.existsSync(skillFilePath)) {
    console.error(`\x1b[31mError: Documentation for "${skillName}" not found.\x1b[0m`);
    process.exit(1);
  }

  const content = fs.readFileSync(skillFilePath, 'utf8');
  console.log(`\x1b[1m\x1b[34m=== ${skill.name} ===\x1b[0m\n`);
  console.log(content);
}

function printMcpConfig() {
  printHeader();
  console.log(`\x1b[1mRecommended MCP Server Configurations:\x1b[0m\n`);
  const mcpSnippet = {
    mcpServers: {
      inspo: {
        serverUrl: "https://inspomcp.dev/api/mcp"
      },
      stitch: {
        serverUrl: "https://stitch.googleapis.com/mcp",
        headers: {
          "X-Goog-Api-Key": "YOUR_API_KEY_HERE"
        }
      },
      mobbin: {
        serverUrl: "https://api.mobbin.com/mcp",
        headers: {
          "Authorization": "Bearer YOUR_MOBBIN_TOKEN"
        }
      },
      shadcn: {
        command: "npx",
        args: ["shadcn@latest", "mcp"]
      }
    }
  };

  console.log(JSON.stringify(mcpSnippet, null, 2));
  console.log('\nAdd these to your `mcp_config.json` or client settings to enable full tool support.\n');
}

// Argument parsing
const rawArgs = process.argv.slice(2);
const command = rawArgs[0] && !rawArgs[0].startsWith('-') ? rawArgs[0] : (rawArgs.includes('-h') || rawArgs.includes('--help') ? '--help' : (rawArgs.includes('-v') || rawArgs.includes('--version') ? '--version' : 'install'));

try {
switch (command) {
  case 'install':
  case 'add':
  case 'init': {
    const { options, positionals } = parseWorkflowArgs(rawArgs.slice(rawArgs[0]?.startsWith('-') ? 0 : 1));
    if (positionals.length > 1) throw new Error('Installation accepts one project directory.');
    const hasPreset = rawArgs.some(a => a === '--preset' || a.startsWith('--preset='));
    const preset = command === 'init' || hasPreset ? options.preset : 'fullstack';
    installToolkit(positionals[0] ?? options.project, options.target.split(','), preset, options.dryRun);
    break;
  }
  case 'targets':
    console.log(Object.entries(platforms).map(([name,p]) => `${name}: ${p.agents}; hooks: ${p.hooks}`).join('\n'));
    break;
  case 'agents':
    if (rawArgs.length !== 2 || rawArgs[1] !== 'list') throw new Error('Usage: the-developer agents list');
    console.log(agentNames.join('\n'));
    break;
  case 'specify':
  case 'plan':
  case 'tasks':
  case 'verify': {
    const { options, positionals } = parseWorkflowArgs(rawArgs.slice(1));
    if (positionals.length !== 1) throw new Error(`${command} requires one feature name.`);
    if (command === 'verify') verify(options.project, positionals[0]);
    else scaffold(command, options.project, positionals[0]);
    break;
  }
  case 'list':
  case 'ls':
    listSkills();
    break;
  case 'info':
    const skillArg = rawArgs.find((a) => !a.startsWith('-') && a !== 'info');
    if (!skillArg) {
      console.error('\x1b[31mError: Please specify a skill name. Example: npx the-developer info hallmark\x1b[0m');
      process.exit(1);
    }
    showSkillInfo(skillArg);
    break;
  case 'mcp':
    printMcpConfig();
    break;
  case '-v':
  case '--version':
    console.log(`the-developer v${packageJson.version}`);
    break;
  case '-h':
  case '--help':
  default:
    printHelp();
    break;
}

} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
