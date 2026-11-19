// Sonic R / Dragon: kênh EMA 34 của high, close, low
registerIndicator({
  id:'sonicr', label:'Sonic R',
  create({main}){
    const mk = color => main.addLineSeries({color, lineWidth:1, priceLineVisible:false, lastValueVisible:false});
    const hi = mk('#2196f3'), mid = mk('#64b5f6'), lo = mk('#2196f3');
    const P = 34;
    const calc = (c,f) => IU.line(c, IU.ema(c.map(f), P), P-1);
    return {
      setData(c){ hi.setData(calc(c,k=>k.high)); mid.setData(calc(c,k=>k.close)); lo.setData(calc(c,k=>k.low)); },
      setVisible(v){ [hi,mid,lo].forEach(s => s.applyOptions({visible:v})); }
    };
  }
});
