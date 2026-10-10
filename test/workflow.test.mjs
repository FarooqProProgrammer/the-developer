import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const cli = path.resolve('bin/cli.mjs');
function run(...args) { return spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' }); }
function temporary(fn) { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'developer-test-')); try { fn(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); } }
function pass(...args) { const result = run(...args); assert.equal(result.status, 0, result.stderr); return result.stdout; }
test('legacy listing and all skill documentation work', () => {
  assert.match(pass('list'), /Available Skills & Agents \(13\)/);
  for (const name of ['css-design-tokens','frontend-designer','hallmark','micro-animation-interaction','scroll-craft','tailwindcss']) assert.match(pass('info', name), /\S/);
});
test('both presets work across all targets and fullstack initialization is repeatable', () => temporary(dir => {
  for (const target of ['antigravity','cursor','claude','windsurf','copilot','codex']) {
    const project = path.join(dir, target);
    pass('init', project, '--preset=fullstack', `--target=${target}`);
    pass('init', project, '--preset=fullstack', `--target=${target}`);
    const ecosystem = {antigravity:'.agents',cursor:'.cursor',claude:'.claude',windsurf:'.windsurf',copilot:'.github',codex:'.codex'}[target];
    if (target === 'antigravity' || target === 'windsurf') {
      assert.equal(fs.readdirSync(path.join(project,ecosystem,'workflows')).filter(n => n.startsWith('role-')).length,9);
    } else assert.equal(fs.readdirSync(path.join(project, ecosystem, 'agents')).length, 9);
    assert.equal(fs.readdirSync(path.join(project, target === 'codex' ? '.agents' : ecosystem, 'skills')).length, 19);
    assert(fs.existsSync(path.join(project, '.specs/constitution.md')));
  }
  const frontend = path.join(dir, 'frontend'); pass('init', frontend);
  assert(!fs.existsSync(path.join(frontend, '.specs')));
}));
test('feature stages enforce prerequisites and draft verification fails', () => temporary(dir => {
  assert.notEqual(run('plan','auth','--project',dir).status, 0);
  pass('specify','auth','--project',dir);
  pass('plan','auth','--project',dir);
  pass('tasks','auth','--project',dir);
  assert.notEqual(run('verify','auth','--project',dir).status, 0);
  assert.equal(fs.readdirSync(path.join(dir,'.specs/features/auth')).length, 4);
  const spec = path.join(dir,'.specs/features/auth/spec.md'); fs.writeFileSync(spec,'User specification');
  assert.notEqual(run('specify','auth','--project',dir).status, 0);
  assert.equal(fs.readFileSync(spec,'utf8'),'User specification');
}));
test('unsafe feature names, options and symlink paths are rejected', () => temporary(dir => {
  for (const feature of ['../escape','a/b','AUTH']) assert.notEqual(run('specify',feature,'--project',dir).status,0);
  assert.notEqual(run('init',dir,'--preset=bad').status,0);
  assert.notEqual(run('init',dir,'--target=bad').status,0);
  assert.notEqual(run('init',dir,'--unknown').status,0);
  const outside = path.join(dir,'outside'); fs.mkdirSync(outside); fs.symlinkSync(outside,path.join(dir,'.specs'));
  assert.notEqual(run('specify','auth','--project',dir).status,0);
  assert.deepEqual(fs.readdirSync(outside),[]);
}));
test('skill installation preserves modified user files', () => temporary(dir => {
  pass('install',dir,'--all');
  const file=path.join(dir,'.cursor/skills/hallmark/SKILL.md'); fs.writeFileSync(file,'User content');
  assert.notEqual(run('install',dir,'--all').status,0);
  assert.equal(fs.readFileSync(file,'utf8'),'User content');
}));
test('agents command exposes the hierarchy', () => {
  const output=pass('agents','list'); assert.match(output,/orchestrator/); assert.match(output,/backend-developer/);
  assert.notEqual(run('agents','unknown').status,0);
});
test('completed documents pass the document check, failed outcomes do not', () => temporary(dir => {
  pass('specify','auth','--project',dir); pass('plan','auth','--project',dir); pass('tasks','auth','--project',dir);
  const base=path.join(dir,'.specs/features/auth');
  for (const name of ['spec.md','plan.md','tasks.md']) fs.writeFileSync(path.join(base,name),'Status: reviewed\nDocumented decisions.');
  const evidence=path.join(base,'verification.md');
  fs.writeFileSync(evidence,'Status: reviewed\n| AC-001 | npm test | success | success | passed |\n');
  assert.match(pass('verify','auth','--project',dir),/document check only/);
  fs.writeFileSync(evidence,'Status: reviewed\n| AC-001 | npm test | success | error | failed |\n');
  assert.notEqual(run('verify','auth','--project',dir).status,0);
}));
