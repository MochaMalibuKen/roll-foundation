(() => {
  const countdown = document.querySelector('[data-event-countdown]');
  if (!countdown) return;

  const eventTime = new Date(countdown.dataset.eventDate).getTime();
  const title = countdown.querySelector('[data-countdown-title]');
  const fields = {
    days: countdown.querySelector('[data-countdown-days]'),
    hours: countdown.querySelector('[data-countdown-hours]'),
    minutes: countdown.querySelector('[data-countdown-minutes]'),
    seconds: countdown.querySelector('[data-countdown-seconds]')
  };

  let timer;

  const updateCountdown = () => {
    const timeLeft = Math.max(0, eventTime - Date.now());
    const days = Math.floor(timeLeft / 86400000);
    const hours = Math.floor((timeLeft % 86400000) / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    fields.days.textContent = String(days).padStart(3, '0');
    fields.hours.textContent = String(hours).padStart(2, '0');
    fields.minutes.textContent = String(minutes).padStart(2, '0');
    fields.seconds.textContent = String(seconds).padStart(2, '0');

    if (timeLeft === 0) {
      title.textContent = 'The Event Has Begun';
      if (timer) window.clearInterval(timer);
    }
  };

  updateCountdown();
  timer = window.setInterval(updateCountdown, 1000);
})();
