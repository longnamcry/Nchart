// Thước đo: chênh lệch giá, %, số nến giữa 2 điểm
registerTool({
  id:'measure', label:'Đo', points:2,
  draw({ctx, P, pts, candles, hr, vr, text}){
    const [a,b] = P;
    const up = pts[1].price >= pts[0].price;
    const col = up ? '38,166,154' : '239,83,80';
    ctx.fillStyle = `rgba(${col},.18)`; ctx.strokeStyle = `rgb(${col})`;
    ctx.fillRect(a.x, a.y, b.x-a.x, b.y-a.y);
    ctx.strokeRect(a.x, a.y, b.x-a.x, b.y-a.y);

    const i0 = candles.findIndex(k => k.time >= pts[0].time);
    const i1 = candles.findIndex(k => k.time >= pts[1].time);
    const d = pts[1].price - pts[0].price;
    ctx.fillStyle = `rgb(${col})`;
    text(`${d.toFixed(2)} (${(d/pts[0].price*100).toFixed(2)}%) · ${Math.abs(i1-i0)} nến`,
         Math.min(a.x,b.x) + 4*hr, Math.min(a.y,b.y) - 6*vr);
  }
});
