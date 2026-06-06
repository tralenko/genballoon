
const logo = document.getElementById('logo');

logo.addEventListener('click', () => {

  const rect = logo.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const colors = [
    '#FFD700',
    '#FF4D6D',
    '#00D4FF',
    '#7CFF6B',
    '#FFFFFF',
    '#FF9F1C'
  ];

  for(let i = 0; i < 40; i++) {

    const confetti = document.createElement('div');
    confetti.classList.add('confetti');

    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    confetti.style.left = centerX + 'px';
    confetti.style.top = centerY + 'px';

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;

    confetti.style.setProperty(
      '--x',
      `${Math.cos(angle) * distance}px`
    );

    confetti.style.setProperty(
      '--y',
      `${Math.sin(angle) * distance}px`
    );

    confetti.style.borderRadius =
      Math.random() > 0.5 ? '50%' : '2px';

    document.body.appendChild(confetti);

    confetti.addEventListener('animationend', () => {
      confetti.remove();
    });
  }
});
