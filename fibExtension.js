// Fibonacci mở rộng: 3 điểm A-B-C. Đo A→B rồi đặt từ C.
(function(){
  const LV  = [0,0.618,1,1.272,1.618,2,2.618];
  const COL = ['#9e9e9e','#f44336','#ff9800','#4caf50','#26a69a','#2196f3','#9e9e9e'];
  registerTool({
    id:'ext', label:'Fib mở rộng', points:3, anyX:true,
    draw({ctx, P, pts, W, hr, toY, line, text}){
      const [A,B,C] = pts, x0 = Math.max(0, P[0].x ?? 0);
      LV.forEach((r,i) => {
        const price = C.price + (B.price - A.price) * r;
        const y = toY(price); if (y == null) return;
        ctx.strokeStyle = ctx.fillStyle = COL[i];
        line(x0, y, W, y);
        text(`${r}  (${price.toFixed(2)})`, x0 + 4*hr, y - 4*hr);
      });
    }
  });
})();
