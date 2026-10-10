import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assets = path.join(root, 'workflows');
export const platforms = {
  antigravity: { base: '.agents', skills: '.agents/skills', agents: 'workflow roles', hooks: 'manual' },
  cursor: { base: '.cursor', skills: '.cursor/skills', agents: 'Markdown subagents', hooks: 'stop (advisory)' },
  claude: { base: '.claude', skills: '.claude/skills', agents: 'Markdown subagents', hooks: 'Stop' },
  windsurf: { base: '.windsurf', skills: '.windsurf/skills', agents: 'workflow roles', hooks: 'manual' },
  copilot: { base: '.github', skills: '.github/skills', agents: '.agent.md custom agents', hooks: 'sessionEnd (CLI/cloud agent)' },
  codex: { base: '.codex', skills: '.agents/skills', agents: 'TOML role configuration', hooks: 'Stop (current Codex)' }
};
const stages = ['specify', 'plan', 'tasks', 'implement', 'verify', 'review'];
const hash = content => crypto.createHash('sha256').update(content).digest('hex');
const read = relative => fs.readFileSync(path.join(assets, relative), 'utf8');
const roleNames = fs.readdirSync(path.join(assets, 'agents')).filter(n => n.endsWith('.md')).map(n => n.slice(0, -3));
const workflowText = stage => `# Developer ${stage}\n\nRead project instructions, .specs/constitution.md and the feature documents in .specs/features/.\n\n${({specify:'Define users, scope, edge cases and observable acceptance criteria. Use the spec.md template.',plan:'Inspect the stack and define architecture, API contracts, permissions, data migrations and validation. Use plan.md.',tasks:'Break the agreed plan into tasks with acceptance criteria, dependencies, agent owners and non-overlapping file ownership.',implement:'Use the orchestrator to assign bounded tasks to relevant roles. Agree on contracts before parallel work. Use sequential roles if native delegation is unavailable. Integrate and run relevant project checks.',verify:'Run real project tests and functional checks. Record commands and passed, failed, skipped and unrun results in verification.md. The CLI document check is not a test runner.',review:'Review the integrated result against acceptance criteria, security and operational constraints. Record risks and reviewer decision. Do not deploy or perform destructive migrations without authorization.'})[stage]}\n\nReport evidence, unresolved decisions and the next stage. Small changes may use a shorter workflow. Never claim unrun checks passed.\n`;

