const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const os=require('node:os');
const vm=require('node:vm');
const {createServer}=require('./server');
test('Fitcheck files, persistent endpoints, server prices and restart',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'fitcheck-'));const file=path.join(dir,'db.json');
 let app;
 const start=async()=>{app=createServer(file);await new Promise(r=>app.listen(0,'127.0.0.1',r));};
 const request=async(method,url,body)=>{
  const r=await fetch(`http://127.0.0.1:${app.address().port}${url}`,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  return {status:r.status,body:r.status===204?null:await r.json()};
 };
 try{
  await start();
  const html=await (await fetch(`http://127.0.0.1:${app.address().port}/`)).text();
  for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
  assert.match(html,/await api\('\/orders'/);
  assert.match(html,/api\('\/products'\)/);
  for(const url of ['/vendor/bootstrap.min.css','/vendor/bootstrap.bundle.min.js','/assets/fitcheck/generated/hoodie.png'])assert.equal((await fetch(`http://127.0.0.1:${app.address().port}${url}`)).status,200);
  assert.equal((await request('GET','/api/products')).body.length,8);
  assert.equal((await fetch(`http://127.0.0.1:${app.address().port}/server.js`)).status,404);
  const product=await request('POST','/api/products',{n:'Test tee',cat:'Tees',p:2000});assert.equal(product.status,201);
  assert.equal((await request('PUT',`/api/products/${product.body.id}`,{n:'Updated tee',cat:'Tees',p:2200})).status,200);
  assert.equal((await request('PUT','/api/carts/demo',{items:{1:2}})).status,200);
  assert.equal((await request('POST','/api/orders',{email:'demo@example.com',items:{1:-1}})).status,400);
  const order=await request('POST','/api/orders',{email:'demo@example.com',items:{1:2},cartId:'demo',total:1});
  assert.equal(order.status,201);assert.equal(order.body.total,9000);
  assert.deepEqual((await request('GET','/api/carts/demo')).body.items,{});
  const review=await request('POST','/api/reviews',{n:'Ali',s:5,t:'Good'});assert.equal(review.status,201);
  assert.equal((await request('PUT','/api/reviews/'+review.body.id,{n:'Ali',s:4,t:'Updated'})).status,200);
  await request('PUT','/api/carts/demo',{items:{2:1}});
  await new Promise(r=>app.close(r));await start();
  assert.equal((await request('GET','/api/orders/'+order.body.id)).body.total,9000);
  assert.equal((await request('GET','/api/products/'+product.body.id)).body.n,'Updated tee');
  assert.equal((await request('GET','/api/reviews/'+review.body.id)).body.s,4);
  assert.deepEqual((await request('GET','/api/carts/demo')).body.items,{2:1});
  assert.equal((await request('DELETE','/api/products/'+product.body.id)).status,204);
  assert.equal((await request('DELETE','/api/reviews/'+review.body.id)).status,204);
  assert.equal((await request('DELETE','/api/carts/demo')).status,204);
 }finally{if(app?.listening)await new Promise(r=>app.close(r));await fs.rm(dir,{recursive:true,force:true});}
});
