/* «Τι μεταφέρουμε» — λευκό κοντέινερ στο λιμάνι (3D). Φορτώνει μόνο όταν ο επισκέπτης πλησιάσει την ενότητα. */
(function(){
if(!window.THREE)return;
var host=document.getElementById('scrolly2');if(!host)return;
var started=false;
function start(){if(started)return;started=true;try{init()}catch(e){var st=document.getElementById('stage2');if(st)st.style.background='linear-gradient(#b9dcf5,#1f78b4)';if(window.console)console.warn('kontainer 3D:',e)}}
function init(){
const M=(c,r=.7,m=.1)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const box=(w,h,d,mat)=>{const g=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);return g};

// ---- textures
const TEX=[];
function ribTex(label){
  const cv=document.createElement('canvas');cv.width=1024;cv.height=256;
  const draw=()=>{const x=cv.getContext('2d');
  const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#123a7a');g.addColorStop(1,'#0b2550');x.fillStyle=g;x.fillRect(0,0,1024,256);
  for(let i=0;i<1024;i+=16){x.fillStyle=i%32?'rgba(255,255,255,.05)':'rgba(0,0,0,.22)';x.fillRect(i,0,8,256)}
  if(label){x.fillStyle='#ffffff';x.font='700 66px Unbounded, Arial Black, sans-serif';x.textAlign='center';x.textBaseline='middle';
    x.shadowColor='rgba(31,163,255,.9)';x.shadowBlur=18;x.fillText('ΣΑΛΒΑΝΟΣ',512,104);
    x.shadowBlur=0;x.font='600 34px Manrope, Arial, sans-serif';x.fillStyle='#9fd6ff';x.fillText('Μ Ε Τ Α Φ Ο Ρ Ε Σ',512,170)}};
  draw();const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;TEX.push(()=>{draw();t.needsUpdate=true});return t;
}
function cartonTex(){
  const cv=document.createElement('canvas');cv.width=256;cv.height=256;const x=cv.getContext('2d');
  x.fillStyle='#b98a55';x.fillRect(0,0,256,256);x.fillStyle='#a77945';x.fillRect(0,118,256,20);
  x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=4;x.strokeRect(2,2,252,252);
  x.fillStyle='#0b2550';x.font='700 26px Unbounded, Arial Black, sans-serif';x.textAlign='center';x.fillText('SALVANOS',128,200);
  const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;return t;
}

// ---- cargo items (all sit on y=0, footprint ~1.2 x 1.0)
function palletBase(){
  const g=new THREE.Group(),wood=M(0xc49a63,.9,0);
  for(const z of[-.42,0,.42]){const b=box(1.2,.1,.14,wood);b.position.set(0,.05,z);g.add(b)}
  for(const x of[-.5,0,.5]){const b=box(.14,.06,1,wood);b.position.set(x,.13,0);g.add(b)}
  for(let i=0;i<5;i++){const b=box(1.2,.03,.16,wood);b.position.set(0,.175,-.4+i*.2);g.add(b)}
  return g;
}
const cartonMat=new THREE.MeshStandardMaterial({map:cartonTex(),roughness:.9});
function itemCartons(){const g=palletBase();for(let l=0;l<3;l++)for(let i=0;i<2;i++)for(let j=0;j<2;j++){const b=box(.56,.4,.46,cartonMat);b.position.set(-.29+i*.58,.4+l*.41,-.24+j*.48);g.add(b)}return g}
function itemFridge(){const g=palletBase();const body=box(.8,1.75,.72,M(0xdfe7ef,.35,.25));body.position.y=1.08;g.add(body);
  const line=box(.82,.02,.74,M(0x5b6b80,.5,.3));line.position.y=1.35;g.add(line);
  const h=box(.04,.5,.05,M(0x8a97a8,.3,.6));h.position.set(.3,1.6,.38);g.add(h);const h2=h.clone();h2.position.y=.85;g.add(h2);return g}
function itemSofa(){const g=new THREE.Group(),fab=M(0x2c5d8f,.95,0),leg=M(0x2a1d14,.8,0);
  const seat=box(1.9,.42,.85,fab);seat.position.y=.36;g.add(seat);const back=box(1.9,.55,.22,fab);back.position.set(0,.8,-.32);g.add(back);
  for(const s of[-1,1]){const a=box(.2,.6,.85,fab);a.position.set(s*.95,.45,0);g.add(a)}
  for(const x of[-.8,.8])for(const z of[-.32,.32]){const l=box(.07,.15,.07,leg);l.position.set(x,.07,z);g.add(l)}
  const cush=box(.85,.12,.7,M(0x3a72a8,.95,0));cush.position.set(-.44,.62,.05);g.add(cush);const c2=cush.clone();c2.position.x=.44;g.add(c2);return g}
function itemBuild(){const g=palletBase();const bag=M(0x9aa3ad,.95,0),tile=M(0xc9784b,.8,0);
  for(let l=0;l<3;l++)for(let i=0;i<2;i++){const b=box(.55,.16,.9,bag);b.position.set(-.29+i*.58,.27+l*.17,0);b.rotation.y=(l%2)*.04;g.add(b)}
  for(let i=0;i<3;i++){const t=box(.36,.3,.36,tile);t.position.set(-.38+i*.38,.92,0);g.add(t)}
  const wrap=new THREE.Mesh(new THREE.BoxGeometry(1.22,1.0,1.02),new THREE.MeshStandardMaterial({color:0xcfe9ff,transparent:true,opacity:.12,roughness:.2}));wrap.position.y=.7;g.add(wrap);return g}
function itemStore(){const g=new THREE.Group();
  for(const x of[-.7,.7]){const p=itemCartons();p.scale.setScalar(.85);p.position.x=x;g.add(p)}
  const rack=M(0x1fa3ff,.4,.5);for(const x of[-1.45,0,1.45]){const u=box(.07,2.2,.07,rack);u.position.set(x,1.1,-.6);g.add(u)}
  const sh=box(2.95,.05,.5,M(0x274a7a,.6,.3));sh.position.set(0,2.0,-.42);g.add(sh);return g}
const makers=[itemCartons,itemFridge,itemSofa,itemBuild,itemStore];

const canvas=document.getElementById('c2'),stage=document.getElementById('stage2'),scrolly=document.getElementById('scrolly2');
const hud=[...document.querySelectorAll('#hud2 i')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOW=innerWidth<720||(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=3;
const renderer=new THREE.WebGLRenderer({canvas,antialias:!LOW,powerPreference:'low-power'});
renderer.setPixelRatio(LOW?1:Math.min(devicePixelRatio||1,1.5));renderer.outputEncoding=THREE.sRGBEncoding;
const scene=new THREE.Scene();
// sky
(function(){const cv=document.createElement('canvas');cv.width=8;cv.height=256;const x=cv.getContext('2d');const g=x.createLinearGradient(0,0,0,256);
 g.addColorStop(0,'#5fa8e6');g.addColorStop(.62,'#b9dcf5');g.addColorStop(1,'#eef6fc');x.fillStyle=g;x.fillRect(0,0,8,256);
 const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;scene.background=t})();
scene.fog=new THREE.Fog(0xcfe6f7,50,230);
const cam=new THREE.PerspectiveCamera(38,1,0.1,300);
scene.add(new THREE.HemisphereLight(0xdff1ff,0x2a6f9e,0.9));
const sun=new THREE.DirectionalLight(0xfff3df,1.05);sun.position.set(10,14,9);scene.add(sun);

// quay (top at y=0), sea behind it (z<-4)
const quay=box(80,1.2,10,M(0xbfc4c9,.95,0));quay.position.set(10,-.6,1);scene.add(quay);
const edge=box(80,.18,.35,M(0xe2c23a,.6,0));edge.position.set(10,.02,-3.85);scene.add(edge);
for(let i=0;i<9;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.2,.4,10),M(0x2b2f36,.5,.6));b.position.set(-6+i*4,.2,-3.4);scene.add(b)}
const seaGeo=new THREE.PlaneGeometry(260,160,LOW?40:90,LOW?24:56);seaGeo.rotateX(-Math.PI/2);
const sea=new THREE.Mesh(seaGeo,new THREE.MeshStandardMaterial({color:0x1f78b4,roughness:.32,metalness:.15,flatShading:true}));
sea.position.set(10,-.55,-84);scene.add(sea);
const base=seaGeo.attributes.position.array.slice();

// Samothraki: jagged massif far behind (Fengari)
(function(){const sh=new THREE.Shape();const pts=[[-46,0],[-36,3],[-28,5.5],[-20,9],[-14,12.5],[-9,15],[-5,17.5],[-2,16.4],[0,19.2],[2.5,17],[5,18.2],[8,14.5],[12,12.8],[17,9.5],[24,6.5],[32,4],[44,1.2],[52,0]];
 sh.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>sh.lineTo(p[0],p[1]));sh.lineTo(52,-2);sh.lineTo(-46,-2);
 const m=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:8,bevelEnabled:false}),new THREE.MeshStandardMaterial({color:0x6f8aa6,roughness:1}));
 m.position.set(30,-.6,-112);scene.add(m);
 const sh2=new THREE.Shape();const q=[[-30,0],[-18,3.5],[-8,6],[0,8.5],[9,6.8],[20,3],[32,0]];sh2.moveTo(q[0][0],q[0][1]);q.slice(1).forEach(p=>sh2.lineTo(p[0],p[1]));sh2.lineTo(32,-2);sh2.lineTo(-30,-2);
 const m2=new THREE.Mesh(new THREE.ExtrudeGeometry(sh2,{depth:6,bevelEnabled:false}),new THREE.MeshStandardMaterial({color:0x5d7a96,roughness:1}));
 m2.position.set(26,-.6,-100);scene.add(m2)})();

