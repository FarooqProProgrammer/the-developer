import fs from 'node:fs';
import { platforms, projectPath, installToolkit } from './installer.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'workflows');
export const agentNames = fs.readdirSync(path.join(assets, 'agents')).filter(n => n.endsWith('.md')).map(n => n.slice(0, -3));
const targets = Object.fromEntries(Object.entries(platforms).map(([name, p]) => [name, p.base]));
const safePath = projectPath;
function writeFiles(base, files) {
  const planned = files.map(([name, content]) => [safePath(base, name), content]);
  for (const [file, content] of planned) {
    if (fs.existsSync(file) && (!fs.statSync(file).isFile() || fs.readFileSync(file, 'utf8') !== content)) throw new Error(`Existing file differs; refusing to overwrite ${file}`);
  }
  for (const [file, content] of planned) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (!fs.existsSync(file)) fs.writeFileSync(file, content, { flag: 'wx' });
  }
}
export function parseWorkflowArgs(args) {
  const options = { preset: 'frontend', target: 'antigravity', project: process.cwd() };
  const positionals = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith('-')) { positionals.push(arg); continue; }
    if (arg === '--all' || arg === '-a') { options.target = 'all'; continue; }
    if (arg.startsWith('-t=')) { options.target = arg.slice(3); continue; }
    if (arg === '--dry-run') { options.dryRun = true; continue; }
    const match = arg.match(/^--(preset|target|project)(?:=(.*))?$/);
    if (!match) throw new Error(`Unknown option: ${arg}`);
    const value = match[2] ?? args[++i];
    if (!value || value.startsWith('-')) throw new Error(`Missing value for --${match[1]}`);
    options[match[1]] = value;
  }
  if (!['frontend', 'fullstack'].includes(options.preset)) throw new Error('Preset must be frontend or fullstack.');
  if (options.target !== 'all' && options.target.split(',').some(t => !targets[t])) throw new Error(`Unsupported target: ${options.target}`);
  return { options, positionals };
}
export function initFullstack(project, target) {
  installToolkit(project, target.split(','), 'fullstack');
}
function featureDir(project, feature) {
  if (!feature || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(feature)) throw new Error('Use a lowercase feature name such as 001-user-auth.');
  return safePath(path.resolve(project), `.specs/features/${feature}`);
}
export function scaffold(command, project, feature) {
  const dir = featureDir(project, feature);
  const prerequisites = { plan: ['spec.md'], tasks: ['spec.md', 'plan.md'] };
  for (const name of prerequisites[command] ?? []) if (!fs.existsSync(path.join(dir, name))) throw new Error(`Run the previous workflow stage first: missing ${name}`);
  const names = command === 'specify' ? ['spec.md'] : command === 'plan' ? ['plan.md'] : ['tasks.md', 'verification.md'];
  writeFiles(path.resolve(project), names.map(name => [`.specs/features/${feature}/${name}`, fs.readFileSync(path.join(assets, 'templates', name), 'utf8').replaceAll('{{feature}}', feature)]));
  console.log(`Created ${names.join(', ')} for ${feature}. Fill in the templates; this command does not generate implementation decisions.`);
}
export function verify(project, feature) {
  const dir = featureDir(project, feature);
  const issues = [];
  for (const name of ['spec.md', 'plan.md', 'tasks.md', 'verification.md']) {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) { issues.push(`${name}: missing`); continue; }
    const content = fs.readFileSync(file, 'utf8');
    if (/TODO|\{\{.*?\}\}|Status:\s*draft/i.test(content)) issues.push(`${name}: draft or unresolved placeholders`);
    if (name === 'verification.md' && /^\|[^\n]*\|\s*(?:unrun|failed)\s*\|\s*$/im.test(content)) issues.push(`${name}: unresolved check outcomes`);
  }
  if (issues.length) throw new Error(`Workflow document check failed:\n${issues.join('\n')}`);
  console.log('Workflow documents contain no draft markers or unresolved placeholders. This is a document check only; it does not execute tests or establish application readiness.');
}
