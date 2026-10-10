import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const cli=path.resolve('bin/cli.mjs');
function run(args){return spawnSync(process.execPath,[cli,...args],{encoding:'utf8'});}
function project(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'toolkit-test-'));try{fn(dir);}finally{fs.rmSync(dir,{recursive:true,force:true});}}
function install(dir,...flags){const out=run(['install',dir,...flags]);assert.equal(out.status,0,out.stderr);}
function write(dir,name,content){const file=path.join(dir,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);}
function json(dir,name){return JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));}
test('single command installs every host, skill, workflow, agent and hook runner',()=>project(dir=>{
  install(dir,'--all');
  for(const platform of ['.agents','.cursor','.claude','.windsurf','.github']) assert.equal(fs.readdirSync(path.join(dir,platform,'skills')).length,19);
  assert.match(fs.readFileSync(path.join(dir,'.claude/agents/backend-developer.md'),'utf8'),/model: inherit/);
  assert(fs.existsSync(path.join(dir,'.github/agents/backend-developer.agent.md')));
  assert.match(fs.readFileSync(path.join(dir,'.codex/config.toml'),'utf8'),/\[agents.backend_developer\]/);
  assert.match(fs.readFileSync(path.join(dir,'.codex/agents/backend-developer.toml'),'utf8'),/^developer_instructions = /);
  assert.equal(fs.readdirSync(path.join(dir,'.developer/agents')).length,13);
  assert.equal(fs.readdirSync(path.join(dir,'.developer/workflows')).length,6);
  assert.equal(json(dir,'.claude/settings.json').hooks.Stop.length,1);
  assert.equal(json(dir,'.cursor/hooks.json').hooks.stop.length,1);
  assert.equal(json(dir,'.github/hooks/the-developer.json').hooks.sessionEnd.length,1);
  const before=fs.readFileSync(path.join(dir,'.developer/manifest.json'),'utf8');
  install(dir,'--all');assert.equal(fs.readFileSync(path.join(dir,'.developer/manifest.json'),'utf8'),before);
}));
test('user settings and hooks survive installation without duplicate entries',()=>project(dir=>{
  write(dir,'.claude/settings.json',JSON.stringify({permissions:{deny:['Bash(rm:*)']},hooks:{Stop:[{hooks:[{type:'command',command:'echo existing'}]}]}}));
  write(dir,'.cursor/hooks.json',JSON.stringify({version:1,custom:'keep',hooks:{stop:[{command:'echo existing'}]}}));
  write(dir,'.codex/config.toml','model = "existing-model"\n[agents.custom]\ndescription = "User role"\n');
  install(dir,'--all');install(dir,'--all');
  assert.deepEqual(json(dir,'.claude/settings.json').permissions,{deny:['Bash(rm:*)']});
  assert.equal(json(dir,'.claude/settings.json').hooks.Stop.length,2);
  assert.equal(json(dir,'.cursor/hooks.json').custom,'keep');
  assert.equal(json(dir,'.cursor/hooks.json').hooks.stop.length,2);
  assert.match(fs.readFileSync(path.join(dir,'.codex/config.toml'),'utf8'),/\[agents.custom\]/);
}));
test('dry run changes nothing and conflicts prevent writes to all destinations',()=>project(dir=>{
  assert.equal(run(['install',dir,'--all','--dry-run']).status,0);assert.deepEqual(fs.readdirSync(dir),[]);
  write(dir,'.claude/agents/backend-developer.md','custom role');
  assert.notEqual(run(['install',dir,'--all']).status,0);
  assert(!fs.existsSync(path.join(dir,'.developer')));assert(!fs.existsSync(path.join(dir,'.cursor')));
  assert.equal(fs.readFileSync(path.join(dir,'.claude/agents/backend-developer.md'),'utf8'),'custom role');
}));
test('modified installed files and managed Codex tables are protected',()=>project(dir=>{
  install(dir,'--all');write(dir,'.developer/agents/backend-developer.md','user edits');
  assert.notEqual(run(['install',dir,'--all']).status,0);
  assert.equal(fs.readFileSync(path.join(dir,'.developer/agents/backend-developer.md'),'utf8'),'user edits');
}));
test('dangling symlinks cannot be followed',()=>project(dir=>{
  fs.symlinkSync(path.join(dir,'missing'),path.join(dir,'.claude'));
  assert.notEqual(run(['install',dir,'--target=claude']).status,0);
  assert(!fs.existsSync(path.join(dir,'missing')));
}));
test('hook runner executes real checks and returns host-specific failures without output leaks',()=>project(dir=>{
  install(dir,'--all');const hook=path.join(dir,'.developer/hooks/check.mjs');
  const execute=(mode='manual',event={})=>spawnSync(process.execPath,[hook,mode],{encoding:'utf8',input:JSON.stringify(event)});
  assert.match(execute().stdout,/No checks configured/);
  write(dir,'.developer/checks.json',JSON.stringify({commands:[{command:process.execPath,args:['-e','process.exit(0)']}]}));
  assert.equal(execute().status,0);assert.match(execute().stdout,/1 configured checks passed/);
  write(dir,'.developer/checks.json',JSON.stringify({commands:[{command:process.execPath,args:['-e','console.log("secret-marker");process.exit(1)']}]}));
  for(const mode of ['manual','claude','codex']){
    const out=execute(mode);assert.equal(out.status,mode==='manual'?1:2);assert(!`${out.stdout}${out.stderr}`.includes('secret-marker'));
  }
  const cursor=execute('cursor');assert.equal(cursor.status,0);assert.deepEqual(JSON.parse(cursor.stdout),{});
  assert.equal(execute('claude',{stop_hook_active:true}).status,0);
  write(dir,'.developer/checks.json',JSON.stringify({commands:[{command:process.execPath,args:[],cwd:'../outside'}]}));
  assert.notEqual(execute().status,0);
}));
test('packaged CLI includes and installs all adapters and runtime assets',()=>project(dir=>{
  const result=spawnSync('npm',['pack','--json','--pack-destination',dir],{encoding:'utf8',env:{...process.env,npm_config_cache:path.join(dir,'cache')}});
  assert.equal(result.status,0,result.stderr);const pack=JSON.parse(result.stdout)[0];
  assert(!pack.files.some(f=>f.path.startsWith('school-dashboard/')));
  assert(pack.files.some(f=>f.path==='workflows/hooks/check.mjs'));
  assert.equal(spawnSync('tar',['-xzf',path.join(dir,pack.filename),'-C',dir]).status,0);
  const out=spawnSync(process.execPath,[path.join(dir,'package/bin/cli.mjs'),'install',path.join(dir,'consumer'),'--all'],{encoding:'utf8'});
  assert.equal(out.status,0,out.stderr);
  assert(fs.existsSync(path.join(dir,'consumer/.codex/config.toml')));
}));
