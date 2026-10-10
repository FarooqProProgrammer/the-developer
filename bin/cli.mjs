#!/usr/bin/env node

import fs from 'node:fs';
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

function printHeader() {
  console.log('\x1b[1m\x1b[36m');
  console.log('╭──────────────────────────────────────────────────────────╮');
  console.log('│                    THE-DEVELOPER                         │');
  console.log(`│       AI Agent Skills Suite for Frontend Design v${packageJson.version.padEnd(8)}│`);
  console.log('╰──────────────────────────────────────────────────────────╯');
  console.log('\x1b[0m');
}

function printHelp() {
  printHeader();
  console.log(`\x1b[1mUSAGE:\x1b[0m`);
  console.log(`  npx the-developer <command> [options]\n`);
  console.log(`\x1b[1mCOMMANDS:\x1b[0m`);
  console.log(`  \x1b[32minstall [dir]\x1b[0m     Install all bundled skills into target directory (default: current directory)`);
  console.log(`  \x1b[32mlist\x1b[0m              List all available skills and descriptions`);
  console.log(`  \x1b[32minfo <skill>\x1b[0m      Display detailed documentation for a specific skill`);
  console.log(`  \x1b[32mmcp\x1b[0m               Print recommended MCP server configurations (Inspo, Stitch, etc.)`);
  console.log(`  \x1b[32m--version, -v\x1b[0m     Show version`);
  console.log(`  \x1b[32m--help, -h\x1b[0m        Show this help message\n`);
  console.log(`\x1b[1mEXAMPLES:\x1b[0m`);
  console.log(`  npx the-developer install`);
  console.log(`  npx the-developer install ./my-project`);
  console.log(`  npx the-developer list`);
  console.log(`  npx the-developer info scroll-craft\n`);
}

function listSkills() {
  printHeader();
  console.log(`\x1b[1mAvailable Skills & Agents (${SKILLS.length}):\x1b[0m\n`);
  for (const skill of SKILLS) {
    console.log(`  \x1b[33m• ${skill.name.padEnd(28)}\x1b[0m ${skill.description}`);
  }
  console.log('\nInstall them into your project using: \x1b[36mnpx the-developer install\x1b[0m\n');
}

function showSkillInfo(skillName) {
  const skill = SKILLS.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
  if (!skill) {
    console.error(`\x1b[31mError: Skill "${skillName}" not found.\x1b[0m`);
    console.log(`Run \x1b[33mnpx the-developer list\x1b[0m to see all available skills.`);
    process.exit(1);
  }

  const skillFilePath = path.join(packageRoot, '.agents', 'skills', skill.folder, 'SKILL.md');
  if (!fs.existsSync(skillFilePath)) {
    console.error(`\x1b[31mError: Documentation for "${skillName}" not found.\x1b[0m`);
    process.exit(1);
  }

  const content = fs.readFileSync(skillFilePath, 'utf8');
  console.log(`\x1b[1m\x1b[34m=== ${skill.name} ===\x1b[0m\n`);
  console.log(content);
}

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installSkills(targetDir = process.cwd()) {
  printHeader();
  const resolvedTarget = path.resolve(process.cwd(), targetDir);
  const targetSkillsDir = path.join(resolvedTarget, '.agents', 'skills');
  const sourceSkillsDir = path.join(packageRoot, '.agents', 'skills');

  if (!fs.existsSync(sourceSkillsDir)) {
    console.error(`\x1b[31mError: Source skills directory not found in package.\x1b[0m`);
    process.exit(1);
  }

  console.log(`Installing skills to: \x1b[33m${targetSkillsDir}\x1b[0m\n`);

  fs.mkdirSync(targetSkillsDir, { recursive: true });

  let installedCount = 0;
  for (const skill of SKILLS) {
    const src = path.join(sourceSkillsDir, skill.folder);
    const dest = path.join(targetSkillsDir, skill.folder);

    if (fs.existsSync(src)) {
      copyDirectory(src, dest);
      console.log(`  \x1b[32m✔\x1b[0m Installed \x1b[1m${skill.name}\x1b[0m`);
      installedCount++;
    } else {
      console.log(`  \x1b[31m✖\x1b[0m Skipped ${skill.name} (source missing)`);
    }
  }

  // Also write/merge skills-lock.json if appropriate
  const lockSource = path.join(packageRoot, 'skills-lock.json');
  if (fs.existsSync(lockSource)) {
    const destLock = path.join(resolvedTarget, 'skills-lock.json');
    if (!fs.existsSync(destLock)) {
      fs.copyFileSync(lockSource, destLock);
    }
  }

  console.log(`\n\x1b[1m\x1b[32mSuccessfully installed ${installedCount} skills!\x1b[0m`);
  console.log(`Your AI agents in Antigravity, Cursor, and Claude Code can now discover and use these skills.\n`);
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
const args = process.argv.slice(2);
const command = args[0] || '--help';

switch (command) {
  case 'install':
  case 'add':
    installSkills(args[1]);
    break;
  case 'list':
  case 'ls':
    listSkills();
    break;
  case 'info':
    if (!args[1]) {
      console.error('\x1b[31mError: Please specify a skill name. Example: npx the-developer info hallmark\x1b[0m');
      process.exit(1);
    }
    showSkillInfo(args[1]);
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
