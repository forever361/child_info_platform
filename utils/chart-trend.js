// Canvas-based Line/Trend Chart for WeChat Mini-program
// Shows domain level trends over time

const LEVEL_SCORE = { '优秀': 5, '良好': 4, '一般': 3, '需关注': 2 };
const LEVEL_LABEL = { 5: '优秀', 4: '良好', 3: '一般', 2: '需关注' };
const DOMAIN_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
const DOMAIN_NAMES = ['健康', '语言', '社会', '科学', '艺术', '学习'];

function parseDate(dateStr) {
  if (!dateStr) return null;
  // Format: "2026-03-01 09:00:00" or "2026-03-01T09:00:00.000Z"
  const parts = dateStr.split(/[\sT]/);
  if (parts.length < 2) return null;
  const dateParts = parts[0].split('-');
  const timeParts = parts[1].split(':');
  if (dateParts.length < 3) return null;
  // Create as local time: year, month-1, day, hour, minute
  return new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2]),
    parseInt(timeParts[0]) || 0,
    parseInt(timeParts[1]) || 0,
    0
  );
}

function drawTrendChart(canvasId, observations, canvasWidth) {
  if (!canvasId || !observations || !observations.length) return;
  const ctx = wx.createCanvasContext(canvasId);
  const width = canvasWidth || 340;
  const height = 310;
  const padLeft = 38;
  const padRight = 15;
  const padTop = 30;
  const padBottom = 30;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Group observations by month
  const monthData = {};
  observations.forEach(obs => {
    if (!obs || !obs.observation_date) return;
    const d = parseDate(obs.observation_date);
    if (!d) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthData[key]) monthData[key] = {};
    if (obs.analysisData && obs.analysisData.dimensions) {
      const di = obs.analysisData.domainIndex;
      if (di) {
        obs.analysisData.dimensions.forEach(dim => {
          // Use first dimension of each domain as proxy for domain level
        });
        // Take the first domain's level as representative
        if (!monthData[key].domainLevel) {
          monthData[key].domainLevel = {};
          obs.analysisData.dimensions.forEach(dim => {
            // just record that this observation exists
          });
        }
      }
    }
  });

  // Build monthly domain averages
  const sortedKeys = Object.keys(monthData).sort();
  // For each month, calculate average level per domain
  const monthlyAvg = {};
  sortedKeys.forEach(key => {
    monthlyAvg[key] = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  });

  observations.forEach(obs => {
    if (!obs || !obs.observation_date) return;
    if (!obs.analysisData || !obs.analysisData.dimensions) return;
    const di = obs.analysisData.domainIndex;
    if (!di || di < 1 || di > 6) return;
    const d = parseDate(obs.observation_date);
    if (!d) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyAvg[key]) return;
    obs.analysisData.dimensions.forEach(dim => {
      const score = LEVEL_SCORE[dim.level] || 3;
      monthlyAvg[key][di].push(score);
    });
  });

  const avgData = {};
  Object.entries(monthlyAvg).forEach(([key, domains]) => {
    avgData[key] = {};
    for (let i = 1; i <= 6; i++) {
      const vals = domains[i];
      avgData[key][i] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    }
  });

  const xLabels = sortedKeys.map(k => k.slice(5)); // MM
  const xCount = xLabels.length;
  console.log('Trend data - xLabels:', xLabels, 'xCount:', xCount, 'hasData:', Object.keys(monthlyAvg).length);

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Y axis grid and labels
  ctx.setFontSize(9);
  ctx.setFillStyle('#9ca3af');
  // yIdx: 1=需关注(2), 2=一般(3), 3=良好(4), 4=优秀(5)
  const yLabelMap = { 1: '需关注', 2: '一般', 3: '良好', 4: '优秀' };
  for (let y = 1; y <= 4; y++) {
    const yPos = padTop + chartH - (y - 1) * (chartH / 3);
    ctx.setStrokeStyle('#f3f4f6');
    ctx.setLineWidth(1);
    ctx.beginPath();
    ctx.moveTo(padLeft, yPos);
    ctx.lineTo(width - padRight, yPos);
    ctx.stroke();
    ctx.setTextAlign('right');
    // Draw label with white background to avoid overlap with lines
    const labelText = yLabelMap[y];
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(padLeft - 30, yPos - 8, 28, 14);
    ctx.setFillStyle('#9ca3af');
    ctx.fillText(labelText, padLeft - 4, yPos + 3);
  }

  // X axis labels
  ctx.setTextAlign('center');
  xLabels.forEach((label, i) => {
    if (xCount <= 1) return;
    const xPos = padLeft + (i / Math.max(xCount - 1, 1)) * chartW;
    ctx.fillText(String(label) + '月', xPos, height - 8);
  });

  // Draw lines for each domain
  if (xCount >= 1) {
    for (let di = 1; di <= 6; di++) {
      const points = [];
      sortedKeys.forEach((key, i) => {
        const val = avgData[key][di];
        if (val !== null && val !== undefined) {
          const x = padLeft + (xCount <= 1 ? chartW / 2 : i / Math.max(xCount - 1, 1)) * chartW;
          const y = padTop + chartH - (val - 2) / 3 * chartH;
          points.push({ x, y, val });
        }
      });

      if (points.length < 1) continue;

      ctx.beginPath();
      ctx.setStrokeStyle(DOMAIN_COLORS[di - 1]);
      ctx.setLineWidth(1.5);
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
        ctx.setFillStyle(DOMAIN_COLORS[di - 1]);
        ctx.fill();
      });
    }
  }

  // Legend
  const legendY = 8;
  for (let i = 0; i < 6; i++) {
    const x = padLeft + i * 50;
    ctx.setFontSize(8);
    ctx.setFillStyle(DOMAIN_COLORS[i]);
    ctx.fillRect(x, legendY, 8, 8);
    ctx.setFillStyle('#6b7280');
    ctx.textAlign = 'left';
    ctx.fillText(DOMAIN_NAMES[i], x + 11, legendY + 7);
  }

  ctx.draw();
}

module.exports = { drawTrendChart };
