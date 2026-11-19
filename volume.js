// Khối lượng + MA20 của volume
registerIndicator({
  id:'vol', label:'Volume',
  create({main}){
    const h = main.addHistogramSeries({priceFormat:{type:'volume'}, priceScaleId:'vol'});
    h.priceScale().applyOptions({scaleMargins:{top:0.8, bottom:0}});
    const ma = main.addLineSeries({color:'#f0b90b', lineWidth:1, priceScaleId:'vol',
                                   priceLineVisible:false, lastValueVisible:false});
    return {
      setData(c){
        h.setData(c.map(k => ({time:k.time, value:k.volume,
                               color: k.close >= k.open ? '#26a69a88' : '#ef535088'})));
        ma.setData(IU.line(c, IU.sma(c.map(k => k.volume), 20), 19));
      },
      setVisible(v){ h.applyOptions({visible:v}); ma.applyOptions({visible:v}); }
    };
  }
});