// Reject symlinks at every component, including dangling symlinks.
export function projectPath(project, relative) {
  if (path.isAbsolute(relative)) throw new Error(`Expected relative path: ${relative}`);
  const dest = path.resolve(project, relative), base = path.resolve(project);
  if (dest !== base && !dest.startsWith(base + path.sep)) throw new Error('Path must stay inside project');
  let current = path.parse(dest).root;
  for (const part of dest.slice(current.length).split(path.sep)) {
    current = path.join(current, part);
    try {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink()) throw new Error(`Refusing symlink: ${current}`);
      if (current !== dest && !stat.isDirectory()) throw new Error(`Expected directory: ${current}`);
    }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return dest;
}
function collectTree(source, destination, files) {
  for (const item of fs.readdirSync(source, { withFileTypes: true })) {
    if (item.isSymbolicLink()) throw new Error(`Unexpected asset symlink: ${item.name}`);
    if (item.isDirectory()) collectTree(path.join(source,item.name),`${destination}/${item.name}`,files);
    else files.set(`${destination}/${item.name}`,fs.readFileSync(path.join(source,item.name)));
  }
}
function mergeHooks(project, relative, event, entry, files, extra = {}) {
  const file = projectPath(project, relative);
  const config = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error(`Invalid hook configuration: ${relative}`);
  for (const [key,value] of Object.entries(extra)) {
    if (key in config && config[key] !== value) throw new Error(`Unsupported ${key} in ${relative}`);
    config[key] = value;
  }
  config.hooks ??= {};
  if (!config.hooks || typeof config.hooks !== 'object' || Array.isArray(config.hooks)) throw new Error(`Invalid hooks in ${relative}`);
  config.hooks[event] ??= [];
  if (!Array.isArray(config.hooks[event])) throw new Error(`Invalid ${event} hooks in ${relative}`);
  if (!config.hooks[event].some(item => JSON.stringify(item) === JSON.stringify(entry))) config.hooks[event].push(entry);
  files.set(relative,JSON.stringify(config,null,2)+'\n');
}
export function installToolkit(project, selected, preset = 'fullstack', dryRun = false) {
  project = path.resolve(project);
  if (!['frontend','fullstack'].includes(preset)) throw new Error('Preset must be frontend or fullstack');
  const targets = [...new Set(selected.includes('all') ? Object.keys(platforms) : selected)];
  if (!targets.length || targets.some(t => !platforms[t])) throw new Error(`Targets: ${Object.keys(platforms).join(', ')}, all`);
  const files = new Map(), merged = new Set();
  if (!fs.existsSync(projectPath(project,'skills-lock.json'))) files.set('skills-lock.json',fs.readFileSync(path.join(root,'skills-lock.json')));
  for (const target of targets) collectTree(path.join(root,'.agents/skills'),platforms[target].skills,files);
  if (preset === 'fullstack') {
    for (const target of targets) collectTree(path.join(assets,'skills'),platforms[target].skills,files);
    for (const name of roleNames) files.set(`.developer/agents/${name}.md`,read(`agents/${name}.md`));
    files.set('.developer/hooks/check.mjs',read('hooks/check.mjs'));
    if (!fs.existsSync(projectPath(project,'.developer/checks.json'))) files.set('.developer/checks.json',JSON.stringify({commands:[]},null,2)+'\n');
    files.set('.specs/constitution.md',read('templates/constitution.md'));
    collectTree(path.join(assets,'templates'),'.developer/templates',files);
    files.set('.specs/WORKFLOW.md','# Full-stack development\n\nRead constitution.md and .developer/agents/orchestrator.md. Follow specify -> plan -> tasks -> implement -> verify -> review. Native agents are configured for Claude, Cursor, Copilot and current Codex; Windsurf and Antigravity use role workflows. Host capabilities and permissions still apply. See .developer/INSTALLATION.md.\n');
    for (const stage of stages) {
      const body = workflowText(stage);
      files.set(`.developer/workflows/${stage}.md`,body);
      for (const target of targets) {
        const {base,skills} = platforms[target];
        files.set(`${skills}/developer-${stage}/SKILL.md`,`---\nname: developer-${stage}\ndescription: Run the ${stage} stage of the project development workflow.\n---\n\n${body}`);
        if (target === 'claude' || target === 'cursor') files.set(`${base}/commands/developer-${stage}.md`,body+'\nFeature or request: $ARGUMENTS\n');
        if (target === 'copilot') files.set(`${base}/prompts/developer-${stage}.prompt.md`,`---\ndescription: Run the developer ${stage} workflow\nagent: orchestrator\n---\n\n${body}`);
        if (target === 'windsurf' || target === 'antigravity') files.set(`${base}/workflows/developer-${stage}.md`,`---\ndescription: Run the developer ${stage} workflow\n---\n\n${body}`);
      }
    }
    for (const target of targets) {
      const {base} = platforms[target];
      for (const name of roleNames) {
        const original=read(`agents/${name}.md`), body=original.replace(/^---\n[\s\S]*?\n---\n/,''), description=original.match(/^description: (.*)$/m)[1];
        if (target === 'codex') files.set(`${base}/agents/${name}.toml`,`developer_instructions = ${JSON.stringify(body)}\n`);
        else if (target === 'claude') files.set(`${base}/agents/${name}.md`,original.replace('\n---\n','\nmodel: inherit\n---\n'));
        else if (target === 'copilot') files.set(`${base}/agents/${name}.agent.md`,original);
        else if (target === 'cursor') files.set(`${base}/agents/${name}.md`,original);
        else files.set(`${base}/workflows/role-${name}.md`,`---\ndescription: ${description}\n---\n${body}`);
      }
      if (target === 'claude') {
        const relative='.claude/settings.json';
        mergeHooks(project,relative,'Stop',{hooks:[{type:'command',command:'node .developer/hooks/check.mjs claude',timeout:50}]},files); merged.add(relative);
      }
      if (target === 'cursor') {
        const relative='.cursor/hooks.json';
        mergeHooks(project,relative,'stop',{command:'node .developer/hooks/check.mjs cursor'},files,{version:1}); merged.add(relative);
      }
      if (target === 'copilot') {
        const relative='.github/hooks/the-developer.json';
        mergeHooks(project,relative,'sessionEnd',{type:'command',bash:'node .developer/hooks/check.mjs copilot',powershell:'node .developer/hooks/check.mjs copilot',cwd:'.',timeoutSec:50},files,{version:1}); merged.add(relative);
      }
      if (target === 'codex') {
        const relative='.codex/config.toml',file=projectPath(project,relative);
        let config=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
        const start='# BEGIN THE-DEVELOPER',end='# END THE-DEVELOPER';
        const begin=config.indexOf(start),finish=config.indexOf(end);
        if ((begin<0)!==(finish<0) || (begin>=0 && finish<begin)) throw new Error('Malformed managed Codex configuration');
        const oldBlock=begin>=0?config.slice(begin,finish+end.length):'';
        if (oldBlock) config=config.replace(oldBlock,'').trimEnd();
        const manifestFile=projectPath(project,'.developer/manifest.json');
        const previous=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):{};
        if(oldBlock && previous.codexBlockHash && hash(oldBlock)!==previous.codexBlockHash) throw new Error('Managed Codex configuration was edited; reconcile it before reinstalling');
        if (/^\s*agents\s*=/m.test(config) || roleNames.some(name => config.includes(`[agents.${name.replaceAll('-','_')}]`) || new RegExp(`^\\s*(?:agents\\.)?${name.replaceAll('-','_')}\\s*=`,'m').test(config)) || /^\s*hooks\s*=/m.test(config) || /^\s*\[hooks\.Stop\]/m.test(config)) throw new Error('Existing Codex agent/hook tables need manual reconciliation; no settings were overwritten');
        const block=[start,...roleNames.map(name=>`[agents.${name.replaceAll('-','_')}]\ndescription = ${JSON.stringify(read(`agents/${name}.md`).match(/^description: (.*)$/m)[1])}\nconfig_file = "agents/${name}.toml"`),'[[hooks.Stop]]\n[[hooks.Stop.hooks]]\ntype = "command"\ncommand = "node .developer/hooks/check.mjs codex"\ntimeout = 50',end].join('\n\n');
        files.set(relative,(config?config+'\n\n':'')+block+'\n'); merged.add(relative);
      }
    }
    files.set('.developer/INSTALLATION.md',`# Installation\n\nPreset: ${preset}\nTargets: ${targets.join(', ')}\n\n${targets.map(t=>`- ${t}: ${platforms[t].agents}; hooks: ${platforms[t].hooks}.`).join('\n')}\n\nNative agent definitions do not start processes. Reload the assistant after installation. Project trust and host policies can disable agents/hooks. Codex Stop hooks require a version supporting lifecycle hooks; older versions may need that table removed. Windsurf/Antigravity use role workflows rather than fabricated subagent APIs. Copilot custom agents are native profiles, but delegation depends on the host.\n\nConfigure executable checks in .developer/checks.json using command, args, optional cwd and timeoutMs (maximum 45000). Empty checks do no work and do not establish readiness. Claude/Codex Stop hooks return exit 2 on failure. Cursor stop hooks are advisory and never create automatic follow-up loops. Copilot CLI/cloud agent runs checks on sessionEnd and reports failures without a completion gate. Other hosts: run node .developer/hooks/check.mjs manually or from CI. No Git hooks are installed and no user hooks are removed.\n\nExamples: {"commands":[{"command":"npm","args":["test"],"cwd":".","timeoutMs":30000}]}\n\nEach check runs without shell evaluation. Review commands before enabling hooks. Output is suppressed to avoid logging secrets; rerun failed commands manually for details.\n`);
  }
  const manifestPath=projectPath(project,'.developer/manifest.json');
  const previous=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{files:{}};
  const planned=[];
  for (const [relative,value] of files) {
    const content=Buffer.isBuffer(value)?value:Buffer.from(value), dest=projectPath(project,relative);
    if(fs.existsSync(dest)) {
      if(!fs.statSync(dest).isFile()) throw new Error(`Expected file: ${relative}`);
      const old=fs.readFileSync(dest);
      if(!old.equals(content) && !merged.has(relative) && previous.files?.[relative]!==hash(old)) throw new Error(`Existing file differs; refusing to overwrite ${relative}`);
    }
    planned.push([dest,content,relative]);
  }
  if (dryRun) { console.log(`Would install ${planned.length} files for ${targets.join(', ')} (${preset}). No files changed.`); return; }
  // All conflicts and paths are checked before any write.
  for(const [dest,content] of planned) {fs.mkdirSync(path.dirname(dest),{recursive:true});if(!fs.existsSync(dest)||!fs.readFileSync(dest).equals(content))fs.writeFileSync(dest,content);}
  const config=files.get('.codex/config.toml');
  const block=config?.slice(config.indexOf('# BEGIN THE-DEVELOPER')).trimEnd();
  const manifest={version:1,preset,targets:[...new Set([...(previous.targets??[]),...targets])],files:{...previous.files,...Object.fromEntries(planned.map(([,content,relative])=>[relative,hash(content)]))},...(block?{codexBlockHash:hash(block)}:previous.codexBlockHash?{codexBlockHash:previous.codexBlockHash}:{})};
  fs.mkdirSync(path.dirname(manifestPath),{recursive:true});fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
  console.log(`Installed ${preset} toolkit for ${targets.join(', ')}. ${planned.length} files verified. Existing settings and modified files are protected.`);
}
