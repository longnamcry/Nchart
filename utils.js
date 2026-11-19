// Hàm tính dùng chung cho các chỉ báo
const IU = {
  sma(a, p){
    let s = 0;
    return a.map((v,i) => { s += v; if (i >= p) s -= a[i-p]; return s / Math.min(i+1, p); });
  },
  ema(a, p){
    const k = 2/(p+1); let e;
    return a.map((v,i) => e = i ? v*k + e*(1-k) : v);
  },
  rsi(closes, p = 14){
    let g = 0, l = 0; const out = [null];
    for (let i = 1; i < closes.length; i++){
      const d = closes[i] - closes[i-1], up = Math.max(d,0), dn = Math.max(-d,0);
      if (i <= p){ g += up/p; l += dn/p; } else { g = (g*(p-1)+up)/p; l = (l*(p-1)+dn)/p; }
      out.push(l === 0 ? 100 : 100 - 100/(1 + g/l));
    }
    return out;
  },
  // ghép mảng giá trị với thời gian nến, bỏ `skip` điểm đầu chưa đủ dữ liệu
  line(candles, vals, skip = 0){
    return vals.map((v,i) => ({ time: candles[i].time, value: v })).slice(skip);
  },
  // tạo nhanh một đường EMA: IU.emaIndicator(34,'#fff')
  emaIndicator(period, color){
    return {
      id: 'ema'+period, label: 'EMA '+period,
      create({main}){
        const s = main.addLineSeries({color, lineWidth:2, priceLineVisible:false, lastValueVisible:false});
        return {
          setData(c){ s.setData(IU.line(c, IU.ema(c.map(k => k.close), period), period-1)); },
          setVisible(v){ s.applyOptions({visible:v}); }
        };
      }
    };
  }
};
