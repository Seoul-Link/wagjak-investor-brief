(() => {
  const shells = [...document.querySelectorAll('.video-shell')];
  function release(shell) {
    const video = shell.querySelector('video');
    const source = video.querySelector('source');
    video.pause();
    if (source.hasAttribute('src')) {
      source.removeAttribute('src');
      video.load();
    }
    shell.querySelector('.inline-play').hidden = false;
  }
  async function play(shell) {
    shells.filter(other => other !== shell).forEach(release);
    const video = shell.querySelector('video');
    const source = video.querySelector('source');
    if (!source.hasAttribute('src')) {
      source.setAttribute('src', source.dataset.src);
      video.load();
    }
    try {
      await video.play();
      shell.querySelector('.inline-play').hidden = true;
    } catch (error) {
      shell.querySelector('.inline-play').hidden = false;
    }
  }
  shells.forEach(shell => {
    const button = shell.querySelector('.inline-play');
    const video = shell.querySelector('video');
    button.addEventListener('click', () => play(shell));
    video.addEventListener('play', () => {
      shells.filter(other => other !== shell).forEach(release);
      button.hidden = true;
    });
    video.addEventListener('ended', () => release(shell));
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !entry.target.querySelector('video').paused) release(entry.target);
      });
    }, { rootMargin: '350px 0px 350px 0px' });
    shells.forEach(shell => observer.observe(shell));
  }
})();
