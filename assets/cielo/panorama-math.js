/* AD ASTRA: geometria della vista, separata dalla resa artistica. Angoli in gradi. */
(()=>{'use strict';const rad=Math.PI/180,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function vector(az,alt){const a=az*rad,h=alt*rad;return [Math.cos(h)*Math.sin(a),Math.cos(h)*Math.cos(a),Math.sin(h)];}
function angles(v){return {azimuth:(Math.atan2(v[0],v[1])/rad+360)%360,altitude:Math.asin(clamp(v[2],-1,1))/rad};}
function camera(az,alt,fov,w,h){const a=az*rad,p=alt*rad;return {f:vector(az,alt),r:[Math.cos(a),-Math.sin(a),0],u:[-Math.sin(p)*Math.sin(a),-Math.sin(p)*Math.cos(a),Math.cos(p)],s:w/(2*Math.tan(fov*rad/4)),w,h};}
function project(v,c){const den=1+dot(v,c.f);if(den<.005)return null;return {x:c.w/2+c.s*dot(v,c.r)/den,y:c.h/2-c.s*dot(v,c.u)/den};}
function unproject(x,y,c){const u=(x-c.w/2)/c.s,v=-(y-c.h/2)/c.s,t=u*u+v*v,den=1+t;return c.f.map((a,i)=>(a*(1-t)+2*u*c.r[i]+2*v*c.u[i])/den);}
function twilight(alt){return alt>=0?'Sole sopra l’orizzonte':alt>=-6?'Crepuscolo civile':alt>=-12?'Crepuscolo nautico':alt>=-18?'Crepuscolo astronomico':'Notte astronomica';}
function limit(sun,moon){const points=[[-18,6],[-12,4.5],[-6,1.2],[0,-2.5],[8,-4.5]];let m=6;if(sun<=-18)m=6;else if(sun>=8)m=-4.5;else for(let i=1;i<points.length;i++)if(sun<=points[i][0]){const a=points[i-1],b=points[i];m=a[1]+(b[1]-a[1])*(sun-a[0])/(b[0]-a[0]);break;}return m-(moon?.altitude>0?moon.fraction*.9*Math.sin(moon.altitude*rad):0);}
function extinction(alt){if(alt<=0)return 99;const x=1/(Math.sin(alt*rad)+.50572*Math.pow(alt+6.07995,-1.6364));return .22*(x-1);}
window.AdAstraSkyMath={rad,clamp,dot,vector,angles,camera,project,unproject,twilight,limit,extinction};})();
