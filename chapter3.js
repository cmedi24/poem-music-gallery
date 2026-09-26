const audio=document.querySelector('#audio');
const start=document.querySelector('#start');
const status=document.querySelector('#status');
const mute=document.querySelector('#mute');
const volume=document.querySelector('#volume');
const lines=[...document.querySelectorAll('.line')];
const cues=[3,7.5,11,15,20,25,30,35,40,45,50,56,63];
let revealed=false,shownCount=0;
audio.loop=true;
audio.volume=Number(volume.value);
function revealPoem(){if(revealed)return;revealed=true;document.body.dataset.revealed='true'}
function setPlayState(playing){document.body.dataset.playing=String(playing);start.setAttribute('aria-pressed',String(playing));start.innerHTML=playing?'음악 멈추기 <span aria-hidden="true">Ⅱ</span>':'음악 재생 <span aria-hidden="true">▷</span>';if(!playing)status.textContent=shownCount===lines.length?'담쟁이가 벽을 올랐습니다':shownCount?'담쟁이가 벽을 오르는 중입니다':'음악을 틀면 담쟁이가 벽을 올라갑니다'}
function revealLines(){while(shownCount<lines.length&&audio.currentTime>=cues[shownCount]){lines[shownCount].classList.add('shown');shownCount+=1}if(shownCount===lines.length)status.textContent='담쟁이가 벽을 올랐습니다';else if(shownCount)status.textContent='담쟁이가 벽을 올라갑니다';else status.textContent='음악을 틀면 담쟁이가 벽을 올라갑니다'}
start.addEventListener('click',async()=>{if(!audio.paused){audio.pause();return}try{await audio.play()}catch{start.textContent='다시 재생';status.textContent='음악을 다시 재생해 주세요'}});
audio.addEventListener('play',()=>{revealPoem();setPlayState(true);revealLines()});
audio.addEventListener('timeupdate',revealLines);
audio.addEventListener('pause',()=>{if(!audio.ended)setPlayState(false)});
audio.addEventListener('ended',async()=>{try{audio.currentTime=0;await audio.play()}catch{setPlayState(false)}});
mute.addEventListener('click',()=>{audio.muted=!audio.muted;mute.textContent=audio.muted?'소리 꺼짐':'소리 켜짐';mute.setAttribute('aria-label',audio.muted?'음소거 해제':'음소거');mute.setAttribute('aria-pressed',String(audio.muted))});
volume.addEventListener('input',event=>{audio.volume=Number(event.target.value);if(audio.muted&&audio.volume>0)audio.muted=false});
audio.addEventListener('error',()=>{start.textContent='다시 재생';status.textContent='음악을 다시 재생해 주세요'});
