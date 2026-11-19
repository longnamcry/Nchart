// Hình chữ nhật (vùng giá / thời gian): 2 điểm
registerTool({
  id:'rect', label:'Hộp', points:2,
  draw({ctx, P}){
    const [a,b] = P;
    ctx.fillStyle = 'rgba(240,185,11,.15)';
    ctx.fillRect(a.x, a.y, b.x-a.x, b.y-a.y);
    ctx.strokeRect(a.x, a.y, b.x-a.x, b.y-a.y);
  }
});
