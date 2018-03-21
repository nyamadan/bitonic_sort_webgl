import {genRandomArray} from './array_util.js'

import {
  bitonicSortPOT,
  SORT_BEGIN,
  SORT_END,
  SORT_COMPARE,
  SORT_BEFORE,
  SORT_AFTER
} from './bitonic_sort_pot.js';

import d3 from 'd3'

const graphWidth = 640;
const graphHeight = 480;

const barPadding = 1;
const barColorDefault = '#000';
const barColorRed = '#f00';

let size = 128;
let data = new Float32Array(size);

let $start = document.getElementById('js-start');
let $interval = document.getElementById('js-interval');

let svg = d3.select('#js-container')
  .append('svg')
  .attr('width', graphWidth)
  .attr('height', graphHeight);

let scale = d3.scale.linear()
  .domain([0, 1])
  .range([0, graphHeight]);

svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('fill', barColorDefault)
  .attr('x', (d, i) => i * (graphWidth / data.length))
  .attr('y', (d, i) => graphHeight - scale(d))
  .attr('width', graphWidth / data.length - barPadding)
  .attr('height', (d, i) => scale(d));

let gen;
let last;

let running = false;

function reset() {
  data = genRandomArray(size);
  gen = bitonicSortPOT(data);
  last = Date.now();

  svg.selectAll('rect')
    .data(data)
    .attr('fill', barColorDefault)
    .attr('x', (d, i) => i * (graphWidth / data.length))
    .attr('y', (d, i) => graphHeight - scale(d))
    .attr('width', graphWidth / data.length - barPadding)
    .attr('height', (d, i) => scale(d));
}

function render() {
  for(let it = gen.next(); !it.done; it = gen.next()) {
    let [action] = it.value;

    switch(action) {
      case SORT_BEFORE:
        svg.selectAll('rect')
          .attr('fill', (d, i) => {
            let [, a, b] = it.value;
            if(i === a || i === b) {
              return barColorRed;
            }
            return barColorDefault;
          });
        return;
      case SORT_AFTER:
        svg.selectAll('rect')
          .data(data)
          .attr('fill', barColorDefault)
          .attr('x', (d, i) => i * (graphWidth / data.length))
          .attr('y', (d, i) => graphHeight - scale(d))
          .attr('width', graphWidth / data.length - barPadding)
          .attr('height', (d, i) => scale(d));
        return;
      default:
        break;
    }
  }
}

function loop() {
  requestAnimationFrame(loop);

  let timestamp = Date.now();
  let interval = parseInt($interval.value);

  if(running && timestamp > last + interval) {
    last = timestamp;
    render();
  }
}

$start.addEventListener('click', function(){
  if(running) {
    reset();
  }

  running = !running;
});

reset();
requestAnimationFrame(loop);
