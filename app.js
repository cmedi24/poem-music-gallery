const audio=document.querySelector('#audio');
const start=document.querySelector('#start');
const alternate=document.querySelector('#alternate');
const status=document.querySelector('#status');
const mute=document.querySelector('#mute');
const volume=document.querySelector('#volume');
const lines=[...document.querySelectorAll('.verse p')];
const tracks={
  original:{src:'assets/bgm.mp4',cues:[2.5,7.8,13.1,18.4,24.2,30,35.8,41.6,47.4],idle:'음악을 틀면, 오늘의 이야기가 시작됩니다',moving:'울어도, 웃는 날은 이어집니다',complete:'오늘도, 웃으며 살아갑니다'},
  alternate:{src:'assets/best-friend.m4a',cues:[5,12,20,29,39,50,62,75,90],idle:'같은 글을, 다른 리듬으로 들어보세요',moving:'같은 글이 다른 리듬으로 이어집니다',complete:'같은 글이 다른 빛으로 남습니다'}
};
let mode='original',revealed=false,shownCount=0;
audio.loop=true;
audio.volume=Number(volume.value);
function track(){return tracks[mode]}
function revealPoem(){if(revealed)return;revealed=true;document.body.dataset.revealed='true'}
function setStatus(message){if(status)status.textContent=message}
function renderControls(playing){start.setAttribute('aria-pressed',String(playing&&mode==='original'));alternate.setAttribute('aria-pressed',String(playing&&mode==='alternate'));start.innerHTML=playing&&mode==='original'?'음악 멈추기 <span aria-hidden="true">Ⅱ</span>':'음악 재생 <span aria-hidden="true">▷</span>';alternate.innerHTML=playing&&mode==='alternate'?'다른 느낌 멈추기 <span aria-hidden="true">Ⅱ</span>':'같은 글, 다른 느낌 <span aria-hidden="true">↗</span>'}
function setPlayState(playing){document.body.dataset.playing=String(playing);renderControls(playing);if(!playing)setStatus(shownCount===lines.length?track().complete:shownCount?track().moving:track().idle)}
function resetPoem(){revealed=false;shownCount=0;document.body.dataset.revealed='false';lines.forEach(line=>line.classList.remove('shown'));setStatus(track().idle)}
function revealLines(){const cues=track().cues;while(shownCount<lines.length&&audio.currentTime>=cues[shownCount]){lines[shownCount].classList.add('shown');shownCount+=1}setStatus(shownCount===lines.length?track().complete:shownCount?track().moving:track().idle)}
async function playMode(next){if(mode===next&&!audio.paused){audio.pause();return}if(mode!==next){audio.pause();mode=next;document.body.dataset.mode=mode;audio.src=track().src;audio.load();resetPoem()}try{await audio.play()}catch{renderControls(false);setStatus('음악을 다시 재생해 주세요')}}
start.addEventListener('click',()=>playMode('original'));
alternate.addEventListener('click',()=>playMode('alternate'));
audio.addEventListener('play',()=>{revealPoem();setPlayState(true);revealLines()});
audio.addEventListener('timeupdate',revealLines);
audio.addEventListener('pause',()=>{if(!audio.ended)setPlayState(false)});
audio.addEventListener('ended',async()=>{try{audio.currentTime=0;await audio.play()}catch{setPlayState(false)}});
mute.addEventListener('click',()=>{audio.muted=!audio.muted;mute.textContent=audio.muted?'소리 꺼짐':'소리 켜짐';mute.setAttribute('aria-label',audio.muted?'음소거 해제':'음소거');mute.setAttribute('aria-pressed',String(audio.muted))});
volume.addEventListener('input',event=>{audio.volume=Number(event.target.value);if(audio.muted&&audio.volume>0)audio.muted=false});
audio.addEventListener('error',()=>{renderControls(false);setStatus('음악을 다시 재생해 주세요')});