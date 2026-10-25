const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createServer}=require('./01-memory-api');
test('CRUD for students, teachers, attendance and marks',async()=>{
 const app=createServer();await new Promise(r=>app.listen(0,'127.0.0.1',r));
 const request=async(method,url,body)=>{
  const r=await fetch(`http://127.0.0.1:${app.address().port}${url}`,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  return {status:r.status,body:r.status===204?null:await r.json()};
 };
 try{
  const records={students:{name:'Ali',rollNumber:'241851'},teachers:{name:'Sara',subject:'CS301'},attendance:{studentId:1,date:'2026-10-25',status:'present'},marks:{studentId:1,subject:'CS301',score:8,maxScore:10}};
  for(const [resource,body] of Object.entries(records)){
   assert.equal((await request('POST','/'+resource,body)).status,201);
   assert.equal((await request('GET','/'+resource)).body.length,1);
   assert.equal((await request('GET','/'+resource+'/1')).body.id,1);
   assert.equal((await request('PUT','/'+resource+'/1',body)).status,200);
  }
  assert.equal((await request('POST','/marks',{...records.marks,score:11})).status,400);
  assert.equal((await request('POST','/attendance',{...records.attendance,studentId:999})).status,400);
  assert.equal((await request('DELETE','/students/1')).status,409);
  for(const resource of ['attendance','marks','students','teachers']){
   assert.equal((await request('DELETE','/'+resource+'/1')).status,204);
   assert.equal((await request('GET','/'+resource+'/1')).status,404);
  }
 }finally{await new Promise(r=>app.close(r));}
 const fresh=createServer();await new Promise(r=>fresh.listen(0,'127.0.0.1',r));
 try{assert.deepEqual(await (await fetch(`http://127.0.0.1:${fresh.address().port}/students`)).json(),[]);}finally{await new Promise(r=>fresh.close(r));}
});
