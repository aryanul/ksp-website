const hd = document.querySelector('.hd');
const onScroll = () => hd.classList.toggle('solid', scrollY > 10);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

const burger = document.querySelector('.burger');
burger.onclick = () => burger.setAttribute('aria-expanded', hd.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => hd.classList.remove('open')));

// project filter tabs
document.querySelectorAll('.tabs').forEach(tabs => tabs.querySelectorAll('button').forEach(b => b.onclick = () => {
  tabs.querySelector('.on').classList.remove('on'); b.classList.add('on');
  document.querySelectorAll('.cards .card').forEach(c => c.hidden = b.dataset.f !== 'all' && c.dataset.status !== b.dataset.f);
}));

// count-up
const count = el => {
  const end = +el.dataset.count, t0 = performance.now();
  const tick = t => {
    const k = Math.min((t - t0) / 1600, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + (el.dataset.suffix || '');
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  e.target.querySelectorAll('[data-count]').forEach(count);
  io.unobserve(e.target);
}), { threshold: .15 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// lightbox
const lb = document.createElement('div');
lb.className = 'lb'; lb.innerHTML = '<img alt="">';
document.body.append(lb);
document.querySelectorAll('.plate, .gallery figure').forEach(f => f.onclick = () => {
  const img = f.querySelector('img');
  lb.firstChild.src = img.src; lb.firstChild.alt = img.alt; lb.classList.add('open');
});
lb.onclick = () => lb.classList.remove('open');
addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('open'));

// enquiry modal
const dlg = document.querySelector('dialog.enq');
document.querySelectorAll('[data-enquire]').forEach(b => b.onclick = e => {
  e.preventDefault();
  if (b.dataset.enquire) dlg.querySelector('[name=project]').value = b.dataset.enquire;
  dlg.showModal();
});
dlg.querySelector('.x').onclick = () => dlg.close();
dlg.onclick = e => e.target === dlg && dlg.close();

// ponytail: mailto instead of a backend; swap for a form service (Formspree / Web3Forms) so enquiries land in the inbox automatically
document.querySelectorAll('form.enquiry').forEach(form => form.onsubmit = e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(form));
  location.href = 'mailto:kspromoters11@gmail.com?subject=' + encodeURIComponent(`Website enquiry — ${f.project}`) +
    '&body=' + encodeURIComponent(`Name: ${f.name}\nPhone: ${f.phone}\nInterested in: ${f.project}\n\n${f.msg || ''}`);
});

document.querySelectorAll('.yr-now').forEach(el => el.textContent = new Date().getFullYear());

// hero video: keep the poster only when the visitor saves data or prefers less motion
const hv = document.querySelector('.hero-video');
if (hv && (matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData)) {
  hv.removeAttribute('autoplay'); hv.querySelectorAll('source').forEach(s => s.remove()); hv.load();
}

// film modal (full version with sound)
const film = document.querySelector('dialog.film'), fv = film?.querySelector('video');
document.querySelectorAll('[data-film]').forEach(b => b.onclick = () => { film.showModal(); fv.currentTime = 0; fv.play(); });
if (film) {
  film.querySelector('.x').onclick = () => film.close();
  film.onclick = e => e.target === film && film.close();
  film.addEventListener('close', () => fv.pause());
}
