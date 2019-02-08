const c = document.getElementById('canvas').getContext('2d');

window.addEventListener('resize', resize);

function resize() {
  canvas.width = 1080;
  canvas.height = 720;
}

function init() {

}

function loop() {
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  window.requestAnimationFrame(loop);
}

resize();
loop();