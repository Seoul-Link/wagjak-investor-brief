(()=>{
  const videos=[...document.querySelectorAll('.meeting-partnership .media-window video')];
  function release(video){
    video.pause();
    video.removeAttribute('src');
    video.querySelectorAll('source').forEach(source=>source.removeAttribute('src'));
    video.load();
  }
  for(const video of videos){
    const window=video.closest('.media-window');
    const source=video.querySelector('source');
    const mediaSrc=video.getAttribute('src')||source?.getAttribute('src');
    if(!window||!mediaSrc)continue;
    if(source)source.dataset.mediaSrc=mediaSrc;
    else video.dataset.mediaSrc=mediaSrc;
    release(video);
    const button=document.createElement('button');
    button.type='button';button.className='inline-play';button.textContent='▶';
    button.setAttribute('aria-label',`${video.getAttribute('aria-label')||'영상'} 재생`);
    window.append(button);
    const feedback=document.createElement('div');feedback.className='media-feedback';feedback.hidden=true;window.append(feedback);
    const fail=()=>{
      feedback.replaceChildren(document.createTextNode('재생이 지연되고 있어요. '));
      const link=document.createElement('a');link.textContent='영상 직접 열기 ↗';link.href=mediaSrc;
      link.target='_blank';link.rel='noopener';feedback.append(link);feedback.hidden=false;
      button.hidden=false;
    };
    button.addEventListener('click',()=>{
      videos.forEach(other=>{if(other!==video)release(other)});
      feedback.hidden=true;
      if(source&&!source.getAttribute('src')){source.src=source.dataset.mediaSrc;video.load()}
      else if(!source&&!video.getAttribute('src'))video.src=video.dataset.mediaSrc;
      video.play().then(()=>{button.hidden=true}).catch(fail);
    });
    video.addEventListener('playing',()=>{button.hidden=true;feedback.hidden=true;videos.forEach(other=>{if(other!==video)release(other)})});
    video.addEventListener('pause',()=>{button.hidden=false});
    video.addEventListener('ended',()=>{button.hidden=false});
    video.addEventListener('error',fail);
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(({target,intersectionRatio})=>{
      if(intersectionRatio<.03&&!target.paused)release(target);
    });
  },{threshold:[0,.03,.25]});
  videos.forEach(video=>observer.observe(video));
})();
