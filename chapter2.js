const audio=document.querySelector('#audio');
const start=document.querySelector('#start');
const mute=document.querySelector('#mute');
const volume=document.querySelector('#volume');
const pairs=[...document.querySelectorAll('.pair')];
const cues=[3,9,15,21,28,35,42,50];
let revealed=false,shownCount=0;
audio.loop=true;
audio.volume=Number(volume.value);
function revealPoem(){if(revealed)return;revealed=true;document.body.dataset.revealed='true'}
function setPlayState(playing){document.body.dataset.playing=String(playing);start.setAttribute('aria-pressed',String(playing));start.innerHTML=playing?'음악 멈추기 <span aria-hidden="true">Ⅱ</span>':'음악 재생 <span aria-hidden="true">▷</span>'}
function revealPairs(){while(shownCount<pairs.length&&audio.currentTime>=cues[shownCount]){pairs[shownCount].classList.add('shown');shownCount+=1}}
start.addEventListener('click',async()=>{if(!audio.paused){audio.pause();return}try{await audio.play()}catch{start.textContent='다시 재생'}});
audio.addEventListener('play',()=>{revealPoem();setPlayState(true);revealPairs()});
audio.addEventListener('timeupdate',revealPairs);
audio.addEventListener('pause',()=>{if(!audio.ended)setPlayState(false)});
audio.addEventListener('ended',async()=>{try{audio.currentTime=0;await audio.play()}catch{setPlayState(false)}});
mute.addEventListener('click',()=>{audio.muted=!audio.muted;mute.textContent=audio.muted?'소리 꺼짐':'소리 켜짐';mute.setAttribute('aria-label',audio.muted?'음소거 해제':'음소거');mute.setAttribute('aria-pressed',String(audio.muted))});
volume.addEventListener('input',event=>{audio.volume=Number(event.target.value);if(audio.muted&&audio.volume>0)audio.muted=false});
audio.addEventListener('error',()=>{start.textContent='다시 재생'});