// Alexandroupolis lighthouse on a short breakwater, left
const LH=new THREE.Group();scene.add(LH);LH.position.set(-11,0,-9);
(function(){const stone=M(0xe9e2d3,.85,0),dark=M(0x2f3a44,.5,.4);
 const pier=box(5,1,5,M(0xb3b8bd,.95,0));pier.position.y=-.5;LH.add(pier);
 const plinth=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.7,1,16),stone);plinth.position.y=.5;LH.add(plinth);
 const tower=new THREE.Mesh(new THREE.CylinderGeometry(.75,1.15,9,20),stone);tower.position.y=5.5;LH.add(tower);
 for(const y of[3,6,8.5]){const w=box(.18,.5,.05,dark);w.position.set(0,y,1.02-(y-1)*.035);LH.add(w)}
 const gal=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.15,.25,20),dark);gal.position.y=10.1;LH.add(gal);
 const rail=new THREE.Mesh(new THREE.TorusGeometry(1.1,.03,6,24),dark);rail.rotation.x=Math.PI/2;rail.position.y=10.6;LH.add(rail);
 const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,1,12),new THREE.MeshStandardMaterial({color:0xfff2b0,emissive:0xffd75e,emissiveIntensity:.9,roughness:.2}));lamp.position.y=10.75;LH.add(lamp);
 const dome=new THREE.Mesh(new THREE.SphereGeometry(.68,14,8,0,Math.PI*2,0,Math.PI/2),M(0x3b5a3a,.5,.5));dome.position.y=11.25;LH.add(dome);
 const tip=new THREE.Mesh(new THREE.ConeGeometry(.08,.5,6),dark);tip.position.y=12.1;LH.add(tip)})();

