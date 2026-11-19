// SNR: hỗ trợ / kháng cự từ các đỉnh-đáy pivot, gom thành vùng.
// Nặng nên chỉ tính khi tải dữ liệu (full=true), không tính mỗi tick.
registerIndicator({
  id:'snr', label:'SNR',
  create({cs}){
    let lines = [];
    const clear = () => { lines.forEach(l => cs.removePriceLine(l)); lines = []; };

    function pivots(d, L = 5, R = 5){
      const out = [];
      for (let i = L; i < d.length - R; i++){
        let hi = true, lo = true;
        for (let j = i-L; j <= i+R; j++){
          if (d[j].high > d[i].high) hi = false;
          if (d[j].low  < d[i].low)  lo = false;
        }
        if (hi) out.push(d[i].high);
        if (lo) out.push(d[i].low);
      }
      return out;
    }
    function cluster(levels, tol = 0.004){
      levels.sort((a,b) => a-b); const g = [];
      levels.forEach(p => {
        const l = g[g.length-1];
        if (l && (p-l.avg)/l.avg < tol){ l.sum += p; l.n++; l.avg = l.sum/l.n; }
        else g.push({sum:p, n:1, avg:p});
      });
      return g.filter(x => x.n >= 2).sort((a,b) => b.n-a.n).slice(0,8);
    }

    return {
      setData(c, full){
        if (!full) return;
        clear();
        const last = c[c.length-1].close;
        cluster(pivots(c.slice(-300))).forEach(z => {
          const res = z.avg > last;
          lines.push(cs.createPriceLine({price:z.avg, color: res ? '#ef5350' : '#26a69a',
            lineWidth:1, lineStyle:2, title:(res ? 'R' : 'S') + z.n}));
        });
      },
      setVisible(v){ if (!v) clear(); }
    };
  }
});
