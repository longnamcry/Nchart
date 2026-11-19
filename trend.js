// Đường xu hướng: 2 điểm
registerTool({
  id:'trend', label:'Trendline', points:2,
  draw({P, line}){ line(P[0].x, P[0].y, P[1].x, P[1].y); }
});
