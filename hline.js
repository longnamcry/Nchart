// Đường ngang: 1 điểm, có nhãn giá
registerTool({
  id:'hline', label:'Ngang', points:1, anyX:true,
  draw({P, pts, W, hr, line, text}){
    line(0, P[0].y, W, P[0].y);
    text(pts[0].price.toFixed(2), 6*hr, P[0].y - 4*hr);
  }
});
