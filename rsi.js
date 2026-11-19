// RSI(14) — vẽ ở khung riêng bên dưới (rsiC)
registerIndicator({
  id:'rsi', label:'RSI',
  create({rsiC}){
    const s = rsiC.addLineSeries({color:'#9575cd', lineWidth:2});
    s.createPriceLine({price:70, color:'#555', lineStyle:2});
    s.createPriceLine({price:30, color:'#555', lineStyle:2});
    return {
      setData(c){ s.setData(IU.line(c, IU.rsi(c.map(k => k.close), 14), 14)); },
      setVisible(v){
        s.applyOptions({visible:v});
        document.getElementById('rsi').style.display = v ? 'block' : 'none';
      }
    };
  }
});
