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

// Target ecosystem mapping
const ECOSYSTEM_TARGETS = {
  antigravity: {
    label: 'Google Antigravity',
    relPath: path.join('.agents', 'skills')
  },
  cursor: {
    label: 'Cursor IDE',
    relPath: path.join('.cursor', 'skills')
  },
  claude: {
    label: 'Claude Code',
    relPath: path.join('.claude', 'skills')
  },
  windsurf: {
    label: 'Windsurf / Codeium',
    relPath: path.join('.windsurf', 'skills')
  },
  copilot: {
    label: 'GitHub Copilot',
    relPath: path.join('.github', 'skills')
  }
};

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
  console.log(`  \x1b[32minstall [dir] [flags]\x1b[0m   Install skills into target ecosystem(s) (default: antigravity / .agents/skills)`);
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
  console.log(`  \x1b[33m--target=all, --all\x1b[0m    Install to ALL supported ecosystems simultaneously\n`);
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
  console.log('\nSupported Ecosystems: \x1b[36mAntigravity, Cursor, Claude Code, Windsurf, Copilot\x1b[0m');
  console.log('Install them using: \x1b[36mnpx the-developer install [--target=<name> | --all]\x1b[0m\n');
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

function installSkills(targetDir = process.cwd(), targets = ['antigravity']) {
  printHeader();
  const resolvedTargetBase = path.resolve(process.cwd(), targetDir);
  const sourceSkillsDir = path.join(packageRoot, '.agents', 'skills');

  if (!fs.existsSync(sourceSkillsDir)) {
    console.error(`\x1b[31mError: Source skills directory not found in package.\x1b[0m`);
    process.exit(1);
  }

  // Resolve ecosystems
  let targetEcosystems = [];
  if (targets.includes('all')) {
    targetEcosystems = Object.keys(ECOSYSTEM_TARGETS);
  } else {
    for (const t of targets) {
      const clean = t.toLowerCase();
      if (ECOSYSTEM_TARGETS[clean]) {
        targetEcosystems.push(clean);
      } else {
        console.warn(`\x1b[33mWarning: Unknown ecosystem target "${t}". Supported: ${Object.keys(ECOSYSTEM_TARGETS).join(', ')}, all\x1b[0m`);
      }
    }
    if (targetEcosystems.length === 0) {
      targetEcosystems = ['antigravity'];
    }
  }

  console.log(`Target Directory:  \x1b[36m${resolvedTargetBase}\x1b[0m`);
  console.log(`Ecosystem(s):      \x1b[32m${targetEcosystems.map((k) => ECOSYSTEM_TARGETS[k].label).join(', ')}\x1b[0m\n`);

  let totalInstalled = 0;

  for (const ecoKey of targetEcosystems) {
    const eco = ECOSYSTEM_TARGETS[ecoKey];
    const destinationDir = path.join(resolvedTargetBase, eco.relPath);

    console.log(`\x1b[1m📂 Installing for ${eco.label} -> ${destinationDir}\x1b[0m`);
    fs.mkdirSync(destinationDir, { recursive: true });

    let count = 0;
    for (const skill of SKILLS) {
      const src = path.join(sourceSkillsDir, skill.folder);
      const dest = path.join(destinationDir, skill.folder);

      if (fs.existsSync(src)) {
        copyDirectory(src, dest);
        console.log(`  \x1b[32m✔\x1b[0m [${ecoKey}] Installed \x1b[1m${skill.name}\x1b[0m`);
        count++;
      } else {
        console.log(`  \x1b[31m✖\x1b[0m Skipped ${skill.name} (source missing)`);
      }
    }
    totalInstalled += count;

    // Write skills-lock.json if in root
    const lockSource = path.join(packageRoot, 'skills-lock.json');
    if (fs.existsSync(lockSource)) {
      const destLock = path.join(resolvedTargetBase, 'skills-lock.json');
      if (!fs.existsSync(destLock)) {
        fs.copyFileSync(lockSource, destLock);
      }
    }
    console.log('');
  }

  console.log(`\x1b[1m\x1b[32m✨ Done! Successfully installed skills across ${targetEcosystems.length} ecosystem(s).\x1b[0m`);
  console.log(`Your AI assistants (${targetEcosystems.map((k) => ECOSYSTEM_TARGETS[k].label).join(', ')}) will now automatically discover these skills.\n`);
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

let parsedDir = process.cwd();
const targetList = [];

for (const arg of rawArgs) {
  if (arg === '--all' || arg === '-a') {
    targetList.push('all');
  } else if (arg.startsWith('--target=')) {
    const val = arg.split('=')[1];
    if (val) {
      val.split(',').forEach((t) => targetList.push(t.trim()));
    }
  } else if (arg.startsWith('-t=')) {
    const val = arg.split('=')[1];
    if (val) {
      val.split(',').forEach((t) => targetList.push(t.trim()));
    }
  } else if (arg !== 'install' && arg !== 'add' && !arg.startsWith('-')) {
    parsedDir = arg;
  }
}

switch (command) {
  case 'install':
  case 'add':
    installSkills(parsedDir, targetList.length > 0 ? targetList : ['antigravity']);
    break;
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
