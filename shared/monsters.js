/* 怪物绘制库：15 种怪物的矢量造型，从塔防里抽出来给其他游戏共用（塔防自己仍用内嵌的那份）。
   用法：Monsters.sprite(id, color, frame, size) 返回一张画好的小画布（已缓存），drawImage 即可。
     id     见 Monsters.LIST；color 是 '#rrggbb'；frame 0~11 为走路动画帧；size 是怪物半径（像素）。
   画布边长 = canvas.R*2（逻辑像素），怪物中心在画布正中，朝右。 */
(function(){
const OL='#1b1622';
function mix(c,t,k){const n=parseInt(c.slice(1),16),f=v=>Math.round(v+(t-v)*k);return`rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`}
const lite=(c,k)=>mix(c,255,k),dark=(c,k)=>mix(c,0,k);
function shadow(g,x,y,rx,ry,a){g.fillStyle='rgba(0,0,0,'+(a||.3)+')';g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill()}
function union(g,shapes,lw){g.strokeStyle=OL;g.lineWidth=lw||5;g.lineJoin='round';for(const s of shapes){g.beginPath();s.p(g);g.stroke()}for(const s of shapes){g.fillStyle=s.c;g.beginPath();s.p(g);g.fill()}}
const circ=(x,y,r)=>g=>g.arc(x,y,r,0,7);
const rrect=(x,y,w,h,r)=>g=>g.roundRect(x,y,w,h,r);
const poly=(...p)=>g=>{g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);g.closePath()};
function rgba(c,a){const n=parseInt(c.slice(1),16);return`rgba(${n>>16},${n>>8&255},${n&255},${a})`}
function glow(g,x,y,r,c,a){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,rgba(c,a));gr.addColorStop(1,rgba(c,0));g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}
function E(g,x,y,rx,ry,fill,rot){g.fillStyle=fill;g.beginPath();g.ellipse(x,y,rx,ry,rot||0,0,7);g.fill();g.stroke()}
function PG(g,fill,p){g.fillStyle=fill;g.beginPath();g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);g.closePath();g.fill();g.stroke()}
function RR(g,x,y,w,h,r,fill){g.fillStyle=fill;g.beginPath();g.roundRect(x,y,w,h,r);g.fill();g.stroke()}
function dot(g,x,y,r,fill){g.fillStyle=fill;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
function ln(g,col,lw,p){g.save();g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)g.lineTo(p[i],p[i+1]);g.stroke();g.restore()}
function eyes(g,x,y,r,gap,pc){for(const ex of[x,x+gap]){g.fillStyle='#fff';g.beginPath();g.arc(ex,y,r,0,7);g.fill();g.stroke();dot(g,ex+r*.3,y,r*.52,pc||OL)}}
const FLY={bee:1,bat:1,pharaoh:1};
const SPR={
  slime(g,c,w,b){const sx=1+b*.07,sy=1-b*.08;
    g.fillStyle=c;g.beginPath();g.moveTo(-15*sx,7);g.bezierCurveTo(-15*sx,-18*sy,15*sx,-18*sy,15*sx,7);g.quadraticCurveTo(15*sx,13.5,0,13.5);g.quadraticCurveTo(-15*sx,13.5,-15*sx,7);g.fill();g.stroke();
    g.globalAlpha=.45;g.fillStyle=dark(c,.3);g.beginPath();g.ellipse(0,8.5,11,3.8,0,0,7);g.fill();g.globalAlpha=1;
    ln(g,OL,2.4,[0,-13*sy,1,-18*sy]);E(g,-3,-19*sy,4,2.2,'#4fae3c',-.5);E(g,5.5,-20*sy,4.5,2.4,'#6bcc52',.5);
    g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-7,-6,3.5,2.2,-.6,0,7);g.fill();
    eyes(g,1,-1+b,3.6,8);g.beginPath();g.arc(5,5+b,3,.2,2.94);g.stroke()},
  wolf(g,c,w,b){const lg=dark(c,.3);
    g.fillStyle=c;g.beginPath();g.moveTo(-11,0);g.quadraticCurveTo(-23,-4+w*2,-19,-13);g.quadraticCurveTo(-15,-5,-9,-4);g.closePath();g.fill();g.stroke();
    RR(g,-9+w*3,6,4,8,2,lg);RR(g,5-w*3,6,4,8,2,lg);
    E(g,-2,2+b*.5,12,7.5,c);
    RR(g,-6-w*3,7,4.5,8,2,c);RR(g,8+w*3,7,4.5,8,2,c);
    g.fillStyle=lite(c,.5);g.beginPath();g.ellipse(-1,6.5,8,2.2,0,0,7);g.fill();
    PG(g,lg,[4,-8+b,5,-17+b,10,-10+b]);PG(g,c,[8,-9+b,11,-18+b,15,-9+b]);
    E(g,11,-4+b,7,6.5,c);E(g,17,-2+b,4.8,3.3,lite(c,.5));dot(g,21,-3+b,1.7,OL);
    g.fillStyle='#ffe14a';g.beginPath();g.ellipse(12.5,-5+b,2.3,2,0,0,7);g.fill();g.stroke();dot(g,13.1,-5+b,1,OL);
    PG(g,'#fff',[15,0+b,16.5,2.8+b,18,0+b])},
  treant(g,c,w,b){const dk=dark(c,.25);
    RR(g,-10-w,9,9,6,3,dk);RR(g,2+w,9,9,6,3,dk);
    for(const[p,e]of[[[-9,-2,-16,-6+w*2,-19,-12+w*2],[-19,-14+w*2]],[[9,-2,17,-4-w*2,21,-10-w*2],[21,-12-w*2]]]){ln(g,OL,6.5,p);ln(g,c,3,p);E(g,e[0],e[1],4.2,3.2,'#4fae3c')}
    RR(g,-10,-10+b*.5,20,22,6,c);
    ln(g,'rgba(0,0,0,.3)',1.5,[-6,-3,-7,7]);ln(g,'rgba(0,0,0,.3)',1.5,[6,3,5,10]);ln(g,'rgba(255,255,255,.2)',1.5,[-7,-6,-7.5,0]);
    union(g,[{c:'#2f8a36',p:circ(-9,-13,8)},{c:'#2f8a36',p:circ(9,-13,8)},{c:'#3fa643',p:circ(0,-18,10)}],4.5);
    dot(g,-3,-21,3.5,'#74d466');dot(g,7,-15,2,'#ef5a4e');
    dot(g,-1,-2,2.8,'#ffe14a');dot(g,6,-2,2.8,'#ffe14a');dot(g,-.5,-2,1.1,OL);dot(g,6.5,-2,1.1,OL);
    ln(g,OL,2,[-4,-6,1,-4.5]);ln(g,OL,2,[9,-6,4,-4.5]);
    PG(g,'#24160e',[-2,4,1,2.5,3,4.5,5,2.5,8,4,6,8,0,8])},
  bee(g,c,w,b,tm){const fp=Math.sin(tm*45)*.35;
    g.save();g.lineWidth*=.7;E(g,-4,-9,5,9,'rgba(255,255,255,.8)',-.5+fp);E(g,4,-10,5,9,'rgba(255,255,255,.8)',.25+fp);g.restore();
    PG(g,'#3a2a20',[-11,-2,-18,0,-11,2]);
    E(g,0,0,12,9,c);g.save();g.beginPath();g.ellipse(0,0,12,9,0,0,7);g.clip();g.fillStyle='#2a2018';g.fillRect(-8,-10,4,20);g.fillRect(-1,-10,4,20);
    g.fillStyle='rgba(255,255,255,.3)';g.fillRect(-12,-8,24,3);g.restore();g.beginPath();g.ellipse(0,0,12,9,0,0,7);g.stroke();
    eyes(g,6,-2,2.8,4.5);ln(g,OL,1.5,[7,-8,9,-13]);ln(g,OL,1.5,[10,-7,13,-12])},
  troll(g,c,w,b){const dk=dark(c,.28);
    g.save();g.translate(-10,-1);g.rotate(-.5+w*.25);RR(g,-3.5,-24,8,20,3.5,'#8a5a30');dot(g,-3,-20,1.4,'#e8dcc0');dot(g,4,-15,1.4,'#e8dcc0');dot(g,-3,-10,1.4,'#e8dcc0');g.restore();
    RR(g,-9-w*1.5,9,8,6,3,dk);RR(g,2+w*1.5,9,8,6,3,dk);
    E(g,0,2+b*.5,13,11,c);g.fillStyle=lite(c,.3);g.beginPath();g.ellipse(2,5,8,6,0,0,7);g.fill();
    PG(g,'#8a5a30',[-10,6,11,6,9,13,4,9.5,-1,13,-7,9.5]);
    E(g,-11,1-w,4,4.5,c);
    PG(g,c,[-4,-11+b,-11,-17+b,-5,-6+b]);PG(g,c,[10,-11+b,17,-17+b,11,-6+b]);
    E(g,3,-9+b,8.5,7.5,c);g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.ellipse(-1,-13+b,3,1.6,-.4,0,7);g.fill();
    ln(g,OL,2.4,[-2,-13+b,3,-11+b]);ln(g,OL,2.4,[10,-13+b,5,-11+b]);
    dot(g,1.5,-9.5+b,1.9,'#ffe14a');dot(g,7.5,-9.5+b,1.9,'#ffe14a');
    ln(g,OL,1.6,[-1,-4+b,9,-4+b]);PG(g,'#fff',[-.5,-4+b,1,-8.5+b,2.5,-4+b]);PG(g,'#fff',[6,-4+b,7.5,-8.5+b,9,-4+b]);
    PG(g,'#ffd76a',[-2,-16+b,-3,-21+b,.5,-18.5+b,3,-22.5+b,5.5,-18.5+b,9,-21+b,8,-16+b])},
  worm(g,c,w,b,tm){
    [[-13,6,5],[-7,4,7],[1,1,9]].forEach(([x,y,r],i)=>{const yy=y+Math.sin(tm*8+i*1.2)*1.6;PG(g,dark(c,.3),[x-2,yy-r+1,x,yy-r-4,x+2.5,yy-r+1]);E(g,x,yy,r,r,c);
      g.save();g.strokeStyle=lite(c,.4);g.lineWidth=1.6;g.beginPath();g.arc(x,yy,r*.62,.6,2.5);g.stroke();g.restore()});
    E(g,9,-1+b,8.5,8.5,c);g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(5,-6+b,3,1.7,-.5,0,7);g.fill();
    E(g,13,0+b,4.6,5.2,'#4a1418');for(const[x,y]of[[10.5,-3.2],[15,-3.6],[10.5,3.2],[15,3.6],[17,0]])dot(g,x,y+b,1.2,'#fff');
    dot(g,6,-5+b,2.3,'#fff');dot(g,6.8,-5+b,1.1,OL)},
  scorpion(g,c,w,b){const dk=dark(c,.25);
    for(let i=0;i<3;i++){const x=-6+i*5,k=(i%2?1:-1)*w*2;ln(g,OL,2.4,[x,4,x-1+k,9,x-3+k,13]);ln(g,OL,2.4,[x,3,x+1-k,-2,x+3-k,-4])}
    [[-9,0,4.6],[-13.5,-6,4.1],[-12,-13,3.7],[-6,-17,3.3]].forEach(([x,y,r],i)=>E(g,x+w*i*.5,y,r,r,i%2?dk:c));
    PG(g,'#2e1812',[-4+w*1.5,-19.5,3+w*1.5,-15.5,-3+w*1.5,-14]);
    E(g,0,3,10,6.8,c);ln(g,'rgba(0,0,0,.3)',1.4,[-4,-2.5,-4,8.5]);ln(g,'rgba(0,0,0,.3)',1.4,[1,-3.5,1,9.5]);
    g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.ellipse(-2,-.5,5,1.6,0,0,7);g.fill();
    ln(g,OL,5,[8,1,14,-4]);ln(g,c,2.4,[8,1,14,-4]);ln(g,OL,5,[8,6,15,8]);ln(g,c,2.4,[8,6,15,8]);
    E(g,16.5,-6.5-w,4.8,3.6,c,-.5);ln(g,OL,1.5,[16,-6.5-w,21,-8-w]);E(g,18,9.5+w,4.8,3.6,c,.4);ln(g,OL,1.5,[17.5,9.5+w,22.5,11+w]);
    dot(g,6,1,1.8,'#fff');dot(g,6.5,1,.9,OL);dot(g,6,5,1.8,'#fff');dot(g,6.5,5,.9,OL)},
  mummy(g,c,w,b){const dk=dark(c,.14),bd='rgba(90,70,40,.45)';
    RR(g,-7-w,10,6.5,5,2,dk);RR(g,1+w,10,6.5,5,2,dk);
    ln(g,OL,5,[-8,3,-13,5+w,-18,3+w*2]);ln(g,c,2.6,[-8,3,-13,5+w,-18,3+w*2]);
    RR(g,-9,-15+b*.5,18,27,8,c);
    for(const p of[[-8,-12,8,-13.5],[-9,-3,9,-.5],[-9,3,9,6],[-8,9,8,10.5],[-9,-.5,0,3]])ln(g,bd,1.3,p);
    RR(g,-5,-11+b*.5,13.5,5.5,2.5,'#241a2c');dot(g,0,-8.2+b*.5,1.8,'#9cff5a');dot(g,5.5,-8.2+b*.5,1.8,'#9cff5a');
    RR(g,1,2-w*1.5,13,5,2.5,dk);RR(g,3,-3+w*1.5,14,5,2.5,c);ln(g,bd,1.2,[8,-3+w*1.5,7,2+w*1.5]);ln(g,bd,1.2,[12,-3+w*1.5,11,2+w*1.5])},
  scarab(g,c,w,b){
    for(let i=0;i<3;i++){const x=-6+i*5,k=(i%2?1:-1)*w*2;ln(g,OL,2.6,[x,6,x+k,12,x-2+k,14]);ln(g,OL,2.6,[x,-6,x-k,-12,x-2-k,-14])}
    E(g,10,0,5.2,5.6,'#23232f');ln(g,OL,2,[13,-3,17,-6]);ln(g,OL,2,[13,3,17,6]);
    E(g,-1,0,11,9,c);ln(g,'rgba(0,0,0,.4)',1.6,[-12,0,9,0]);
    g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.ellipse(-3,-4.5,6,2,-.1,0,7);g.fill();
    dot(g,5,0,2.4,'#ffd76a');g.beginPath();g.arc(5,0,2.4,0,7);g.stroke();dot(g,11,-2.2,1.2,'#fff');dot(g,11,2.2,1.2,'#fff')},
  pharaoh(g,c,w,b){const skin='#d9a066',blue='#2a5ad0';
    ln(g,OL,4.5,[14,-19,14,13]);ln(g,c,2.2,[14,-19,14,13]);g.save();g.lineWidth*=.9;g.fillStyle=c;g.beginPath();g.arc(14,-21,3.2,0,7);g.stroke();g.restore();dot(g,14,-21,1.3,'#ef5a4e');
    PG(g,'#f6eedc',[-8,-2,8,-2,11,13,6,11,0,13.5,-6,11,-11,13]);g.fillStyle=c;g.fillRect(-9.5,8.5,19,2);
    PG(g,blue,[-3,-2,3,-2,2,9,-2,9]);ln(g,c,1.4,[-2.5,2,2.5,2]);ln(g,c,1.4,[-2.2,5.5,2.2,5.5]);
    RR(g,6,-1,9,4.2,2,skin);
    PG(g,c,[-9,-17,9,-17,13,-1,7,2,-7,2,-13,-1]);
    for(const x of[-10,-6.5,6.5,10])ln(g,blue,2.2,[x*.85,-14,x,-.5]);
    E(g,0,-8,6.5,7,skin);RR(g,-7.5,-17.5,15,4.5,2,c);ln(g,blue,1.6,[-6,-15.2,6,-15.2]);dot(g,0,-18,2,'#ef5a4e');g.beginPath();g.arc(0,-18,2,0,7);g.stroke();
    dot(g,-2.6,-8,1.4,OL);dot(g,2.8,-8,1.4,OL);ln(g,OL,1.3,[-4.8,-8,-6.5,-8.8]);ln(g,OL,1.3,[5,-8,6.5,-8.8]);
    ln(g,OL,1.2,[-1.5,-4.2,2,-4.2]);RR(g,-1.6,-1.5,3.2,5.5,1.5,blue);
    g.save();g.strokeStyle=c;g.lineWidth=2.4;g.beginPath();g.arc(0,-3,8,.5,2.64);g.stroke();g.restore()},
  skel(g,c,w,b){
    for(const p of[[-3,8,-4-w*2.5,14.5],[3,8,4+w*2.5,14.5]]){ln(g,OL,5,p);ln(g,c,2.4,p)}
    ln(g,OL,4.5,[-6,2,-11,5+w]);ln(g,c,2.2,[-6,2,-11,5+w]);
    ln(g,OL,4.5,[6,2,12,1]);ln(g,c,2.2,[6,2,12,1]);
    PG(g,'#d5dae4',[11.5,1,13.5,-16,15.5,1]);ln(g,OL,3.4,[9.5,1.5,17.5,1.5]);ln(g,'#c9a04a',1.6,[9.5,1.5,17.5,1.5]);
    RR(g,-6,-1+b*.3,12,10,4,c);for(const y of[2,5])ln(g,'rgba(0,0,0,.45)',1.3,[-4.5,y+b*.3,4.5,y+b*.3]);ln(g,'rgba(0,0,0,.45)',1.3,[0,0,0,8]);
    RR(g,-3,-4+b,10,4.5,1.8,c);E(g,1,-9+b,8,7.5,c);
    g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.ellipse(-3,-13+b,2.6,1.4,-.5,0,7);g.fill();
    dot(g,-1,-9+b,2.4,OL);dot(g,5,-9+b,2.4,OL);dot(g,-.6,-9+b,.9,'#ff4a3a');dot(g,5.4,-9+b,.9,'#ff4a3a');
    PG(g,OL,[2,-6+b,3,-4.5+b,1.2,-4.5+b]);for(const x of[-.5,2,4.5])ln(g,OL,1,[x,-3.5+b,x,-.5+b])},
  bat(g,c,w,b){const dk=dark(c,.3);
    for(const s of[-1,1]){g.save();g.scale(s,1);PG(g,dk,[4,-3,13,-12-w*5,21,-8-w*7,19,-1-w*4,20,5-w*3,14,2-w,11,7,6,4]);ln(g,'rgba(0,0,0,.35)',1.2,[5,-2,19,-1-w*4]);ln(g,'rgba(0,0,0,.35)',1.2,[5,-2,14,2-w]);g.restore()}
    PG(g,c,[-5,-6,-7,-14,-1,-8]);PG(g,c,[5,-6,7,-14,1,-8]);
    E(g,0,0,7,8,c);g.fillStyle=lite(c,.35);g.beginPath();g.ellipse(0,3,3.8,3.5,0,0,7);g.fill();
    dot(g,-2.6,-2,2,'#ffe14a');dot(g,2.6,-2,2,'#ffe14a');dot(g,-2.3,-2,.9,OL);dot(g,2.9,-2,.9,OL);
    PG(g,'#fff',[-2.5,2,-1.5,5,-.5,2]);PG(g,'#fff',[.5,2,1.5,5,2.5,2])},
  garg(g,c,w,b){const dk=dark(c,.3);
    PG(g,dk,[-7,-6,-20,-17-w*2,-17,-6,-20,3,-9,3]);PG(g,dk,[6,-8,13,-18-w*2,12,-6]);
    RR(g,-9-w,10,8,5,2,dk);RR(g,2+w,10,8,5,2,dk);
    RR(g,-10,-6+b*.5,20,18,6,c);g.fillStyle=lite(c,.25);g.beginPath();g.ellipse(1,5,6,5,0,0,7);g.fill();
    ln(g,'rgba(0,0,0,.4)',1.3,[-7,0,-4,4,-6,8]);ln(g,'rgba(0,0,0,.4)',1.3,[7,2,5,6]);
    PG(g,'#322c3a',[-4,-13+b,-9,-22+b,-1,-15+b]);PG(g,'#322c3a',[6,-13+b,12,-22+b,9,-13+b]);
    RR(g,-6,-16+b,16,12,5,c);g.fillStyle='rgba(255,255,255,.22)';g.beginPath();g.ellipse(-1,-13+b,4,1.6,-.2,0,7);g.fill();
    RR(g,-3,-7+b,14,5,2,dk);PG(g,'#fff',[0,-7+b,1.5,-10.5+b,3,-7+b]);PG(g,'#fff',[6,-7+b,7.5,-10.5+b,9,-7+b]);
    g.fillStyle='#ffa02a';g.beginPath();g.ellipse(1,-11+b,2.3,1.5,.25,0,7);g.fill();g.stroke();g.beginPath();g.ellipse(7.5,-11+b,2.3,1.5,-.25,0,7);g.fill();g.stroke();
    ln(g,OL,2,[-2,-14+b,3,-12.5+b]);ln(g,OL,2,[11,-14+b,6,-12.5+b])},
  spider(g,c,w,b){
    for(const s of[-1,1])for(let i=0;i<4;i++){const k=(i%2?1:-1)*w*2.2;ln(g,OL,2.8,[3-i*2.5,s*2,7-i*5+k,s*10,9-i*6.5+k,s*15])}
    E(g,-6,0,8.5,8,c);PG(g,'#ffd76a',[-9,0,-6,-3.5,-3,0,-6,3.5]);
    g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.ellipse(-9,-4,3,1.6,-.5,0,7);g.fill();
    E(g,5,0,5.6,5.2,dark(c,.3));
    for(const[x,y]of[[7,-2.4],[7,2.4],[9.5,-1.2],[9.5,1.2]])dot(g,x,y,1.2,'#fff');
    ln(g,OL,2,[9.5,-2.5,13,-1.5]);ln(g,OL,2,[9.5,2.5,13,1.5])},
  lava(g,c,w,b,tm){const rock='#3d2e30';
    for(let i=0;i<5;i++){const x=-8+i*4,h=22+(i%2)*5+Math.sin(tm*11+i*2)*3;PG(g,i%2?'#ffc23a':c,[x-4,-8,x+Math.sin(tm*9+i)*2,-h,x+4,-8])}
    E(g,-13.5,6+w,5,5,rock);E(g,14,6-w,5,5,rock);
    PG(g,'#161014',[-9,-7,-16,-18,-4,-11]);PG(g,'#161014',[9,-7,16,-18,4,-11]);
    E(g,0,2+b*.5,13.5,12.5,rock);g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.ellipse(-5,-6,5,2.4,-.5,0,7);g.fill();
    g.save();g.shadowColor='#ff7a1a';g.shadowBlur=8;for(const p of[[-9,-1,-4,3,-7,9],[5,-3,8,2,4,7,8,11],[-1,7,1,12]])ln(g,'#ffa02a',2,p);
    g.fillStyle='#ffe14a';g.beginPath();poly(-7,-4,-1,-2,-6,.5)(g);g.fill();g.beginPath();poly(2,-2,8,-4,7,.5)(g);g.fill();
    g.fillStyle='#ffa02a';g.beginPath();poly(-4,5,-1,3.5,1,5.5,3,3.5,6,5,4.5,8.5,-2.5,8.5)(g);g.fill();g.restore()},
};

