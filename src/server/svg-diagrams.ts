/**
 * Educational SVG Diagram Generator for Primary & Secondary School Subjects
 * Clean vector graphics with Sarabun typography, clear lines, and crisp labels.
 */

function svgWrap(content: string, width = 360, height = 200, caption = ''): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="max-width:100%;height:auto;display:inline-block;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;padding:4px;box-sizing:border-box;">
  <style>
    text { font-family: 'Sarabun', 'Mali', sans-serif; }
    .label { font-size: 13px; font-weight: bold; fill: #1e293b; }
    .sublabel { font-size: 11px; fill: #64748b; }
    .axis { stroke: #475569; stroke-width: 1.5; }
    .grid { stroke: #e2e8f0; stroke-width: 1; stroke-dasharray: 3,3; }
  </style>
  ${content}
  ${caption ? `<text x="${width / 2}" y="${height - 8}" text-anchor="middle" class="sublabel">${caption}</text>` : ''}
</svg>`;
}

// ----------------- Mathematics Diagrams -----------------

export function createFractionPieSvg(numerator: number = 3, denominator: number = 8): string {
  const cx = 180;
  const cy = 95;
  const r = 70;
  let paths = '';

  for (let i = 0; i < denominator; i++) {
    const startAngle = (i * 2 * Math.PI) / denominator - Math.PI / 2;
    const endAngle = ((i + 1) * 2 * Math.PI) / denominator - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const isShaded = i < numerator;
    const fill = isShaded ? '#60a5fa' : '#f8fafc';

    paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" fill="${fill}" stroke="#2563eb" stroke-width="1.5" />`;
  }

  const content = `
    <rect width="100%" height="100%" fill="#ffffff" />
    <g>${paths}</g>
    <circle cx="${cx}" cy="${cy}" r="3" fill="#1e3a8a" />
    <text x="${cx}" y="185" text-anchor="middle" class="label">ส่วนที่แรเงาคิดเป็นเศษส่วนเท่าใดของรูปทั้งหมด?</text>
  `;
  return svgWrap(content, 360, 200);
}

export function createFractionBarSvg(shaded = 3, total = 5): string {
  const x = 40;
  const y = 60;
  const w = 280;
  const h = 48;
  const segW = w / total;
  let segments = '';

  for (let i = 0; i < total; i++) {
    const isShaded = i < shaded;
    segments += `<rect x="${x + i * segW}" y="${y}" width="${segW}" height="${h}" fill="${isShaded ? '#38bdf8' : '#f1f5f9'}" stroke="#0284c7" stroke-width="1.5" />`;
    if (isShaded) {
      segments += `<text x="${x + i * segW + segW / 2}" y="${y + h / 2 + 5}" text-anchor="middle" fill="#0369a1" font-size="14" font-weight="bold">1/${total}</text>`;
    }
  }

  const content = `
    <rect width="100%" height="100%" fill="#ffffff" />
    <text x="180" y="35" text-anchor="middle" class="label">แถบเศษส่วนแสดงจำนวนส่วนที่แรเงา</text>
    ${segments}
    <text x="180" y="150" text-anchor="middle" class="sublabel">แถบยาวทั้งหมดแบ่งออกเป็น ${total} ส่วนเท่าๆ กัน</text>
  `;
  return svgWrap(content, 360, 180);
}

export function createRightTriangleSvg(a = '6 ซม.', b = '8 ซม.', c = 'c'): string {
  const content = `
    <polygon points="60,140 260,140 60,30" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
    <!-- สัญลักษณ์มุมฉาก -->
    <rect x="60" y="125" width="15" height="15" fill="none" stroke="#16a34a" stroke-width="1.5" />
    <!-- ป้ายกำกับด้าน -->
    <text x="45" y="85" text-anchor="end" class="label">${a}</text>
    <text x="160" y="160" text-anchor="middle" class="label">${b}</text>
    <text x="175" y="75" text-anchor="start" class="label" fill="#dc2626">${c} = ?</text>
    <text x="180" y="185" text-anchor="middle" class="sublabel">รูปสามเหลี่ยมมุมฉาก มีมุมหนึ่งเป็นมุมฉาก (90°)</text>
  `;
  return svgWrap(content, 360, 200);
}

export function createParallelLinesSvg(): string {
  const content = `
    <!-- เส้นขนาน 2 เส้น -->
    <line x1="30" y1="55" x2="330" y2="55" stroke="#1e293b" stroke-width="2" />
    <line x1="30" y1="125" x2="330" y2="125" stroke="#1e293b" stroke-width="2" />
    <text x="340" y="60" class="label">L₁</text>
    <text x="340" y="130" class="label">L₂</text>
    <!-- ลูกศรขนาน -->
    <path d="M 180 50 L 190 55 L 180 60" fill="none" stroke="#2563eb" stroke-width="2" />
    <path d="M 180 120 L 190 125 L 180 130" fill="none" stroke="#2563eb" stroke-width="2" />
    <!-- เส้นตัดขวาง -->
    <line x1="90" y1="165" x2="250" y2="20" stroke="#dc2626" stroke-width="2" />
    <!-- มุม 1 และ มุม 2 (มุมแย้ง) -->
    <path d="M 190 55 A 20 20 0 0 1 180 37" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
    <text x="185" y="42" class="label">1</text>
    <path d="M 150 125 A 20 20 0 0 1 160 143" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
    <text x="155" y="145" class="label">2</text>
    <text x="180" y="185" text-anchor="middle" class="sublabel">ถ้าเส้นตรง L₁ ขนานกับ L₂ แล้ว มุม 1 และ มุม 2 มีความสัมพันธ์กันอย่างไร?</text>
  `;
  return svgWrap(content, 360, 200);
}

export function createBarChartSvg(title = 'คะแนนเฉลี่ยจำแนกตามวิชา'): string {
  const content = `
    <text x="180" y="25" text-anchor="middle" class="label">${title}</text>
    <!-- แกน X และ Y -->
    <line x1="60" y1="35" x2="60" y2="140" class="axis" />
    <line x1="60" y1="140" x2="320" y2="140" class="axis" />
    <!-- เส้นกริดระดับคะแนน -->
    <line x1="60" y1="110" x2="320" y2="110" class="grid" />
    <line x1="60" y1="75" x2="320" y2="75" class="grid" />
    <line x1="60" y1="45" x2="320" y2="45" class="grid" />
    <text x="50" y="145" text-anchor="end" class="sublabel">0</text>
    <text x="50" y="114" text-anchor="end" class="sublabel">10</text>
    <text x="50" y="79" text-anchor="end" class="sublabel">20</text>
    <text x="50" y="49" text-anchor="end" class="sublabel">30</text>
    <!-- แท่งกราฟ -->
    <rect x="85" y="65" width="45" height="75" fill="#3b82f6" rx="3" />
    <text x="107" y="60" text-anchor="middle" class="label">25</text>
    <text x="107" y="158" text-anchor="middle" class="sublabel">คณิต</text>

    <rect x="160" y="80" width="45" height="60" fill="#10b981" rx="3" />
    <text x="182" y="75" text-anchor="middle" class="label">20</text>
    <text x="182" y="158" text-anchor="middle" class="sublabel">วิทย์</text>

    <rect x="235" y="50" width="45" height="90" fill="#f59e0b" rx="3" />
    <text x="257" y="45" text-anchor="middle" class="label">30</text>
    <text x="257" y="158" text-anchor="middle" class="sublabel">ภาษาไทย</text>
  `;
  return svgWrap(content, 360, 185);
}

export function createClockSvg(hour = 8, minute = 30): string {
  const cx = 180;
  const cy = 90;
  const r = 65;

  const minAngle = (minute * 6 * Math.PI) / 180 - Math.PI / 2;
  const hrAngle = ((hour % 12) * 30 + minute * 0.5) * (Math.PI / 180) - Math.PI / 2;

  const mx = cx + (r - 12) * Math.cos(minAngle);
  const my = cy + (r - 12) * Math.sin(minAngle);
  const hx = cx + (r - 28) * Math.cos(hrAngle);
  const hy = cy + (r - 28) * Math.sin(hrAngle);

  const content = `
    <!-- หน้าปัด -->
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#f8fafc" stroke="#334155" stroke-width="2.5" />
    <!-- ตัวเลข 12, 3, 6, 9 -->
    <text x="${cx}" y="${cy - r + 16}" text-anchor="middle" class="label">12</text>
    <text x="${cx + r - 14}" y="${cy + 5}" text-anchor="middle" class="label">3</text>
    <text x="${cx}" y="${cy + r - 8}" text-anchor="middle" class="label">6</text>
    <text x="${cx - r + 14}" y="${cy + 5}" text-anchor="middle" class="label">9</text>
    <!-- เข็มสั้น (ชั่วโมง) -->
    <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
    <!-- เข็มยาว (นาที) -->
    <line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" />
    <!-- จุดหมุนกลาง -->
    <circle cx="${cx}" cy="${cy}" r="4" fill="#dc2626" />
    <text x="180" y="180" text-anchor="middle" class="sublabel">นาฬิกานี้บอกเวลาใด?</text>
  `;
  return svgWrap(content, 360, 195);
}

// ----------------- Science Diagrams -----------------

export function createPhotosynthesisSvg(): string {
  const content = `
    <!-- ใบไม้ -->
    <path d="M 60 110 C 80 40 180 30 260 70 C 280 85 290 100 290 110 C 290 130 220 170 120 160 C 80 150 60 120 60 110 Z" fill="#86efac" stroke="#16a34a" stroke-width="2.5" />
    <!-- เส้นใบ -->
    <path d="M 60 110 Q 170 105 290 110" fill="none" stroke="#15803d" stroke-width="2" />
    <line x1="120" y1="108" x2="160" y2="70" stroke="#15803d" stroke-width="1.5" />
    <line x1="180" y1="107" x2="220" y2="80" stroke="#15803d" stroke-width="1.5" />
    <line x1="140" y1="108" x2="170" y2="140" stroke="#15803d" stroke-width="1.5" />
    <!-- แสงอาทิตย์ -->
    <circle cx="50" cy="35" r="18" fill="#facc15" stroke="#eab308" stroke-width="2" />
    <path d="M 68 45 L 110 75" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,2" />
    <text x="115" y="65" class="sublabel" fill="#b45309">แสงแดด</text>
    <!-- CO2 เข้า -->
    <path d="M 170 18 L 180 50" stroke="#64748b" stroke-width="1.8" />
    <text x="185" y="35" class="label" fill="#334155">CO₂ (ก๊าซคาร์บอนไดออกไซด์)</text>
    <!-- O2 ออก -->
    <path d="M 230 65 L 260 35" stroke="#0284c7" stroke-width="1.8" />
    <text x="265" y="32" class="label" fill="#0369a1">O₂ (ก๊าซออกซิเจน)</text>
    <!-- ผลผลิต น้ำตาล -->
    <text x="180" y="185" text-anchor="middle" class="label">กระบวนการสังเคราะห์ด้วยแสงของพืช</text>
  `;
  return svgWrap(content, 360, 200);
}

export function createElectricCircuitSvg(): string {
  const content = `
    <!-- สายไฟสี่เหลี่ยม -->
    <rect x="60" y="45" width="240" height="95" fill="none" stroke="#334155" stroke-width="2.5" />
    <!-- ถ่านไฟฉาย (แบตเตอรี่) ด้านบน -->
    <rect x="140" y="35" width="45" height="20" fill="#f8fafc" stroke="#334155" stroke-width="2" />
    <line x1="155" y1="35" x2="155" y2="55" stroke="#dc2626" stroke-width="2.5" />
    <line x1="170" y1="40" x2="170" y2="50" stroke="#1e293b" stroke-width="2" />
    <text x="153" y="28" text-anchor="middle" class="label" fill="#dc2626">+</text>
    <text x="172" y="28" text-anchor="middle" class="label" fill="#1e293b">-</text>
    <!-- หลอดไฟ ด้านล่าง -->
    <circle cx="180" cy="140" r="16" fill="#fef08a" stroke="#ca8a04" stroke-width="2" />
    <path d="M 172 140 Q 180 128 188 140" fill="none" stroke="#854d0e" stroke-width="1.5" />
    <!-- สวิตช์ ด้านซ้าย -->
    <circle cx="60" cy="85" r="4" fill="#334155" />
    <circle cx="60" cy="105" r="4" fill="#334155" />
    <line x1="60" y1="85" x2="75" y2="95" stroke="#dc2626" stroke-width="2.5" />
    <text x="85" y="93" class="sublabel">สวิตช์ (เปิด/ปิด)</text>
    <!-- แสงสว่างรอบหลอด -->
    <line x1="180" y1="162" x2="180" y2="172" stroke="#eab308" stroke-width="1.5" />
    <line x1="160" y1="155" x2="152" y2="163" stroke="#eab308" stroke-width="1.5" />
    <line x1="200" y1="155" x2="208" y2="163" stroke="#eab308" stroke-width="1.5" />
    <text x="180" y="190" text-anchor="middle" class="sublabel">วงจรไฟฟ้าอย่างง่าย (ถ่านไฟฉาย สวิตช์ และหลอดไฟ)</text>
  `;
  return svgWrap(content, 360, 205);
}

export function createFoodChainSvg(): string {
  const content = `
    <!-- โซ่อาหาร: พืช -> ตั๊กแตน -> กบ -> เหยี่ยว -->
    <g transform="translate(15, 45)">
      <!-- สิ่งมีชีวิต 1 -->
      <rect x="0" y="0" width="65" height="50" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5" />
      <text x="32" y="24" text-anchor="middle" class="label">หญ้า</text>
      <text x="32" y="40" text-anchor="middle" class="sublabel">(ผู้ผลิต)</text>

      <path d="M 70 25 L 90 25 M 85 20 L 92 25 L 85 30" stroke="#059669" stroke-width="2" fill="none" />

      <!-- สิ่งมีชีวิต 2 -->
      <rect x="95" y="0" width="70" height="50" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="1.5" />
      <text x="130" y="24" text-anchor="middle" class="label">ตั๊กแตน</text>
      <text x="130" y="40" text-anchor="middle" class="sublabel">(ผู้บริโภค 1)</text>

      <path d="M 170 25 L 190 25 M 185 20 L 192 25 L 185 30" stroke="#d97706" stroke-width="2" fill="none" />

      <!-- สิ่งมีชีวิต 3 -->
      <rect x="195" y="0" width="60" height="50" rx="8" fill="#e0e7ff" stroke="#4f46e5" stroke-width="1.5" />
      <text x="225" y="24" text-anchor="middle" class="label">กบ</text>
      <text x="225" y="40" text-anchor="middle" class="sublabel">(ผู้บริโภค 2)</text>

      <path d="M 260 25 L 275 25 M 270 20 L 277 25 L 270 30" stroke="#4f46e5" stroke-width="2" fill="none" />

      <!-- สิ่งมีชีวิต 4 -->
      <rect x="280" y="0" width="55" height="50" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5" />
      <text x="307" y="24" text-anchor="middle" class="label">เหยี่ยว</text>
      <text x="307" y="40" text-anchor="middle" class="sublabel">(ลำดับสูงสุด)</text>
    </g>
    <text x="180" y="145" text-anchor="middle" class="label">ลูกศรแสดงทิศทางการถ่ายทอดพลังงานในสายใยอาหาร</text>
  `;
  return svgWrap(content, 360, 165);
}

export function createStatesOfMatterSvg(): string {
  const content = `
    <!-- ของแข็ง -->
    <rect x="30" y="40" width="80" height="85" fill="#f8fafc" stroke="#334155" stroke-width="1.5" rx="4" />
    <g fill="#3b82f6" stroke="#1d4ed8">
      <circle cx="50" cy="70" r="7" /><circle cx="70" cy="70" r="7" /><circle cx="90" cy="70" r="7" />
      <circle cx="50" cy="90" r="7" /><circle cx="70" cy="90" r="7" /><circle cx="90" cy="90" r="7" />
      <circle cx="50" cy="110" r="7" /><circle cx="70" cy="110" r="7" /><circle cx="90" cy="110" r="7" />
    </g>
    <text x="70" y="145" text-anchor="middle" class="label">ของแข็ง</text>
    <text x="70" y="160" text-anchor="middle" class="sublabel">(เรียงชิดแน่น)</text>

    <!-- ของเหลว -->
    <rect x="140" y="40" width="80" height="85" fill="#f8fafc" stroke="#334155" stroke-width="1.5" rx="4" />
    <g fill="#10b981" stroke="#047857">
      <circle cx="160" cy="75" r="7" /><circle cx="185" cy="80" r="7" /><circle cx="205" cy="95" r="7" />
      <circle cx="155" cy="105" r="7" /><circle cx="180" cy="110" r="7" /><circle cx="200" cy="115" r="7" />
    </g>
    <text x="180" y="145" text-anchor="middle" class="label">ของเหลว</text>
    <text x="180" y="160" text-anchor="middle" class="sublabel">(อยู่ใกล้ เคลื่อนที่ได้)</text>

    <!-- แก๊ส -->
    <rect x="250" y="40" width="80" height="85" fill="#f8fafc" stroke="#334155" stroke-width="1.5" rx="4" />
    <g fill="#f59e0b" stroke="#b45309">
      <circle cx="270" cy="60" r="7" /><circle cx="310" cy="75" r="7" /><circle cx="280" cy="110" r="7" />
    </g>
    <text x="290" y="145" text-anchor="middle" class="label">แก๊ส</text>
    <text x="290" y="160" text-anchor="middle" class="sublabel">(ฟุ้งกระจายห่างกัน)</text>
  `;
  return svgWrap(content, 360, 185);
}

export function createMagnetFieldSvg(): string {
  const content = `
    <!-- แม่เหล็กแท่ง N และ S -->
    <rect x="80" y="70" width="100" height="40" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
    <text x="130" y="96" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">N</text>
    <rect x="180" y="70" width="100" height="40" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
    <text x="230" y="96" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">S</text>
    <!-- เส้นแรงแม่เหล็ก ออกจาก N ไปหา S -->
    <path d="M 120 70 C 120 20 240 20 240 70" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,2" />
    <path d="M 180 28 L 188 28 L 184 22" fill="#64748b" />
    <path d="M 120 110 C 120 160 240 160 240 110" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,2" />
    <path d="M 180 152 L 188 152 L 184 158" fill="#64748b" />
    <text x="180" y="185" text-anchor="middle" class="sublabel">เส้นแรงแม่เหล็กพุ่งออกจากขั้วเหนือ (N) เข้าสู่ขั้วใต้ (S)</text>
  `;
  return svgWrap(content, 360, 200);
}

// ----------------- Thai & English & Social Diagrams -----------------

export function createThaiTriyangSvg(): string {
  const content = `
    <text x="180" y="25" text-anchor="middle" class="label">ไตรยางศ์ (อักษร 3 หมู่)</text>
    <!-- 3 กล่อง -->
    <rect x="25" y="40" width="95" height="100" rx="8" fill="#ecfdf5" stroke="#059669" stroke-width="1.5" />
    <text x="72" y="62" text-anchor="middle" class="label" fill="#047857">อักษรสูง (11)</text>
    <text x="72" y="85" text-anchor="middle" class="sublabel">ข ฃ ฉ ฐ ถ</text>
    <text x="72" y="105" text-anchor="middle" class="sublabel">ผ ฝ ศ ษ ส ห</text>
    <text x="72" y="125" text-anchor="middle" font-size="10" fill="#065f46">ผีฝากถุงข้าวสารให้ฉัน</text>

    <rect x="132" y="40" width="95" height="100" rx="8" fill="#eff6ff" stroke="#2563eb" stroke-width="1.5" />
    <text x="180" y="62" text-anchor="middle" class="label" fill="#1d4ed8">อักษรกลาง (9)</text>
    <text x="180" y="85" text-anchor="middle" class="sublabel">ก จ ด ต บ ป</text>
    <text x="180" y="105" text-anchor="middle" class="sublabel">อ ฎ ฏ</text>
    <text x="180" y="125" text-anchor="middle" font-size="10" fill="#1e40af">ไก่จิกเด็กตายฯ</text>

    <rect x="240" y="40" width="95" height="100" rx="8" fill="#fff7ed" stroke="#ea580c" stroke-width="1.5" />
    <text x="287" y="62" text-anchor="middle" class="label" fill="#c2410c">อักษรต่ำ (24)</text>
    <text x="287" y="85" text-anchor="middle" class="sublabel">ต่ำเดี่ยว (10)</text>
    <text x="287" y="105" text-anchor="middle" class="sublabel">ต่ำคู่ (14)</text>
    <text x="287" y="125" text-anchor="middle" font-size="10" fill="#9a3412">ค ง ช ซ ท น พ...</text>
  `;
  return svgWrap(content, 360, 160);
}

export function createPrepositionSvg(): string {
  const content = `
    <text x="180" y="25" text-anchor="middle" class="label">Prepositions of Place</text>
    <!-- โต๊ะ -->
    <rect x="100" y="90" width="160" height="15" fill="#ca8a04" rx="2" />
    <line x1="120" y1="105" x2="120" y2="150" stroke="#a16207" stroke-width="6" />
    <line x1="240" y1="105" x2="240" y2="150" stroke="#a16207" stroke-width="6" />
    <!-- ลูกบอลอยู่บนโต๊ะ (on) -->
    <circle cx="180" cy="72" r="16" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
    <text x="180" y="77" text-anchor="middle" fill="#fff" font-weight="bold" font-size="12">ON</text>
    <!-- ลูกบอลอยู่ใต้โต๊ะ (under) -->
    <circle cx="180" cy="132" r="14" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.8" />
    <text x="180" y="136" text-anchor="middle" fill="#fff" font-weight="bold" font-size="10">UNDER</text>
    <text x="180" y="180" text-anchor="middle" class="sublabel">The red ball is on the table.</text>
  `;
  return svgWrap(content, 360, 195);
}

export function createCompassDirectionsSvg(): string {
  const cx = 180;
  const cy = 95;
  const r = 60;
  const content = `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5" />
    <!-- แกน N-S, E-W -->
    <line x1="${cx}" y1="${cy - r + 5}" x2="${cx}" y2="${cy + r - 5}" stroke="#475569" stroke-width="2" />
    <line x1="${cx - r + 5}" y1="${cy}" x2="${cx + r - 5}" y2="${cy}" stroke="#475569" stroke-width="2" />
    <!-- ลูกศรเหนือ แดง -->
    <polygon points="${cx},${cy - r + 8} ${cx - 7},${cy - 10} ${cx + 7},${cy - 10}" fill="#dc2626" />
    <polygon points="${cx},${cy + r - 8} ${cx - 7},${cy + 10} ${cx + 7},${cy + 10}" fill="#475569" />
    <text x="${cx}" y="${cy - r - 4}" text-anchor="middle" class="label" fill="#dc2626">N (เหนือ)</text>
    <text x="${cx}" y="${cy + r + 16}" text-anchor="middle" class="label">S (ใต้)</text>
    <text x="${cx + r + 24}" y="${cy + 5}" text-anchor="middle" class="label">E (ออก)</text>
    <text x="${cx - r - 24}" y="${cy + 5}" text-anchor="middle" class="label">W (ตก)</text>
  `;
  return svgWrap(content, 360, 195);
}

export function createSufficiencyEconomySvg(): string {
  const content = `
    <text x="180" y="24" text-anchor="middle" class="label">ปรัชญาเศรษฐกิจพอเพียง (3 ห่วง 2 เงื่อนไข)</text>
    <!-- 3 ห่วงซ้อน -->
    <circle cx="130" cy="75" r="32" fill="#dbeafe" stroke="#2563eb" stroke-width="2" opacity="0.75" />
    <text x="130" y="78" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e40af">พอประมาณ</text>

    <circle cx="230" cy="75" r="32" fill="#dcfce7" stroke="#16a34a" stroke-width="2" opacity="0.75" />
    <text x="230" y="78" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">มีเหตุผล</text>

    <circle cx="180" cy="105" r="32" fill="#fef3c7" stroke="#d97706" stroke-width="2" opacity="0.75" />
    <text x="180" y="108" text-anchor="middle" font-size="11" font-weight="bold" fill="#b45309">มีภูมิคุ้มกัน</text>

    <!-- ฐาน 2 เงื่อนไข -->
    <rect x="50" y="145" width="125" height="28" rx="4" fill="#f1f5f9" stroke="#475569" stroke-width="1.5" />
    <text x="112" y="163" text-anchor="middle" class="label">เงื่อนไขความรู้</text>
    <rect x="185" y="145" width="125" height="28" rx="4" fill="#f1f5f9" stroke="#475569" stroke-width="1.5" />
    <text x="247" y="163" text-anchor="middle" class="label">เงื่อนไขคุณธรรม</text>
  `;
  return svgWrap(content, 360, 190);
}

export function createSentenceStructureSvg(): string {
  const content = `
    <text x="190" y="24" text-anchor="middle" class="label">โครงสร้างประโยคในภาษาไทย</text>
    
    <!-- ภาคประธาน -->
    <rect x="20" y="45" width="160" height="110" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" />
    <text x="100" y="68" text-anchor="middle" font-size="13" font-weight="bold" fill="#1d4ed8">ภาคประธาน</text>
    <line x1="30" y1="76" x2="170" y2="76" stroke="#bfdbfe" stroke-width="1" />
    
    <rect x="30" y="85" width="65" height="55" rx="4" fill="#ffffff" stroke="#93c5fd" />
    <text x="62" y="105" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e40af">ประธาน</text>
    <text x="62" y="125" text-anchor="middle" font-size="9" fill="#64748b">(คำนาม/สรรพนาม)</text>

    <rect x="105" y="85" width="65" height="55" rx="4" fill="#ffffff" stroke="#93c5fd" />
    <text x="137" y="105" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e40af">ขยายประธาน</text>
    <text x="137" y="125" text-anchor="middle" font-size="9" fill="#64748b">(คำวิเศษณ์)</text>

    <!-- ภาคแสดง -->
    <rect x="200" y="45" width="160" height="110" rx="6" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5" />
    <text x="280" y="68" text-anchor="middle" font-size="13" font-weight="bold" fill="#15803d">ภาคแสดง</text>
    <line x1="210" y1="76" x2="350" y2="76" stroke="#bbf7d0" stroke-width="1" />

    <rect x="210" y="85" width="65" height="55" rx="4" fill="#ffffff" stroke="#86efac" />
    <text x="242" y="105" text-anchor="middle" font-size="11" font-weight="bold" fill="#166534">กริยา</text>
    <text x="242" y="125" text-anchor="middle" font-size="9" fill="#64748b">(อกรรม/สกรรม)</text>

    <rect x="285" y="85" width="65" height="55" rx="4" fill="#ffffff" stroke="#86efac" />
    <text x="317" y="105" text-anchor="middle" font-size="11" font-weight="bold" fill="#166534">กรรม/ขยาย</text>
    <text x="317" y="125" text-anchor="middle" font-size="9" fill="#64748b">(ส่วนเติมเต็ม)</text>
  `;
  return svgWrap(content, 380, 175);
}

export function createSpellingSectionSvg(): string {
  const content = `
    <text x="190" y="24" text-anchor="middle" class="label">มาตราตัวสะกดในภาษาไทย (๘ มาตรา + แม่ ก กา)</text>
    
    <!-- ตรงตามมาตรา -->
    <rect x="20" y="45" width="165" height="115" rx="6" fill="#fdf4ff" stroke="#c084fc" stroke-width="1.5" />
    <text x="102" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#7e22ce">สะกดตรงมาตรา (ตัวเดียว)</text>
    <text x="40" y="92" font-size="11" fill="#334155">• แม่กง (ง)</text>
    <text x="40" y="112" font-size="11" fill="#334155">• แม่กม (ม)</text>
    <text x="40" y="132" font-size="11" fill="#334155">• แม่เกย (ย)</text>
    <text x="115" y="92" font-size="11" fill="#334155">• แม่เกอว (ว)</text>
    <text x="115" y="112" font-size="11" fill="#64748b">• ก กา (ไม่มีตัวสะกด)</text>

    <!-- ไม่ตรงตามมาตรา -->
    <rect x="195" y="45" width="165" height="115" rx="6" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" />
    <text x="277" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#b45309">ไม่ตรงตามมาตรา (หลายตัว)</text>
    <text x="210" y="92" font-size="11" fill="#334155">• แม่กน (น, ณ, ญ, ร, ล, ฬ)</text>
    <text x="210" y="112" font-size="11" fill="#334155">• แม่กก (ก, ข, ค, ฆ)</text>
    <text x="210" y="132" font-size="11" fill="#334155">• แม่กด (ด, จ, ช, ซ, ฎ, ฏ, ฐ, ฑ, ฒ, ต, ถ, ท, ธ, ศ, ษ, ส)</text>
    <text x="210" y="150" font-size="11" fill="#334155">• แม่กบ (บ, ป, พ, ฟ, ภ)</text>
  `;
  return svgWrap(content, 380, 180);
}

/**
 * 17. แผนภาพเวนน์-ออยเลอร์ 3 เซต (A, B, C ในเอกภพสัมพัทธ์ U) เหมือนข้อสอบคณิตศาสตร์ ม.4
 */
export function createVennDiagramSvg(): string {
  const content = `
    <!-- กรอบเอกภพสัมพัทธ์ U -->
    <rect x="25" y="12" width="310" height="170" fill="#ffffff" stroke="#1e293b" stroke-width="1.8" />
    <text x="342" y="180" font-size="14" font-weight="bold" font-style="italic" fill="#0f172a">U</text>

    <!-- วงกลม A, B, C -->
    <circle cx="145" cy="75" r="48" fill="none" stroke="#1e293b" stroke-width="1.6" />
    <circle cx="205" cy="75" r="48" fill="none" stroke="#1e293b" stroke-width="1.6" />
    <circle cx="175" cy="122" r="48" fill="none" stroke="#1e293b" stroke-width="1.6" />

    <!-- ชื่อเซต -->
    <text x="95" y="34" font-size="13" font-weight="bold" fill="#0f172a">A</text>
    <text x="248" y="34" font-size="13" font-weight="bold" fill="#0f172a">B</text>
    <text x="228" y="166" font-size="13" font-weight="bold" fill="#0f172a">C</text>

    <!-- สมาชิกในแต่ละบริเวณ -->
    <text x="115" y="65" text-anchor="middle" font-size="11" fill="#1e293b">1</text>
    <text x="135" y="52" text-anchor="middle" font-size="11" fill="#1e293b">2</text>
    <text x="118" y="88" text-anchor="middle" font-size="11" fill="#1e293b">11</text>
    <text x="142" y="76" text-anchor="middle" font-size="11" fill="#1e293b">16</text>

    <!-- A ∩ B -->
    <text x="175" y="58" text-anchor="middle" font-size="11" fill="#1e293b">3</text>

    <!-- เฉพาะ B -->
    <text x="212" y="52" text-anchor="middle" font-size="11" fill="#1e293b">4</text>
    <text x="232" y="64" text-anchor="middle" font-size="11" fill="#1e293b">5</text>
    <text x="208" y="78" text-anchor="middle" font-size="11" fill="#1e293b">14</text>
    <text x="234" y="92" text-anchor="middle" font-size="11" fill="#1e293b">17</text>

    <!-- A ∩ B ∩ C -->
    <text x="175" y="92" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">6</text>

    <!-- A ∩ C -->
    <text x="150" y="104" text-anchor="middle" font-size="11" fill="#1e293b">7</text>
    <text x="158" y="116" text-anchor="middle" font-size="11" fill="#1e293b">12, 19</text>

    <!-- B ∩ C -->
    <text x="198" y="108" text-anchor="middle" font-size="11" fill="#1e293b">9</text>

    <!-- เฉพาะ C -->
    <text x="160" y="146" text-anchor="middle" font-size="11" fill="#1e293b">8</text>
    <text x="195" y="146" text-anchor="middle" font-size="11" fill="#1e293b">10</text>

    <!-- นอกเซต A, B, C -->
    <text x="52" y="165" text-anchor="middle" font-size="11" fill="#1e293b">20</text>
    <text x="262" y="52" text-anchor="middle" font-size="11" fill="#1e293b">13</text>
    <text x="282" y="76" text-anchor="middle" font-size="11" fill="#1e293b">18</text>
    <text x="292" y="165" text-anchor="middle" font-size="11" fill="#1e293b">15</text>
  `;
  return svgWrap(content, 360, 192);
}

/**
 * 18. กราฟระบบสมการเชิงเส้นสองตัวแปรบนระนาบพิกัดฉาก (X-Y Grid) เหมือนข้อสอบคณิตศาสตร์ ม.3
 */
export function createLinearSystemGraphSvg(variant: number = 0): string {
  // Grid origin at (160, 110), 1 unit = 20px, range X: -4..4, Y: -3..4
  const ox = 160;
  const oy = 110;
  const step = 20;
  let grid = '';
  for (let gx = -5; gx <= 5; gx++) {
    const x = ox + gx * step;
    grid += `<line x1="${x}" y1="15" x2="${x}" y2="185" stroke="#cbd5e1" stroke-width="0.7" />`;
    if (gx !== 0 && gx >= -3 && gx <= 3) {
      grid += `<line x1="${x}" y1="${oy - 3}" x2="${x}" y2="${oy + 3}" stroke="#0f172a" stroke-width="1.2" />`;
      grid += `<text x="${x}" y="${oy + 14}" text-anchor="middle" font-size="10" fill="#0f172a">${gx}</text>`;
    }
  }
  for (let gy = -3; gy <= 4; gy++) {
    const y = oy - gy * step;
    grid += `<line x1="50" y1="${y}" x2="270" y2="${y}" stroke="#cbd5e1" stroke-width="0.7" />`;
    if (gy !== 0 && gy >= -3 && gy <= 4) {
      grid += `<line x1="${ox - 3}" y1="${y}" x2="${ox + 3}" y2="${y}" stroke="#0f172a" stroke-width="1.2" />`;
      grid += `<text x="${ox - 10}" y="${y + 4}" text-anchor="end" font-size="10" fill="#0f172a">${gy}</text>`;
    }
  }

  const pt = (x: number, y: number) => `${ox + x * step},${oy - y * step}`;
  let lines = '';
  if (variant % 3 === 0) {
    // ตัดกันที่จุด (-1, 2)
    // เส้นที่ 1: y = x + 3 -> (-4,-1) ถึง (1,4)
    // เส้นที่ 2: y = -0.5x + 1.5 -> (-3,3) ถึง (3,0)
    lines = `
      <line x1="${ox - 4 * step}" y1="${oy - (-1) * step}" x2="${ox + 1.5 * step}" y2="${oy - 4.5 * step}" stroke="#0f172a" stroke-width="2" />
      <line x1="${ox - 4 * step}" y1="${oy - 3.5 * step}" x2="${ox + 4 * step}" y2="${oy - (-0.5) * step}" stroke="#dc2626" stroke-width="2" />
      <circle cx="${ox - 1 * step}" cy="${oy - 2 * step}" r="3.5" fill="#1e293b" />
    `;
  } else if (variant % 3 === 1) {
    // ขนานกัน (ไม่มีคำตอบ): y = x + 1 และ y = x - 1.5
    lines = `
      <line x1="${ox - 3.5 * step}" y1="${oy - (-2.5) * step}" x2="${ox + 3 * step}" y2="${oy - 4 * step}" stroke="#0f172a" stroke-width="2" />
      <line x1="${ox - 1.5 * step}" y1="${oy - (-3) * step}" x2="${ox + 4 * step}" y2="${oy - 2.5 * step}" stroke="#dc2626" stroke-width="2" />
    `;
  } else {
    // ตัดกันที่จุด (2, -2)
    // เส้นที่ 1: y = -0.5x - 1 -> (-4,1) ถึง (4,-3)
    // เส้นที่ 2: y = x - 4 -> (-1,-5 -> clamp) (1,-3) ถึง (4,0)
    lines = `
      <line x1="${ox - 4 * step}" y1="${oy - 1 * step}" x2="${ox + 4 * step}" y2="${oy - (-3) * step}" stroke="#0f172a" stroke-width="2" />
      <line x1="${ox + 1 * step}" y1="${oy - (-3) * step}" x2="${ox + 4.5 * step}" y2="${oy - 0.5 * step}" stroke="#dc2626" stroke-width="2" />
      <circle cx="${ox + 2 * step}" cy="${oy - (-2) * step}" r="3.5" fill="#1e293b" />
    `;
  }

  const content = `
    ${grid}
    <!-- แกน X และ Y -->
    <line x1="45" y1="${oy}" x2="278" y2="${oy}" stroke="#1d4ed8" stroke-width="1.6" />
    <polygon points="282,${oy} 274,${oy - 4} 274,${oy + 4}" fill="#1d4ed8" />
    <text x="288" y="${oy + 4}" font-size="12" font-weight="bold" fill="#0f172a">X</text>

    <line x1="${ox}" y1="188" x2="${ox}" y2="12" stroke="#1d4ed8" stroke-width="1.6" />
    <polygon points="${ox},8 ${ox - 4},16 ${ox + 4},16" fill="#1d4ed8" />
    <text x="${ox}" y="6" text-anchor="middle" font-size="11" font-weight="bold" fill="#0f172a">Y</text>
    <text x="${ox - 8}" y="${oy + 13}" font-size="10" fill="#0f172a">0</text>
    ${lines}
  `;
  return svgWrap(content, 320, 198);
}

/**
 * 19. แผนภาพโครงสร้างเซลล์พร้อมเส้นชี้หมายเลข 1 - 5 เหมือนข้อสอบชีววิทยา
 */
export function createCellDiagramSvg(): string {
  const content = `
    <!-- ผนังเซลล์และเยื่อหุ้มเซลล์ -->
    <rect x="75" y="18" width="145" height="162" rx="34" fill="#f8fafc" stroke="#0f172a" stroke-width="2.5" />
    <rect x="83" y="26" width="129" height="146" rx="28" fill="#ffffff" stroke="#334155" stroke-width="1.3" stroke-dasharray="4,2" />

    <!-- แวคิวโอลขนาดใหญ่ (หมายเลข 3) -->
    <path d="M 118 48 C 165 44, 185 68, 178 112 C 172 138, 132 135, 120 108 C 110 85, 105 52, 118 48 Z" fill="#f1f5f9" stroke="#1e293b" stroke-width="1.6" />

    <!-- นิวเคลียส (หมายเลข 2) -->
    <circle cx="110" cy="48" r="15" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.8" />
    <circle cx="110" cy="48" r="5" fill="#475569" />

    <!-- คลอโรพลาสต์ (หมายเลข 1, 4) -->
    <ellipse cx="98" cy="118" rx="9" ry="15" fill="#dcfce7" stroke="#0f172a" stroke-width="1.5" />
    <line x1="93" y1="113" x2="103" y2="113" stroke="#0f172a" stroke-width="1" />
    <line x1="93" y1="118" x2="103" y2="118" stroke="#0f172a" stroke-width="1" />
    <line x1="93" y1="123" x2="103" y2="123" stroke="#0f172a" stroke-width="1" />

    <ellipse cx="192" cy="135" rx="8" ry="14" fill="#dcfce7" stroke="#0f172a" stroke-width="1.5" />
    <line x1="187" y1="131" x2="197" y2="131" stroke="#0f172a" stroke-width="1" />
    <line x1="187" y1="136" x2="197" y2="136" stroke="#0f172a" stroke-width="1" />

    <!-- ไมโทคอนเดรีย (หมายเลข 5) -->
    <ellipse cx="145" cy="155" rx="16" ry="9" fill="#fef3c7" stroke="#0f172a" stroke-width="1.5" />
    <path d="M 133 155 Q 138 150, 141 155 T 149 155 T 157 155" fill="none" stroke="#0f172a" stroke-width="1.2" />

    <!-- เส้นชี้หมายเลข 1 - 5 -->
    <!-- 1: คลอโรพลาสต์/ผนังเซลล์ซ้าย -->
    <line x1="75" y1="158" x2="45" y2="158" stroke="#0f172a" stroke-width="1.2" />
    <text x="36" y="162" text-anchor="end" font-size="13" font-weight="bold" fill="#0f172a">1</text>

    <!-- 2: นิวเคลียส -->
    <line x1="125" y1="44" x2="255" y2="44" stroke="#0f172a" stroke-width="1.2" />
    <text x="263" y="48" font-size="13" font-weight="bold" fill="#0f172a">2</text>

    <!-- 3: แวคิวโอล -->
    <line x1="162" y1="82" x2="255" y2="82" stroke="#0f172a" stroke-width="1.2" />
    <text x="263" y="86" font-size="13" font-weight="bold" fill="#0f172a">3</text>

    <!-- 4: คลอโรพลาสต์ -->
    <line x1="198" y1="135" x2="255" y2="135" stroke="#0f172a" stroke-width="1.2" />
    <text x="263" y="139" font-size="13" font-weight="bold" fill="#0f172a">4</text>

    <!-- 5: ไมโทคอนเดรีย -->
    <line x1="161" y1="155" x2="255" y2="155" stroke="#0f172a" stroke-width="1.2" />
    <text x="263" y="159" font-size="13" font-weight="bold" fill="#0f172a">5</text>
  `;
  return svgWrap(content, 310, 195);
}

/**
 * 20. สัญลักษณ์ความปลอดภัยในห้องปฏิบัติการเคมี (NFPA 704 Diamond & GHS) เหมือนข้อสอบเคมี
 */
export function createChemistrySafetySvg(variant: number = 0): string {
  if (variant % 2 === 1) {
    // อุปกรณ์วัดปริมาตรในห้องปฏิบัติการเคมี (บีกเกอร์, บิวเรตต์, ปิเปตต์, ขวดวัดปริมาตร)
    const content = `
      <text x="180" y="20" text-anchor="middle" class="label">อุปกรณ์วัดปริมาตรของเหลวในปฏิบัติการเคมี</text>
      <!-- 1. บีกเกอร์ -->
      <rect x="30" y="65" width="50" height="65" rx="2" fill="#f0f9ff" stroke="#0f172a" stroke-width="1.8" />
      <line x1="26" y1="65" x2="82" y2="65" stroke="#0f172a" stroke-width="2" />
      <line x1="65" y1="80" x2="80" y2="80" stroke="#0f172a" stroke-width="1" />
      <line x1="65" y1="95" x2="80" y2="95" stroke="#0f172a" stroke-width="1" />
      <line x1="65" y1="110" x2="80" y2="110" stroke="#0f172a" stroke-width="1" />
      <text x="55" y="150" text-anchor="middle" font-size="11" font-weight="bold">บีกเกอร์</text>

      <!-- 2. บิวเรตต์ (ขีด 0 อยู่ด้านบน) -->
      <rect x="125" y="32" width="12" height="82" fill="#f0f9ff" stroke="#0f172a" stroke-width="1.6" />
      <polygon points="125,114 137,114 131,130" fill="#f0f9ff" stroke="#0f172a" stroke-width="1.5" />
      <line x1="120" y1="120" x2="142" y2="120" stroke="#dc2626" stroke-width="2.5" />
      <text x="148" y="42" font-size="9" fill="#0f172a">0 mL</text>
      <text x="148" y="108" font-size="9" fill="#0f172a">50 mL</text>
      <text x="131" y="150" text-anchor="middle" font-size="11" font-weight="bold">บิวเรตต์</text>

      <!-- 3. ปิเปตต์ -->
      <line x1="215" y1="32" x2="215" y2="65" stroke="#0f172a" stroke-width="3" />
      <ellipse cx="215" cy="80" rx="9" ry="18" fill="#f0f9ff" stroke="#0f172a" stroke-width="1.6" />
      <line x1="215" y1="98" x2="215" y2="130" stroke="#0f172a" stroke-width="3" />
      <text x="215" y="150" text-anchor="middle" font-size="11" font-weight="bold">ปิเปตต์</text>

      <!-- 4. ขวดวัดปริมาตร -->
      <line x1="295" y1="40" x2="295" y2="82" stroke="#0f172a" stroke-width="5" />
      <line x1="288" y1="60" x2="302" y2="60" stroke="#dc2626" stroke-width="1.5" />
      <path d="M 280 130 Q 270 95, 295 82 Q 320 95, 310 130 Z" fill="#f0f9ff" stroke="#0f172a" stroke-width="1.8" />
      <text x="295" y="150" text-anchor="middle" font-size="11" font-weight="bold">ขวดวัดปริมาตร</text>
    `;
    return svgWrap(content, 360, 170);
  }

  // NFPA 704 Diamond (สีแดง 3, สีน้ำเงิน 0, สีเหลือง 0, สีขาว)
  const content = `
    <!-- ช่องบน (สีแดง - ความไวไฟ) -->
    <polygon points="160,18 205,63 160,108 115,63" fill="#fca5a5" stroke="#0f172a" stroke-width="1.8" />
    <text x="160" y="62" text-anchor="middle" font-size="22" font-weight="bold" fill="#0f172a">3</text>
    <text x="160" y="78" text-anchor="middle" font-size="10" fill="#0f172a">สีแดง (ไวไฟ)</text>

    <!-- ช่องซ้าย (สีน้ำเงิน - สุขภาพ) -->
    <polygon points="115,63 160,108 115,153 70,108" fill="#93c5fd" stroke="#0f172a" stroke-width="1.8" />
    <text x="115" y="107" text-anchor="middle" font-size="22" font-weight="bold" fill="#0f172a">0</text>
    <text x="115" y="123" text-anchor="middle" font-size="10" fill="#0f172a">สีน้ำเงิน</text>

    <!-- ช่องขวา (สีเหลือง - ความว่องไว) -->
    <polygon points="205,63 250,108 205,153 160,108" fill="#fde047" stroke="#0f172a" stroke-width="1.8" />
    <text x="205" y="107" text-anchor="middle" font-size="22" font-weight="bold" fill="#0f172a">0</text>
    <text x="205" y="123" text-anchor="middle" font-size="10" fill="#0f172a">สีเหลือง</text>

    <!-- ช่องล่าง (สีขาว - อันตรายพิเศษ) -->
    <polygon points="160,108 205,153 160,198 115,153" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" />
    <text x="160" y="160" text-anchor="middle" font-size="11" fill="#0f172a">สีขาว</text>
  `;
  return svgWrap(content, 320, 210);
}


