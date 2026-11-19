// Fibonacci retracement: 2 điểm. Mức 0 tại điểm 2, mức 1 tại điểm 1.
(function(){
  const LV  = [0,0.236,0.382,0.5,0.618,0.786,1];
  const COL = ['#9e9e9e','#f44336','#ff9800','#4caf50','#26a69a','#2196f3','#9e9e9e'];
  registerTool({
    id:'retr', label:'Fib', points:2, anyX:true,
    draw({ctx, P, pts, W, hr, toY, line, text}){
      const [A,B] = pts, x0 = Math.max(0, P[0].x ?? 0);
      LV.forEach((r,i) => {
        const price = B.price - (B.price - A.price) * r;
        const y = toY(price); if (y == null) return;
        ctx.strokeStyle = ctx.fillStyle = COL[i];
        line(x0, y, W, y);
        text(`${r}  (${price.toFixed(2)})`, x0 + 4*hr, y - 4*hr);
      });
    }
  });
})();
