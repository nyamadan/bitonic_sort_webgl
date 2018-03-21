export function swap(ary, a, b) {
  var t = ary[a];
  ary[a] = ary[b];
  ary[b] = t;
}

export function genRandomArray(length) {
  let dist = new Array(length);
  for(let i = 0; i < length; i++) {
    dist[i] = i / length;
  }
  
  for(let i = 0; i < length; i++) {
    swap(dist, i, Math.floor(Math.random() * length));
  }
  
  return dist;
}
