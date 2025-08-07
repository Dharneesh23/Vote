// Sound effects for better user experience
export const playSound = (type) => {
  // Create audio context for better browser support
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const createBeep = (frequency, duration, volume = 0.1) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  switch (type) {
    case 'success':
      // Success sound - ascending notes
      createBeep(523.25, 0.2, 0.1); // C5
      setTimeout(() => createBeep(659.25, 0.2, 0.1), 100); // E5
      setTimeout(() => createBeep(783.99, 0.3, 0.1), 200); // G5
      break;
      
    case 'error':
      // Error sound - descending notes
      createBeep(440, 0.3, 0.1); // A4
      setTimeout(() => createBeep(349.23, 0.4, 0.1), 150); // F4
      break;
      
    case 'click':
      // Click sound
      createBeep(800, 0.1, 0.05);
      break;
      
    case 'vote':
      // Vote cast sound - celebratory
      createBeep(523.25, 0.15, 0.08); // C5
      setTimeout(() => createBeep(659.25, 0.15, 0.08), 75); // E5
      setTimeout(() => createBeep(783.99, 0.15, 0.08), 150); // G5
      setTimeout(() => createBeep(1046.5, 0.3, 0.08), 225); // C6
      break;
      
    default:
      createBeep(440, 0.1, 0.05);
  }
};

// Haptic feedback for mobile devices
export const triggerHaptic = (type = 'light') => {
  if ('vibrate' in navigator) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'heavy':
        navigator.vibrate([25, 10, 25]);
        break;
      case 'success':
        navigator.vibrate([10, 10, 10]);
        break;
      case 'error':
        navigator.vibrate([25, 10, 25, 10, 25]);
        break;
      default:
        navigator.vibrate(10);
    }
  }
};

// Confetti animation for celebrations
export const createConfetti = () => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);
    
    const animationDuration = Math.random() * 2000 + 1000;
    const rotation = Math.random() * 360;
    const drift = (Math.random() - 0.5) * 200;
    
    confetti.animate([
      {
        transform: `translateY(-10px) rotate(0deg)`,
        opacity: 1
      },
      {
        transform: `translateY(${window.innerHeight + 10}px) translateX(${drift}px) rotate(${rotation}deg)`,
        opacity: 0
      }
    ], {
      duration: animationDuration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
      document.body.removeChild(confetti);
    };
  }
};
