document.addEventListener('DOMContentLoaded', () => {
  const step = 260;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const slider = document.getElementById(btn.dataset.target);
      if (!slider) return;
      slider.scrollBy({ left: step * parseInt(btn.dataset.dir, 10), behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.slider').forEach(slider => {
    let isDown = false, startX = 0, startScroll = 0;
    slider.addEventListener('pointerdown', e => {
      isDown = true; startX = e.clientX; startScroll = slider.scrollLeft;
      slider.setPointerCapture(e.pointerId);
    });
    slider.addEventListener('pointermove', e => {
      if (!isDown) return;
      slider.scrollLeft = startScroll - (e.clientX - startX);
    });
    const end = () => { isDown = false; };
    slider.addEventListener('pointerup', end);
    slider.addEventListener('pointercancel', end);
    slider.addEventListener('pointerleave', end);
  });
});
