// Tia: đi qua 2 điểm và kéo dài sang phải
registerTool({
  id:'ray', label:'Tia', points:2,
  draw({P, W, line}){
    const [a,b] = P, k = (b.y-a.y) / ((b.x-a.x) || 1e-9);
    line(a.x, a.y, W, a.y + k*(W-a.x));
  }
});
