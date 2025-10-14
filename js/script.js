// ===== Roll Foundation — script.js =====

// Prove JS is loading:
console.log('script.js loaded');

// Current year
const YEAR = new Date().getFullYear();
const $year = document.getElementById('year');
if ($year) $year.textContent = YEAR;

// Mobile nav toggle + desktop reset
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav){
  const setOpen = (open) => {
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    nav.style.display = (isMobile && !open) ? 'none' : 'flex';
    toggle.setAttribute('aria-expanded', String(open));
  };
  setOpen(false);
  toggle.addEventListener('click', () => {
    const open = nav.style.display !== 'flex';
    setOpen(open);
  });
  window.addEventListener('resize', () => {
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    if (!isMobile){ nav.style.display = 'flex'; toggle.setAttribute('aria-expanded','false'); }
    else { nav.style.display = 'none'; }
  });
}

// ---------- i18n (EN/ES) ----------
const LS_KEY = 'roll.lang';
const SUPPORTED = ['en','es'];

function getInitialLang(){
  try{
    const saved = localStorage.getItem(LS_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const pref = (navigator.language||'en').slice(0,2).toLowerCase();
    return SUPPORTED.includes(pref) ? pref : 'en';
  }catch{ return 'en'; }
}
let lang = getInitialLang();

async function loadDict(l){
  try{
    const res = await fetch(`i18n/${l}.json`, {cache:'no-store'});
    if (!res.ok) throw 0;
    return await res.json();
  }catch{
    if (l !== 'en'){
      try{
        const res = await fetch(`i18n/en.json`, {cache:'no-store'});
        if (res.ok) return await res.json();
      }catch{}
    }
    return null;
  }
}
function t(obj, path){ return path.split('.').reduce((a,k)=> (a && a[k]!=null ? a[k] : null), obj); }
function interp(str){ return String(str).replace('{{year}}', YEAR); }

async function applyLang(l){
  const dict = await loadDict(l) || await loadDict('en');
  if (!dict) return; // no i18n files present? silent no-op
  document.documentElement.lang = SUPPORTED.includes(l) ? l : 'en';

  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.getAttribute('data-i18n');
    const val = t(dict, key);
    if (val != null) node.textContent = interp(val);
  });

  // sync alt text for images with data-i18n
  document.querySelectorAll('img[data-i18n]').forEach(img => {
    const key = img.getAttribute('data-i18n');
    const val = t(dict, key);
    if (val) img.alt = interp(val);
  });

  try{ localStorage.setItem(LS_KEY, l); }catch{}
  lang = l;
}
const langBtn = document.getElementById('langToggle');
if (langBtn){ langBtn.addEventListener('click', ()=> applyLang(lang === 'en' ? 'es' : 'en')); }
applyLang(lang);

// ----- Simple Lightbox for gallery -----
document.addEventListener('click', (e) => {
  const link = e.target.closest('.gallery-item a, a.gallery-item');
  if (!link) return;
  e.preventDefault();

  const tile = link.closest('.gallery-item') || link;
  const imgEl = tile.querySelector('img');
  const src = link.getAttribute('href');

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,.92)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.padding = '1rem';
  overlay.style.zIndex = '9999';

  const img = document.createElement('img');
  img.src = src;
  img.alt = imgEl?.alt || 'Event photo';
  img.style.maxWidth = '95vw';
  img.style.maxHeight = '90vh';
  img.style.borderRadius = '12px';
  img.loading = 'eager';

  overlay.appendChild(img);
  document.body.appendChild(overlay);

  const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (ev) => { if (ev.key === 'Escape') close(); };
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
});