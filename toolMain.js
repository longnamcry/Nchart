// toolMain.js — LÕI công cụ vẽ: đăng ký tool, vẽ lên chart, xử lý click, thanh nút.
// Mỗi công cụ nằm ở file riêng trong thư mục tools/ và tự đăng ký bằng registerTool({...}).
(function () {
  const registry = [];
  window.registerTool = def => registry.push(def);

  let chart, series, getCandles, bar;
  let cur = null;               // bản vẽ đang thực hiện
  const drawings = [];          // các bản vẽ đã xong

  class Shape {
    constructor(def){ this.def = def; this.pts = []; this.hover = null; }
    attached({chart:ch, series:s, requestUpdate}){ this.chart = ch; this.series = s; this.req = requestUpdate; }
    update(){ this.req && this.req(); }
    paneViews(){ return [{ renderer: () => ({ draw: t => this.draw(t) }) }]; }

    draw(target){
      const def = this.def;
      const pts = [...this.pts, this.hover].filter(Boolean);
      if (pts.length < def.points) return;
      target.useBitmapCoordinateSpace(({context:ctx, horizontalPixelRatio:hr, verticalPixelRatio:vr, bitmapSize:bs}) => {
        const ts = this.chart.timeScale();
        const P = pts.map(p => {
          const x = ts.timeToCoordinate(p.time), y = this.series.priceToCoordinate(p.price);
          return { x: x==null ? null : x*hr, y: y==null ? null : y*vr, time:p.time, price:p.price };
        });
        if (P.some(p => p.y == null) || (!def.anyX && P.some(p => p.x == null))) return;

        ctx.save();
        ctx.lineWidth = 1.5*hr;
        ctx.strokeStyle = ctx.fillStyle = '#f0b90b';
        ctx.font = `${12*hr}px sans-serif`;
        def.draw({
          ctx, P, pts, hr, vr, W: bs.width, H: bs.height,
          candles: getCandles(),
          toY: price => { const y = this.series.priceToCoordinate(price); return y==null ? null : y*vr; },
          line: (x1,y1,x2,y2) => { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); },
          text: (s,x,y) => ctx.fillText(s,x,y)
        });
        ctx.restore();
      });
    }
  }

  function refresh(){
    bar.querySelectorAll('button[data-tool]').forEach(b =>
      b.classList.toggle('on', !!cur && cur.def.id === b.dataset.tool));
  }

  function start(id){
    if (cur){                                   // bấm lại cùng nút = hủy
      series.detachPrimitive(cur);
      const same = cur.def.id === id; cur = null;
      if (same){ refresh(); return; }
    }
    const def = registry.find(d => d.id === id); if (!def) return;
    cur = new Shape(def); series.attachPrimitive(cur); refresh();
  }
  function undo(){ const d = drawings.pop(); if (d) series.detachPrimitive(d); }
  function clear(){
    if (cur){ series.detachPrimitive(cur); cur = null; }
    drawings.forEach(d => series.detachPrimitive(d)); drawings.length = 0; refresh();
  }

  window.ToolMain = {
    clear, undo, start,
    init(o){
      chart = o.chart; series = o.series; getCandles = o.getCandles; bar = o.bar;

      registry.forEach(def => {
        const b = document.createElement('button');
        b.textContent = def.label; b.dataset.tool = def.id;
        b.onclick = () => start(def.id);
        bar.appendChild(b);
      });
      const u = document.createElement('button'); u.textContent = 'Hoàn tác'; u.onclick = undo; bar.appendChild(u);
      const c = document.createElement('button'); c.textContent = 'Xóa hết'; c.onclick = clear; bar.appendChild(c);

      chart.subscribeClick(p => {
        if (!cur || !p.time || !p.point) return;
        cur.pts.push({ time: p.time, price: series.coordinateToPrice(p.point.y) });
        if (cur.pts.length === cur.def.points){
          cur.hover = null; cur.update(); drawings.push(cur); cur = null; refresh();
        } else cur.update();
      });
      chart.subscribeCrosshairMove(p => {
        if (!cur || !p.point || !p.time) return;
        cur.hover = { time: p.time, price: series.coordinateToPrice(p.point.y) };
        cur.update();
      });
    }
  };
})();
