// Đường dọc: 1 điểm
registerTool({
  id:'vline', label:'Dọc', points:1,
  draw({P, H, line}){ line(P[0].x, 0, P[0].x, H); }
});
