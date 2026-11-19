// indicatorMain.js — LÕI chỉ báo: đăng ký, tạo series, bật/tắt, cập nhật dữ liệu.
// Mỗi chỉ báo nằm ở file riêng trong thư mục indicators/ và tự đăng ký bằng registerIndicator({...}).
//
// Khuôn một chỉ báo:
//   registerIndicator({
//     id:'abc', label:'ABC', defaultOn:true,
//     create({main, rsiC, cs}){ ...tạo series...
//       return {
//         setData(candles, full){ ... },   // full=false khi chỉ là tick websocket
//         setVisible(on){ ... }
//       };
//     }
//   });
(function(){
  const defs = [], live = [];
  let gc;
  window.registerIndicator = d => defs.push(d);

  window.IndicatorMain = {
    init({main, rsiC, cs, getCandles, bar}){
      gc = getCandles;
      defs.forEach(d => {
        const l = { d, on: d.defaultOn !== false, inst: d.create({main, rsiC, cs}) };
        l.inst.setVisible(l.on);
        live.push(l);

        const b = document.createElement('button');
        b.textContent = d.label; b.className = l.on ? 'on' : '';
        b.onclick = () => {
          l.on = !l.on; b.className = l.on ? 'on' : '';
          l.inst.setVisible(l.on);
          const c = gc(); if (l.on && c.length) l.inst.setData(c, true);
        };
        bar.appendChild(b);
      });
    },
    render(full = true){
      const c = gc(); if (!c.length) return;
      live.forEach(l => l.on && l.inst.setData(c, full));
    }
  };
})();
