(() => {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-carousel-track]');
  const slides = Array.from(track.children);
  const dotsWrap = carousel.querySelector('[data-carousel-dots]');
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  let index = 0;
  let autoTimer = null;

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function goTo(nextIndex) {
    const max = slides.length - 1;
    if (nextIndex < 0) index = max;
    else if (nextIndex > max) index = 0;
    else index = nextIndex;
    update();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(index + 1), 5000);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(index - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(index + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAuto();
    });
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  update();
  startAuto();
})();