// white container with logo
const CT=new THREE.Group();scene.add(CT);
function whiteRib(withLogo,img){const cv=document.createElement('canvas');cv.width=1024;cv.height=440;const x=cv.getContext('2d');
 x.fillStyle='#f4f6f8';x.fillRect(0,0,1024,440);
 for(let i=0;i<1024;i+=18){x.fillStyle=i%36?'rgba(255,255,255,.7)':'rgba(120,135,150,.22)';x.fillRect(i,0,9,440)}
 if(withLogo&&img){const h=380,w=h*4/3,cw=img.naturalWidth/3,ch=img.naturalHeight/3;x.globalCompositeOperation='multiply';x.drawImage(img,0,0,cw,ch,512-w/2,30,w,h);x.globalCompositeOperation='source-over'}
 const t=new THREE.CanvasTexture(cv);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
const L=6,H=2.6,W=2.4,th=.06;
const sideMat=new THREE.MeshStandardMaterial({map:whiteRib(false),roughness:.5,metalness:.2});
const plain=new THREE.MeshStandardMaterial({map:whiteRib(false),roughness:.5,metalness:.2}),frameMat=M(0xc9d0d8,.45,.5);
const s1=box(L,H,th,sideMat);s1.position.set(0,H/2,W/2);CT.add(s1);
const s2=box(L,H,th,sideMat);s2.position.set(0,H/2,-W/2);s2.rotation.y=Math.PI;CT.add(s2);
const top=box(L,th,W,plain);top.position.set(0,H,0);CT.add(top);
const fl=box(L,th,W,M(0x3b2b1d,.9,0));fl.position.set(0,.03,0);CT.add(fl);
const front=box(th,H,W,plain);front.position.set(-L/2,H/2,0);CT.add(front);
for(const z of[-W/2,W/2])for(const xx of[-L/2,L/2]){const p=box(.14,H+.08,.14,frameMat);p.position.set(xx,H/2,z);CT.add(p)}
const doors=[];for(const sg of[1,-1]){const hinge=new THREE.Group();hinge.position.set(L/2+.04,0,sg*W/2);
 const d=box(th,H-.1,W/2,plain);d.position.set(0,H/2,-sg*W/4);hinge.add(d);
 for(const k of[-.18,.18]){const bar=box(.05,H-.3,.05,M(0x8fa3bd,.3,.7));bar.position.set(.05,H/2,-sg*(W/4+k));hinge.add(bar)}
 CT.add(hinge);doors.push({hinge,sg})}
const img=new Image();img.onload=()=>{sideMat.map=whiteRib(true,img);sideMat.needsUpdate=true;dirty=true};img.src='foto.jpg';
const items=makers.map(mk=>{const o=mk();CT.add(o);return o});
const LINE_X=i=>4.6+i*2.1;

const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,lerp=(a,b,t)=>a+(b-a)*t;
let S=0,target=0,dirty=true,clock=0;
function progress(){const r=scrolly.getBoundingClientRect(),vh=innerHeight;return cl(-r.top/(r.height-vh))}
addEventListener('scroll',()=>{target=progress()*5;dirty=true},{passive:true});
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<720?50:38;cam.updateProjectionMatrix();dirty=true}
new ResizeObserver(resize).observe(stage);resize();target=progress()*5;
const look=new THREE.Vector3();
function update(s){
 const narrow=stage.clientWidth<720;
 hud.forEach((h,i)=>h.classList.toggle('on',Math.min(5,Math.floor(s+.5))===i));
 const open=ease(cl((s-.45)/.55));for(const d of doors)d.hinge.rotation.y=-d.sg*open*1.95;
 items.forEach((o,i)=>{const t=ease(cl((s-(.45+i))/.6));
  o.position.set(lerp(1.6-i*.15,LINE_X(i),t),Math.sin(t*Math.PI)*.35,lerp(0,i%2?1.2:2.0,t));
  o.rotation.y=lerp(0,i%2?.35:-.35,t);o.visible=t>0.001});
 look.set(s<1?lerp(-1,LINE_X(0)-.6,ease(cl(s))):LINE_X(0)-.6+(Math.min(s,5)-1)*2.1,1.4,.6);
 const a=lerp(-.32,.55,cl(s/1.3)),dist=narrow?15:12.5;
 cam.position.set(look.x+Math.sin(a)*dist*.6,lerp(3.0,3.6,cl(s/2)),look.z+Math.cos(a)*dist);
 cam.lookAt(look);
}
function waves(t){const p=seaGeo.attributes.position.array;for(let i=0;i<p.length;i+=3){const x=base[i],z=base[i+2];p[i+1]=Math.sin(x*.18+t*.9)*.18+Math.cos(z*.23+t*.7)*.14}seaGeo.attributes.position.needsUpdate=true;seaGeo.computeVertexNormals()}
waves(0);
let visible=false;new IntersectionObserver(e=>{visible=e[0].isIntersecting},{rootMargin:'100px'}).observe(stage);
let last=performance.now(),acc=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;if(!visible)return;
 const k=reduce?1:1-Math.pow(.0009,dt);const moving=Math.abs(target-S)>1e-4;S+=(target-S)*k;
 if(!reduce){clock+=dt;acc+=dt;if(acc>(LOW?1/15:1/30)){acc=0;waves(clock);dirty=true}}
 if(!(moving||dirty))return;dirty=false;update(S);renderer.render(scene,cam)}
requestAnimationFrame(frame);

}
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();start()}},{rootMargin:'600px 0px'});io.observe(host)}else start();
})();
