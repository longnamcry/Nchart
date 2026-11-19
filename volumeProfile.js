// Volume Profile (VSP) trên vùng đang hiển thị, POC tô vàng.
registerIndicator({
  id:'vp', label:'VP', defaultOn:false,
  create({cs}){
    const vp = {
      bins: 40, c: [], on: false,
      attached({chart, series, requestUpdate}){ this.chart = chart; this.series = series; this.req = requestUpdate; },
      paneViews(){ return [{ renderer: () => ({ draw: t => this.draw(t) }) }]; },
      draw(target){
        if (!this.on) return;
        const r = this.chart.timeScale().getVisibleRange(); if (!r) return;
        const vis = this.c.filter(k => k.time >= r.from && k.time <= r.to); if (!vis.length) return;
        const hi = Math.max(...vis.map(k => k.high)), lo = Math.min(...vis.map(k => k.low));
        const step = (hi-lo)/this.bins; if (!step) return;
        const v = new Array(this.bins).fill(0);
        vis.forEach(k => {
          const a = Math.floor((k.low-lo)/step);
          const b = Math.min(this.bins-1, Math.floor((k.high-lo)/step));
          for (let i = a; i <= b; i++) v[i] += k.volume/(b-a+1);
        });
        const max = Math.max(...v), poc = v.indexOf(max);
        target.useBitmapCoordinateSpace(({context:c, verticalPixelRatio:vr, bitmapSize}) => {
          const W = bitmapSize.width * 0.25;
          v.forEach((val,i) => {
            const y0 = this.series.priceToCoordinate(lo + i*step);
            const y1 = this.series.priceToCoordinate(lo + (i+1)*step);
            if (y0 == null || y1 == null) return;
            const w = W*val/max;
            c.fillStyle = i === poc ? 'rgba(240,185,11,.6)' : 'rgba(100,150,255,.35)';
            c.fillRect(bitmapSize.width - w, y1*vr, w, Math.max(1, (y0-y1)*vr - 1));
          });
        });
      }
    };
    cs.attachPrimitive(vp);
    return {
      setData(c){ vp.c = c; vp.req && vp.req(); },
      setVisible(v){ vp.on = v; vp.req && vp.req(); }
    };
  }
});
