import THREE from 'three'
import {BitonicSort} from './bitonic_sort_webgl.js'
import {PassThru} from './pass_thru.js'
import {genRandomArray} from './array_util.js'

let radix = 512;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(radix, radix);

let container = document.getElementById('webgl-container');
container.appendChild(renderer.domElement);

let passThru = new PassThru(renderer);
let sort = new BitonicSort(renderer, radix);

let gen;
let last;

let running = false;

let $start = document.getElementById('webgl-start');
let $interval = document.getElementById('webgl-interval');

function reset() {
  sort.writeDataTexture(genRandomArray(radix * radix));
  gen = sort.generator();
  last = Date.now();
}

function loop() {
  requestAnimationFrame(loop);

  let timestamp = Date.now();
  let interval = parseInt($interval.value);

  if(running && timestamp > last + interval) {
    last = timestamp;
    gen.next();
  }

  passThru.render(sort.rtDataRef);
}

$start.addEventListener('click', function(){
  if(running) {
    reset();
  }

  running = !running;
});

reset();

requestAnimationFrame(loop);

