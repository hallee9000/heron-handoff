var node;
var rotation = 0;
var gestureStartRotation = 0;
var gestureStartScale = 0;
var scale = 1;
var posX = 0;
var posY = 0;
var startX;
var startY;

var node = document.querySelector('.frame')

var render = () => {

  window.requestAnimationFrame(() => {
    var val = `translate3D(${posX}px, ${posY}px, 0px) rotate(${rotation}deg) scale(${scale})`
    node.style.transform = val
  })
  
}

window.addEventListener('wheel', (e) => {
  e.preventDefault();

  if (e.ctrlKey) {
    scale -= e.deltaY * 0.01;
  } else {
    posX -= e.deltaX * 2;
    posY -= e.deltaY * 2;
  }

  render();
});


window.addEventListener("gesturestart", function (e) {
  e.preventDefault();
  startX = e.pageX - posX;
  startY = e.pageY - posY;
  gestureStartRotation = rotation;
  gestureStartScale = scale;
});

window.addEventListener("gesturechange", function (e) {
  e.preventDefault();
  
  rotation = gestureStartRotation + e.rotation;
  scale = gestureStartScale * e.scale;

  posX = e.pageX - startX;
  posY = e.pageY - startY;

  render();

})

window.addEventListener("gestureend", function (e) {
  e.preventDefault();
});
