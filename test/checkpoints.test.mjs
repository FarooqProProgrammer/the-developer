import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';
const cli=path.resolve('bin/cli.mjs');
function fixture(fn) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'checkpoint-test-'));
  try {
    const git=(...args)=>execFileSync('git',['-C',dir,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
    git('init');git('config','user.name','Checkpoint Test');git('config','user.email','checkpoint@example.test');
    const write=(name,data)=>{const file=path.join(dir,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof data==='object'?JSON.stringify(data):data);};
    write('src/value.mjs','export const value = 1;\n');write('reference.md','Architecture: transport delegates to services; behavior must preserve the reference.\n');
    git('add','src','reference.md');git('commit','-m','initial reference');const initial=git('rev-parse','HEAD');
    const run=(...args)=>spawnSync(process.execPath,[cli,'checkpoint',...args,`--project=${dir}`],{encoding:'utf8'});
    const pass=(...args)=>{const out=run(...args);assert.equal(out.status,0,out.stderr);return out;};
    const add=(id='cp-001',visual=false)=>pass('add','feature',id,'--title=Small vertical slice','--author=implementer','--scope=src','--reference=reference.md',...(visual?[]:['--logic-only']));
    const status=(id='cp-001')=>JSON.parse(pass('status','feature',id).stdout).checkpoints[0];
    write('cases.json',{cases:[{id:'user-case',command:process.execPath,args:['-e','process.exit(0)']}]});
    const behavior=(id='cp-001')=>pass('run','feature',id,'--checks=cases.json');
    const review=(gate,extra={},id='cp-001')=>{
      const report={checkpoint:id,revision:status(id).revision,reviewer:`${gate}-session`,contextIsolated:true,standards:['reference.md'],verdict:'passed',findings:[],note:'Scoped review completed',...extra};
      const file=`inputs/${gate}.json`;write(file,report);return run('review','feature',id,`--gate=${gate}`,`--evidence=${file}`);
    };
    const approve=()=>pass('approve','feature','cp-001','--by=engineer','--note=Reviewed this specific revision');
    const reviews=()=>{for(const gate of ['review-a','review-b']){const out=review(gate);assert.equal(out.status,0,out.stderr);}};
    fn({dir,git,write,run,pass,add,status,behavior,review,approve,reviews,initial});
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
}
test('ordered checkpoints require real behavior, both reviews, approval and a matching commit',()=>fixture(f=>{
  f.add();f.add('cp-002');f.write('src/value.mjs','export const value = 2;\n');
  assert.notEqual(f.run('run','feature','cp-002','--checks=cases.json').status,0);
  assert.notEqual(f.review('review-a').status,0);
  f.behavior();f.reviews();
  assert.notEqual(f.run('complete','feature','cp-001',`--commit=${f.initial}`).status,0);
  f.approve();assert.notEqual(f.run('complete','feature','cp-001',`--commit=${f.initial}`).status,0);
  f.git('add','src');f.git('commit','-m','checkpoint implementation');const commit=f.git('rev-parse','HEAD');
  f.pass('complete','feature','cp-001',`--commit=${commit}`);
  assert.equal(f.status().status,'complete');assert.equal(f.status().commit,commit);
  f.behavior('cp-002');assert.notEqual(f.run('approve','feature','cp-001','--by=engineer','--note=again').status,0);
  const memory=JSON.parse(fs.readFileSync(path.join(f.dir,'.specs/features/feature/memory.json'),'utf8'));
  assert(memory.entries.some(e=>e.gate==='engineer'&&e.note.includes('specific revision')));
}));
test('behavior failures, empty cases and timeouts block the gate and archive feedback',()=>fixture(f=>{
  f.add();f.write('cases.json',{cases:[]});assert.notEqual(f.run('run','feature','cp-001','--checks=cases.json').status,0);
  f.write('cases.json',{cases:[{id:'failure',command:process.execPath,args:['-e','process.exit(1)']}]});
  assert.notEqual(f.run('run','feature','cp-001','--checks=cases.json').status,0);assert.equal(f.status().gates.behavior,'failed');
  f.write('cases.json',{cases:[{id:'failure',command:process.execPath,args:['-e','setInterval(()=>{},1000)'],timeoutMs:50}]});
  assert.notEqual(f.run('run','feature','cp-001','--checks=cases.json').status,0);
  const state=JSON.parse(fs.readFileSync(path.join(f.dir,'.specs/features/feature/checkpoints.json'),'utf8'));
  assert.equal(state.checkpoints[0].history.length,2);
}));
test('code/reference changes invalidate prior gates and autonomous mode cannot waive technical checks',()=>fixture(f=>{
  f.add();f.behavior();f.reviews();f.approve();
  f.write('src/value.mjs','export const value = 3;\n');assert.equal(f.status().gates.behavior,'pending');assert.equal(f.status().gates['review-a'],'pending');
  f.pass('policy','feature','--approval=autonomous','--by=engineer');
  assert.equal(f.status().gates.engineer,'waived-by-policy');
  assert.notEqual(f.run('complete','feature','cp-001',`--commit=${f.initial}`).status,0);
  f.behavior();f.reviews();f.git('add','src');f.git('commit','-m','updated implementation');
  f.write('reference.md','Changed documented architecture.\n');assert.equal(f.status().gates.behavior,'pending');
  f.behavior();f.reviews();f.pass('complete','feature','cp-001',`--commit=${f.git('rev-parse','HEAD')}`);
}));
test('reviewers must be independent and every open finding blocks approval',()=>fixture(f=>{
  f.add();f.behavior();
  assert.notEqual(f.review('review-a',{reviewer:'implementer'}).status,0);
  assert.notEqual(f.review('review-a',{contextIsolated:false}).status,0);
  assert.notEqual(f.review('review-a',{standards:[]}).status,0);
  assert.notEqual(f.review('review-a',{findings:[{location:'src/value.mjs:1',severity:'low',detail:'Incorrect boundary',status:'open'}]}).status,0);
  assert.equal(f.status().gates['review-a'],'failed');
  assert.equal(f.review('review-a').status,0);
  assert.notEqual(f.review('review-b',{reviewer:'review-a-session'}).status,0);
  assert.equal(f.review('review-b').status,0);
}));
test('visual mismatch is invalid and captures are archived before progressing',()=>fixture(f=>{
  f.add('cp-001',true);f.behavior();
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=','base64');
  fs.mkdirSync(path.join(f.dir,'captures'));fs.writeFileSync(path.join(f.dir,'captures/reference.png'),png);fs.writeFileSync(path.join(f.dir,'captures/implementation.png'),png);
  const visual={scope:['header only'],referenceState:'empty form',implementationState:'submitted form',referenceScreenshot:'captures/reference.png',implementationScreenshot:'captures/implementation.png'};
  assert.notEqual(f.review('visual',visual).status,0);assert.equal(f.status().gates.visual,'invalid');assert.notEqual(f.review('review-a').status,0);
  assert.equal(f.review('visual',{...visual,implementationState:'empty form'}).status,0);f.reviews();f.approve();
  const state=JSON.parse(fs.readFileSync(path.join(f.dir,'.specs/features/feature/checkpoints.json'),'utf8'));
  const artifact=JSON.parse(fs.readFileSync(path.join(f.dir,state.checkpoints[0].gates.visual.artifact),'utf8'));
  assert.equal(artifact.images.length,2);assert(fs.existsSync(path.join(f.dir,artifact.images[0].path)));
  fs.unlinkSync(path.join(f.dir,'captures/reference.png'));
  f.pass('complete','feature','cp-001',`--commit=${f.initial}`);
}));
test('missing/tampered evidence and active mutation locks prevent completion',()=>fixture(f=>{
  f.add();f.behavior();f.reviews();f.approve();
  const state=JSON.parse(fs.readFileSync(path.join(f.dir,'.specs/features/feature/checkpoints.json'),'utf8'));
  f.write(state.checkpoints[0].gates['review-a'].artifact,'tampered');
  assert.notEqual(f.run('complete','feature','cp-001',`--commit=${f.initial}`).status,0);
  f.write('.specs/features/feature/checkpoints.lock','test lock');
  assert.notEqual(f.run('policy','feature','--approval=autonomous','--by=engineer').status,0);
}));

test('changing the behavior manifest invalidates gates and failing cases cannot be dropped',()=>fixture(f=>{
  f.add();f.behavior();f.reviews();f.approve();
  f.write('cases.json',{cases:[{id:'user-case',command:process.execPath,args:['-e','process.exit(0)']},{id:'edge-case',command:process.execPath,args:['-e','process.exit(1)']}]});
  assert.equal(f.status().gates.behavior,'pending');assert.equal(f.status().gates['review-a'],'pending');
  assert.notEqual(f.run('run','feature','cp-001','--checks=cases.json').status,0);
  f.write('cases.json',{cases:[{id:'user-case',command:process.execPath,args:['-e','process.exit(0)']}]});
  const out=f.run('run','feature','cp-001','--checks=cases.json');assert.notEqual(out.status,0);assert.match(out.stderr,/cannot be removed/);
}));

test('engineer rejection blocks autonomy and rerunning an earlier gate invalidates later approvals',()=>fixture(f=>{
  f.add();f.behavior();f.reviews();f.approve();
  f.pass('reject','feature','cp-001','--by=engineer','--note=Behavior does not meet product expectations');
  f.pass('policy','feature','--approval=autonomous','--by=engineer');
  assert.equal(f.status().gates.engineer,'failed');assert.notEqual(f.run('complete','feature','cp-001',`--commit=${f.initial}`).status,0);
  f.behavior();f.reviews();assert.equal(f.status().gates.engineer,'failed');
  f.pass('policy','feature','--approval=manual','--by=engineer');f.approve();
  f.behavior();assert.equal(f.status().gates['review-a'],'pending');assert.equal(f.status().gates.engineer,'pending');
}));
