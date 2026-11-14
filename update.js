/* 自动更新检查：三个页面共用。
   主屏幕书签（独立窗口）没有刷新按钮，还会一直用缓存的旧页面。这里在打开和切回页面时去服务器取一次最新页面，
   和正在运行的页面比对内嵌脚本/样式；不同就换成新版。存档在 localStorage 里，不受影响。
   用法：<script src="../update.js"></script> 放在 </body> 前。
   data-mode="ask" 或页面定义了 window.__busy() 且返回 true 时，只弹提示不自动刷新（避免打断正在玩的一局）。 */
(function(){
  if(!/^https?:$/.test(location.protocol))return;
  var me=document.currentScript,ask=me&&me.dataset.mode==='ask';
  function sig(doc){var h=5381,n=0;doc.querySelectorAll('script:not([src]),style').forEach(function(e){var t=e.textContent;n+=t.length;for(var i=0;i<t.length;i++)h=(h*33^t.charCodeAt(i))|0});return n+'.'+(h>>>0)}
  var mine=sig(document),last=0,bar=null;
  function show(go){
    if(bar)return;bar=document.createElement('div');
    bar.style.cssText='position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:99999;display:flex;gap:10px;align-items:center;white-space:nowrap;'+
      'background:#1d1a24;color:#efe6d0;border:1px solid #e3b558;border-radius:999px;padding:8px 10px 8px 16px;font:14px system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.7)';
    var t=document.createElement('span');t.textContent='有新版本';
    var b=document.createElement('button');b.textContent='立即更新';b.style.cssText='font:inherit;font-weight:700;color:#14110a;background:#e3b558;border:0;border-radius:999px;padding:6px 14px;cursor:pointer';b.onclick=go;
    var x=document.createElement('button');x.textContent='稍后';x.style.cssText='font:inherit;color:#a79db3;background:none;border:0;padding:6px 8px;cursor:pointer';x.onclick=function(){bar.remove();bar=null};
    bar.appendChild(t);bar.appendChild(b);bar.appendChild(x);document.body.appendChild(bar);
  }
  function check(){
    if(Date.now()-last<60000)return;last=Date.now();
    // cache:'reload' 既绕过缓存取最新，又顺手把浏览器缓存里的这份页面换成新的
    fetch(location.pathname,{cache:'reload'}).then(function(r){return r.ok?r.text():null}).then(function(html){
      if(!html)return;var theirs=sig(new DOMParser().parseFromString(html,'text/html'));
      if(theirs===mine)return;
      var tried='';try{tried=sessionStorage.getItem('upd-tried')}catch(e){}
      if(tried===theirs)return;   // 已经为这个版本刷新过一次还不一致，就不再折腾，避免循环刷新
      var go=function(){try{sessionStorage.setItem('upd-tried',theirs)}catch(e){}location.replace(location.pathname+'?v='+theirs.split('.')[1]+location.hash)};
      if(ask||(typeof window.__busy==='function'&&window.__busy()))show(go);else go();
    }).catch(function(){});
  }
  setTimeout(check,1200);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)check()});
  window.addEventListener('pageshow',function(e){if(e.persisted)check()});
})();