const LIST=[['slime','史莱姆','#7bd65a'],['wolf','野狼','#a9b1ba'],['treant','树精','#9a6c3c'],['bee','毒蜂','#f0c838'],['troll','森林巨魔','#4c9f78'],
  ['worm','沙虫','#d08f4c'],['scorpion','毒蝎','#c44e34'],['mummy','木乃伊','#ddd6ba'],['scarab','圣甲虫','#4a7fc8'],['pharaoh','沙漠法老','#e0a82e'],
  ['skel','骷髅兵','#e2dccb'],['bat','洞穴蝙蝠','#9468dc'],['garg','石像鬼','#8590a0'],['spider','洞蛛','#c04866'],['lava','熔岩魔王','#e8602e']];
const SS=2,FR=12,cache={};
function sprite(id,col,fi,r,flash){
  fi=((fi|0)%FR+FR)%FR;const key=id+col+fi+'_'+r+(flash?'f':'');let c=cache[key];if(c)return c;
  const s=r/15,R=Math.ceil(r*2.4+10);c=document.createElement('canvas');c.width=c.height=R*2*SS;c.R=R;
  const g=c.getContext('2d'),th=fi/FR*6.283;g.setTransform(SS*s,0,0,SS*s,R*SS,R*SS);g.lineJoin='round';g.lineCap='round';g.strokeStyle=OL;g.lineWidth=(s>1.5?3:2.3)/s;
  SPR[id](g,col,Math.sin(th),Math.sin(th),th);
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';
  const gr=g.createLinearGradient(c.width*.2,c.height*.1,c.width*.8,c.height*.9);gr.addColorStop(0,'rgba(255,255,235,.22)');gr.addColorStop(.5,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(20,0,50,.32)');
  g.fillStyle=gr;g.fillRect(0,0,c.width,c.height);if(flash){g.fillStyle='rgba(255,255,255,.78)';g.fillRect(0,0,c.width,c.height)}
  return cache[key]=c;
}
// 直接画到 g 上：中心 (x,y)，face=-1 朝左
function draw(g,id,col,fi,r,x,y,face,flash){const c=sprite(id,col,fi,r,flash),R=c.R;g.save();g.translate(x,y);if(face<0)g.scale(-1,1);g.drawImage(c,-R,-R,R*2,R*2);g.restore()}
window.Monsters={LIST,FLY,FR,sprite,draw,OL,mix,lite,dark,shadow,glow,rgba,poly};
})();
