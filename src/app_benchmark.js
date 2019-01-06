import THREE from 'three'

import {genRandomArray} from './array_util.js'

import {BitonicSort} from './bitonic_sort_webgl.js'
import {bitonicSortPOT} from './bitonic_sort_pot.js'

let radix = 512;
let count = 10;

let dataLength = radix * radix;

let renderer = new THREE.WebGLRenderer();
let sort = new BitonicSort(renderer, radix);

let $start = document.getElementById('benchmark-start');
let $table = document.getElementById('benchmark-tbody');

document.getElementById('benchmark-data-length').textContent = `${dataLength.toString(10)}`;

function *generator() {
  $start.setAttribute('disabled', '');

  Array.prototype.forEach.call($table.querySelectorAll('.record'), function($el){
    $el.parentNode.removeChild($el);
  });

  yield ;

  for(let i = 0; i < count; i++) {
    let dataOrig = genRandomArray(dataLength);
    let data1 = new Float32Array(dataOrig);
    let data2 = new Float32Array(dataOrig);
    sort.writeDataTexture(data2);

    let t0;

    t0 = new Date();
    if('sort' in data1) {
      data1 = data1.sort();
    } else {
      data1 = Array.prototype.sort.call(data1);
    }
    let scoreJs = new Date() - t0;

    yield ;

    t0 = new Date();
    sort.exec();
    let scoreWebGL = new Date() - t0;

    yield ;

    let tr = document.createElement('tr');
    let tdJs = document.createElement('td');
    let tdWebGL = document.createElement('td');

    tdJs.textContent = `${scoreJs}ms`;
    tdWebGL.textContent = `${scoreWebGL}ms`;

    tr.classList.add('record');
    tr.appendChild(tdJs);
    tr.appendChild(tdWebGL);
    $table.appendChild(tr);

    yield ;
  }

  $start.removeAttribute('disabled');
}

$start.addEventListener('click', function(){
  let gen = generator();

  function next(){
    if(!gen.next().done) {
      requestAnimationFrame(next);
    }
  }

  requestAnimationFrame(next);
});

