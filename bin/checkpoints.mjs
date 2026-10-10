import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';
import { projectPath } from './installer.mjs';
const gates = ['behavior', 'visual', 'review-a', 'review-b', 'engineer'];
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const validId = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
function git(project, args, encoding = 'utf8') { return execFileSync('git', ['-C', project, ...args], { encoding, stdio: ['ignore','pipe','pipe'] }); }
function meaningful(value, label) {
  if (typeof value !== 'string' || !value.trim() || /\bTODO\b|\{\{.*?\}\}/i.test(value)) throw new Error(`${label} must contain a concrete value`);
  return value.trim();
}
function jsonFile(file) {
  if (fs.statSync(file).size > 1024 * 1024) throw new Error('Evidence JSON exceeds 1 MiB');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function save(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  if (fs.existsSync(temp)) throw new Error(`Temporary state file already exists: ${temp}`);
  fs.writeFileSync(temp, JSON.stringify(value,null,2)+'\n', {flag:'wx'});
  fs.renameSync(temp,file);
}
function paths(project, feature) {
  if (!validId(feature)) throw new Error('Use a lowercase feature name');
  const base = `.specs/features/${feature}`;
  return { base, state: projectPath(project,`${base}/checkpoints.json`), memory: projectPath(project,`${base}/memory.json`) };
}
function load(project, feature) {
  const location=paths(project,feature);
  const state=fs.existsSync(location.state)?jsonFile(location.state):{version:1,feature,approval:'manual',checkpoints:[],history:[]};
  if(state.version!==1 || state.feature!==feature || !Array.isArray(state.checkpoints) || !Array.isArray(state.history) || !['manual','autonomous'].includes(state.approval)) throw new Error('Invalid checkpoint state');
  return {state,location};
}
function scopePath(project, value) {
  meaningful(value,'scope');
  const normalized=path.relative(project,projectPath(project,value)).split(path.sep).join('/');
  if (!normalized || normalized.startsWith('.specs/') || normalized==='.specs' || normalized.startsWith('.developer/') || normalized==='.developer' || normalized==='.git' || normalized.startsWith('.git/')) throw new Error('Scope must identify source/test paths, excluding runtime metadata and the project root');
  return normalized;
}
function sourcePaths(project, scopes, commit) {
  if(commit) return git(project,['ls-tree','-r','--name-only','-z',commit,'--',...scopes]).split('\0').filter(Boolean);
  return [...new Set(git(project,['ls-files','--cached','--others','--exclude-standard','-z','--',...scopes]).split('\0').filter(Boolean))];
}
export function revision(project, scopes, commit) {
  const entries=[];
  for(const relative of sourcePaths(project,scopes,commit).sort()) {
    const file=projectPath(project,relative);
    if(commit) {
      const mode=git(project,['ls-tree','-r',commit,'--',relative]).split(' ')[0];
      if(!['100644','100755'].includes(mode)) throw new Error('Checkpoint source must contain regular files, not symlinks or submodules');
      entries.push([relative,mode,digest(git(project,['show',`${commit}:${relative}`],null))]);
    } else if(fs.existsSync(file)) {
      const stat=fs.statSync(file);
      if(!stat.isFile()) throw new Error(`Expected source file: ${relative}`);
      entries.push([relative,stat.mode & 0o111 ? '100755':'100644',digest(fs.readFileSync(file))]);
    }
  }
  return digest(JSON.stringify(entries));
}
function checkpointRevision(project,cp) {
  const references=cp.references.map(ref=>{const file=projectPath(project,ref.path);return [ref.path,digest(fs.readFileSync(file))];});
  const checks=cp.checksPath?[cp.checksPath,digest(fs.readFileSync(projectPath(project,cp.checksPath)))]:null;
  return digest(JSON.stringify({source:revision(project,cp.scopes),references,checks}));
}
function checkpoint(state,id) {
  const cp=state.checkpoints.find(item=>item.id===id);
  if(!cp) throw new Error(`Unknown checkpoint: ${id}`);
  return cp;
}
function active(state,cp) {
  if(cp.status==='complete') throw new Error('Completed checkpoints are immutable; create a new checkpoint');
  if(state.checkpoints.find(item=>item.status!=='complete')?.id!==cp.id) throw new Error('Complete the earlier checkpoint first');
}
function results(cp,current,approval) {
  const rejected=cp.history.slice().reverse().find(row=>row.gate==='engineer'&&row.revision===current)?.verdict==='failed';
  return Object.fromEntries(gates.map(gate=>[gate,gate==='visual'&&!cp.visual?'not-applicable':gate==='engineer'&&rejected?'failed':gate==='engineer'&&approval==='autonomous'?'waived-by-policy':cp.gates[gate]?.revision===current?cp.gates[gate].verdict:'pending']));
}
function requireEarlier(cp,current,approval,gate) {
  const statuses=results(cp,current,approval);
  for(const earlier of gates.slice(0,gates.indexOf(gate))) if(!['passed','not-applicable','waived-by-policy'].includes(statuses[earlier])) throw new Error(`Gate ${earlier} must pass first`);
}
function attemptNumber(project,location,cp) {
  const dir=projectPath(project,`${location.base}/checkpoints/${cp.id}/evidence`);
  const used=fs.existsSync(dir)?fs.readdirSync(dir).map(name=>Number(name.match(/^(\d+)-/)?.[1]??0)):[];
  return Math.max(cp.history.length,...used)+1;
}
function archive(project,location,cp,gate,report,extra=[]) {
  const dir=`${location.base}/checkpoints/${cp.id}/evidence`;
  const sequence=attemptNumber(project,location,cp);
  const relative=`${dir}/${String(sequence).padStart(4,'0')}-${gate}.json`;
  const file=projectPath(project,relative);
  const artifact={...report,recordedAt:new Date().toISOString()};
  // Images are archived rather than depending on mutable original captures.
  for(const [name,buffer] of extra) {
    const dest=projectPath(project,`${dir}/${String(sequence).padStart(4,'0')}-${name}`);
    fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,buffer,{flag:'wx'});
  }
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(artifact,null,2)+'\n',{flag:'wx'});
  return {artifact:relative,hash:digest(fs.readFileSync(file))};
}
function record(project,state,location,cp,gate,report,extra=[]) {
  const memory=fs.existsSync(location.memory)?jsonFile(location.memory):{version:1,entries:[]};
  if(memory.version!==1||!Array.isArray(memory.entries)) throw new Error('Invalid feedback memory');
  const archived=archive(project,location,cp,gate,report,extra);
  const invalidate={behavior:['visual','review-a','review-b','engineer'],visual:['review-a','review-b','engineer'],'review-a':['engineer'],'review-b':['engineer'],engineer:[]};
  for(const later of invalidate[gate]) delete cp.gates[later];
  cp.gates[gate]={verdict:report.verdict,revision:report.revision,reviewer:report.reviewer??null,...archived};
  cp.history.push({gate,...cp.gates[gate]});
  memory.entries.push({checkpoint:cp.id,gate,verdict:report.verdict,revision:report.revision,artifact:archived.artifact,note:report.note??'',findings:report.findings??[]});
  save(location.memory,memory);save(location.state,state);
}
function verifyArtifacts(project,cp) {
  for(const gate of Object.values(cp.gates)) {
    const file=projectPath(project,gate.artifact);
    if(!fs.existsSync(file)||digest(fs.readFileSync(file))!==gate.hash) throw new Error('Archived evidence changed or is missing');
    const report=jsonFile(file);
    for(const image of [...(report.images??[]),...(report.referenceSnapshots??[])]) {
      const capture=projectPath(project,image.path);
      if(!fs.existsSync(capture)||digest(fs.readFileSync(capture))!==image.hash) throw new Error('Archived screenshot changed or is missing');
    }
  }
}
function executeCheckpoint(project,action,feature,id,options={}) {
  project=path.resolve(project);
  if (fs.realpathSync(git(project,['rev-parse','--show-toplevel']).trim()) !== fs.realpathSync(project)) throw new Error('Run checkpoints at the Git repository root');
  const {state,location}=load(project,feature);
  if(action==='policy') {
    if(!['manual','autonomous'].includes(options.approval)) throw new Error('Approval policy must be manual or autonomous');
    const by=meaningful(options.by,'policy actor');
    state.approval=options.approval;state.history.push({action:'policy',approval:state.approval,by,at:new Date().toISOString()});save(location.state,state);
    console.log(`Engineer approval policy: ${state.approval}. Technical gates remain mandatory.`);return;
  }
  if(action==='add') {
    if(!validId(id)||state.checkpoints.some(cp=>cp.id===id)) throw new Error('Checkpoint ID must be unique and lowercase');
    const scopes=(options.scope??'').split(',').map(value=>scopePath(project,value.trim()));
    const references=(options.reference??'').split(',').map(value=>{
      meaningful(value,'reference path');const file=projectPath(project,value.trim());
      if(!fs.statSync(file).isFile()) throw new Error('Reference must be a file');
      if (fs.statSync(file).size>1024*1024) throw new Error('Reference files must be at most 1 MiB; choose focused reference slices');
      return {path:path.relative(project,file),hash:digest(fs.readFileSync(file))};
    });
    const cp={id,title:meaningful(options.title,'title'),author:meaningful(options.author,'implementation author'),scopes,references,visual:!options.logicOnly,status:'pending',gates:{},history:[]};
    state.checkpoints.push(cp);save(location.state,state);console.log(`Added ${id}: ${cp.title}`);return;
  }
  if(action==='status') {
    const items=id?[checkpoint(state,id)]:state.checkpoints;
    console.log(JSON.stringify({feature,approval:state.approval,checkpoints:items.map(cp=>{const current=cp.status==='complete'?cp.completedRevision:checkpointRevision(project,cp);return {id:cp.id,title:cp.title,status:cp.status,revision:current,gates:cp.status==='complete'?cp.completedGates:results(cp,current,state.approval),commit:cp.commit??null};})},null,2));return;
  }
  const cp=checkpoint(state,id);active(state,cp);let current=checkpointRevision(project,cp);
  if(action==='run') {
    const checkFile=projectPath(project,meaningful(options.checks,'checks path'));
    const checks=jsonFile(checkFile);
    const checksHash=digest(fs.readFileSync(checkFile));
    if(!Array.isArray(checks.cases)||!checks.cases.length) throw new Error('Behavior requires at least one executable case');
    const ids=new Set();const cases=checks.cases.map(item=>{
      meaningful(item.id,'case ID');if(ids.has(item.id)) throw new Error('Case IDs must be unique');ids.add(item.id);
      meaningful(item.command,'case command');
      if(!Array.isArray(item.args)||item.args.some(arg=>typeof arg!=='string')) throw new Error('Case args must be a string array');
      const cwd=projectPath(project,item.cwd??'.');
      const timeout=item.timeoutMs??30000;if(!Number.isInteger(timeout)||timeout<1||timeout>120000) throw new Error('Case timeout must be 1..120000 ms');
      return {...item,cwd,timeout};
    });
    if((cp.requiredCaseIds??[]).some(id=>!ids.has(id))) throw new Error('Required behavior cases cannot be removed to bypass a failure; create a new checkpoint for changed scope');
    cp.requiredCaseIds=[...new Set([...(cp.requiredCaseIds??[]),...ids])];
    cp.checksPath=path.relative(project,checkFile);current=checkpointRevision(project,cp);
    const references=cp.references.map((ref,index)=>{
      const name=`reference-${index+1}-${path.basename(ref.path)}`;
      const buffer=fs.readFileSync(projectPath(project,ref.path));
      return {name,buffer,path:`${location.base}/checkpoints/${id}/evidence/${String(attemptNumber(project,location,cp)).padStart(4,'0')}-${name}`,hash:digest(buffer)};
    });
    const outcomes=cases.map(item=>{const start=Date.now();const result=spawnSync(item.command,item.args,{cwd:item.cwd,encoding:'utf8',shell:false,timeout:item.timeout,maxBuffer:1024*1024});return {id:item.id,command:item.command,exitCode:result.status,signal:result.signal,error:result.error?.code??null,durationMs:Date.now()-start,passed:!result.error&&result.status===0};});
    const after=checkpointRevision(project,cp);
    const verdict=outcomes.every(item=>item.passed)&&after===current?'passed':'failed';
    record(project,state,location,cp,'behavior',{checkpoint:id,revision:current,verdict,cases:outcomes,checksPath:cp.checksPath,checksHash,referenceSnapshots:references.map(({path,hash})=>({path,hash})),note:after!==current?'Source or reference changed while behavior cases ran':''},references.map(({name,buffer})=>[name,buffer]));
    console.log(`Behavior ${verdict}: ${outcomes.filter(item=>item.passed).length}/${outcomes.length} cases. Output is suppressed; rerun failed cases manually.`);
    if(verdict!=='passed') throw new Error('Behavior gate failed');return;
  }
  if(action==='review') {
    const gate=options.gate;if(!['visual','review-a','review-b'].includes(gate)) throw new Error('Review gate must be visual, review-a or review-b');
    if(gate==='visual'&&!cp.visual) throw new Error('Logic-only checkpoints do not need visual review');
    // Both independent reviewers may evaluate the same revision in parallel.
    requireEarlier(cp,current,state.approval,gate==='review-b'?'review-a':gate);
    const report=jsonFile(projectPath(project,meaningful(options.evidence,'evidence path')));
    if(report.checkpoint!==id||report.revision!==current) throw new Error('Evidence must match the checkpoint and current revision');
    meaningful(report.reviewer,'reviewer');if(report.reviewer===cp.author) throw new Error('Implementer cannot review their own checkpoint');
    if(!['passed','failed','invalid'].includes(report.verdict)||!Array.isArray(report.findings)) throw new Error('Review needs a verdict and findings array');
    for(const finding of report.findings) {
      meaningful(finding.location,'finding location');meaningful(finding.detail,'finding detail');
      if(!['low','medium','high','critical'].includes(finding.severity)||!['open','fixed'].includes(finding.status)) throw new Error('Findings require severity and open/fixed status');
    }
    if(report.verdict==='passed'&&report.findings.some(f=>f.status!=='fixed')) report.verdict='failed';
    const extra=[];
    if(gate==='visual') {
      meaningful(report.referenceState,'reference state');meaningful(report.implementationState,'implementation state');
      if(report.referenceState!==report.implementationState) report.verdict='invalid';
      if(!Array.isArray(report.scope)||!report.scope.length||report.scope.some(v=>typeof v!=='string'||!v.trim())) throw new Error('Visual review needs explicit checkpoint comparison scope');
      report.images=[];
      for(const key of ['referenceScreenshot','implementationScreenshot']) {
        const file=projectPath(project,meaningful(report[key],key));const ext=path.extname(file).toLowerCase();
        if(!['.png','.jpg','.jpeg','.webp'].includes(ext)||fs.statSync(file).size>10*1024*1024) throw new Error('Screenshots must be PNG/JPEG/WebP files up to 10 MiB');
        const buffer=fs.readFileSync(file), name=`${key}${ext}`, relative=`${location.base}/checkpoints/${id}/evidence/${String(attemptNumber(project,location,cp)).padStart(4,'0')}-${name}`;
        extra.push([name,buffer]);report.images.push({path:relative,hash:digest(buffer)});
      }
    } else {
      if(!Array.isArray(report.standards)||!report.standards.length) throw new Error('Code review must name documented architecture standards');
      for(const standard of report.standards) {
        const file=projectPath(project,meaningful(standard,'standards path'));
        if(!cp.references.some(ref=>projectPath(project,ref.path)===file)) throw new Error('Architecture standards must be included in checkpoint references');
        const text=fs.readFileSync(file,'utf8');
        if(!text.trim()||/\bTODO\b|Status:\s*draft/i.test(text)) throw new Error('Complete the architecture standards before code review');
      }
      if(report.contextIsolated!==true) throw new Error('Code reviews must declare isolated context');
      const other=cp.gates[gate==='review-a'?'review-b':'review-a'];
      if(other?.revision===current&&other.reviewer===report.reviewer) throw new Error('Two distinct code reviewers are required');
    }
    if(checkpointRevision(project,cp)!==current) throw new Error('Source or reference changed while recording review');
    record(project,state,location,cp,gate,report,extra);console.log(`${gate}: ${report.verdict}`);
    if(report.verdict!=='passed') throw new Error(`${gate} gate did not pass`);return;
  }
  if(action==='approve'||action==='reject') {
    if(action==='approve') requireEarlier(cp,current,state.approval,'engineer');
    const reviewer=meaningful(options.by,'engineer identity');
    record(project,state,location,cp,'engineer',{checkpoint:id,revision:current,verdict:action==='approve'?'passed':'failed',reviewer,note:meaningful(options.note,'engineer feedback')});
    console.log(`Engineer ${action==='approve'?'approval':'rejection'} recorded. Identity is declared, not authenticated by this CLI.`);return;
  }
  if(action==='complete') {
    const statuses=results(cp,current,state.approval);
    if(Object.values(statuses).some(v=>!['passed','not-applicable','waived-by-policy'].includes(v))) throw new Error('All applicable gates must pass at the current revision');
    verifyArtifacts(project,cp);
    if(!options.commit||!/^[a-f0-9]{7,40}$/i.test(options.commit)) throw new Error('Complete requires the checkpoint implementation commit SHA');
    const commit=git(project,['rev-parse','--verify',`${options.commit}^{commit}`]).trim();
    if(revision(project,cp.scopes,commit)!==revision(project,cp.scopes)) throw new Error('Commit source does not match the reviewed checkpoint');
    if(checkpointRevision(project,cp)!==current) throw new Error('Source or reference changed while completing checkpoint');
    cp.status='complete';cp.commit=commit;cp.completedGates=statuses;cp.completedRevision=current;cp.completedAt=new Date().toISOString();save(location.state,state);
    console.log(`Completed ${id} at ${commit}. Next checkpoint may begin.`);return;
  }
  throw new Error(`Unknown checkpoint action: ${action}`);
}
export function parseCheckpointArgs(args) {
  const options={project:process.cwd()},positionals=[];
  const names=['project','title','author','scope','reference','checks','gate','evidence','by','note','approval','commit'];
  for(let i=0;i<args.length;i++) {
    const arg=args[i];if(arg==='--logic-only'){options.logicOnly=true;continue;}
    if(!arg.startsWith('-')){positionals.push(arg);continue;}
    const match=arg.match(/^--([^=]+)(?:=(.*))?$/);
    if(!match||!names.includes(match[1])) throw new Error(`Unknown checkpoint option: ${arg}`);
    if(match[1] in options && match[1]!=='project') throw new Error(`Duplicate checkpoint option: ${match[1]}`);
    const value=match[2]??args[++i];if(!value||value.startsWith('--')) throw new Error(`Missing ${match[1]}`);options[match[1]]=value;
  }
  const [action,feature,id,...extra]=positionals;
  if((action==='policy'&&id)||extra.length||!feature||(!['status','policy'].includes(action)&&!id)) throw new Error('Usage: checkpoint <add|run|review|approve|reject|complete|status|policy> <feature> [id] [options]');
  return {action,feature,id,options};
}

export function checkpointCommand(project,action,feature,id,options={}) {
  if(!['add','run','review','approve','reject','complete','status','policy'].includes(action)) throw new Error(`Unknown checkpoint action: ${action}`);
  project=path.resolve(project);
  if (fs.realpathSync(git(project,['rev-parse','--show-toplevel']).trim()) !== fs.realpathSync(project)) throw new Error('Run checkpoints at the Git repository root');
  if(action==='status') return executeCheckpoint(project,action,feature,id,options);
  const file=projectPath(project,`${paths(project,feature).base}/checkpoints.lock`);
  fs.mkdirSync(path.dirname(file),{recursive:true});
  let lock;
  try {lock=fs.openSync(file,'wx');} catch(error) {if(error.code==='EEXIST') throw new Error('Another checkpoint command holds the feature lock. Remove a stale lock only after confirming no command is running.');throw error;}
  try {fs.writeFileSync(lock,String(process.pid));return executeCheckpoint(project,action,feature,id,options);}
  finally {fs.closeSync(lock);fs.unlinkSync(file);}
}
