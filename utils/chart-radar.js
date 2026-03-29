// Canvas-based Radar Chart for WeChat Mini-program
// 6 axes for 6 developmental domains

const LEVEL_MAP = { '优秀': 5, '良好': 4, '一般': 3, '需关注': 2 };

function drawRadarChart(canvasId, domainSummary, canvasWidth) {
  if (!canvasId || !domainSummary || !domainSummary.length) return;
  const ctx = wx.createCanvasContext(canvasId);
  const width = canvasWidth || 320;
  const height = 320; // tall enough for bottom label
  const centerX = width / 2;
  const centerY = height / 2 - 15; // shift up slightly
  const radius = width * 0.28;

  const domains = domainSummary.map(d => {
    const full = d.domainLabel || '';
    let label = full;
    if (full.includes('健康')) label = '健康';
    else if (full.includes('语言')) label = '语言';
    else if (full.includes('社会')) label = '社会';
    else if (full.includes('科学')) label = '科学';
    else if (full.includes('艺术')) label = '艺术';
    else if (full.includes('学习')) label = '学习品质';
    return label;
  });
  const n = domains.length;
  const angleStep = (2 * Math.PI) / n;

  // Background rings
  ctx.setStrokeStyle('#e5e7eb');
  ctx.setLineWidth(1);
  for (let ring = 1; ring <= 5; ring++) {
    const r = radius * (ring / 5);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Axis lines
  ctx.setStrokeStyle('#d1d5db');
  for (let i = 0; i < n; i++) {
    const angle = i * angleStep - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
    ctx.stroke();
  }

  // Data polygon
  const dataPoints = domainSummary.map((d, i) => {
    const level = LEVEL_MAP[d.level] || 3;
    const r = radius * (level / 5);
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  });

  ctx.beginPath();
  dataPoints.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.setFillStyle('rgba(74, 144, 217, 0.25)');
  ctx.setStrokeStyle('#4A90D9');
  ctx.setLineWidth(2);
  ctx.fill();
  ctx.stroke();

  // Data points
  dataPoints.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
    ctx.setFillStyle('#4A90D9');
    ctx.fill();
  });

  // Labels - keep within canvas bounds
  const labelRadius = radius + 24;
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
  domains.forEach((label, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    ctx.setFontSize(10);
    ctx.setFillStyle(colors[i] || '#666');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
  });

  ctx.draw();
}

module.exports = { drawRadarChart, LEVEL_MAP };
