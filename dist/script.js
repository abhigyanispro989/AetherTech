const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','false');nav.classList.remove('open')}));

const searchPanel=document.querySelector('.search-panel');
const searchInput=searchPanel.querySelector('input');
const searchOpen=()=>{searchPanel.classList.add('open');searchPanel.setAttribute('aria-hidden','false');searchInput.focus()};
const searchClose=()=>{searchPanel.classList.remove('open');searchPanel.setAttribute('aria-hidden','true');document.querySelector('.search-open').focus()};
document.querySelector('.search-open').addEventListener('click',searchOpen);
searchPanel.querySelector('.search-close').addEventListener('click',searchClose);
searchPanel.addEventListener('click',e=>{if(e.target===searchPanel)searchClose()});
searchInput.addEventListener('input',()=>{const q=searchInput.value.trim().toLowerCase();searchPanel.querySelectorAll('.search-results a').forEach(a=>a.hidden=q&&!a.textContent.toLowerCase().includes(q))});
searchPanel.querySelectorAll('.search-results a').forEach(a=>a.addEventListener('click',searchClose));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&searchPanel.classList.contains('open'))searchClose()});
document.querySelector('#year').textContent=new Date().getFullYear();
