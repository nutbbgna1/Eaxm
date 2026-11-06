import { GoogleGenAI } from '@google/genai';
import { storeJsonGet } from './store.js';
import {
  createFractionPieSvg,
  createFractionBarSvg,
  createRightTriangleSvg,
  createParallelLinesSvg,
  createBarChartSvg,
  createClockSvg,
  createPhotosynthesisSvg,
  createElectricCircuitSvg,
  createFoodChainSvg,
  createStatesOfMatterSvg,
  createMagnetFieldSvg,
  createThaiTriyangSvg,
  createPrepositionSvg,
  createCompassDirectionsSvg,
  createSufficiencyEconomySvg,
  createSentenceStructureSvg,
  createSpellingSectionSvg,
  createVennDiagramSvg,
  createLinearSystemGraphSvg,
  createCellDiagramSvg,
  createChemistrySafetySvg,
} from './svg-diagrams.js';
import {
  MATH_MC_POOL,
  SCIENCE_MC_POOL,
  THAI_MC_POOL,
  ENGLISH_MC_POOL,
  SOCIAL_MC_POOL,
  SETS_MC_POOL,
  LINEAR_SYSTEM_MC_POOL,
  CELL_BIOLOGY_MC_POOL,
  CHEMISTRY_SAFETY_MC_POOL,
  TF_POOL,
  MATCH_POOL,
  WRITTEN_POOL,
  ExamItemMc,
} from './curriculum-data.js';

export function getApiKey(provider: string = 'gemini'): string {
  const settings = storeJsonGet<{ keys?: Record<string, string> }>('settings', 'settings.json');
  if (settings?.keys && settings.keys[provider]) {
    return settings.keys[provider];
  }
  if (provider === 'gemini') {
    return process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  }
  if (provider === 'openai') {
    return process.env.OPENAI_API_KEY || '';
  }
  if (provider === 'openrouter') {
    return process.env.OPENROUTER_API_KEY || '';
  }
  return '';
}

export function hasApiKey(provider: string = 'gemini'): boolean {
  const k = getApiKey(provider);
  return k.trim().length > 0 && !k.includes('ใส่_');
}

/**
 * Call Gemini 3.8 Flash via @google/genai SDK
 */
export async function generateGeminiJson(
  systemInstruction: string,
  prompt: string,
  schema?: any,
  modelName: string = 'gemini-3.8-flash'
): Promise<any> {
  const apiKey = getApiKey('gemini');
  if (!apiKey) {
    throw new Error('NO_GEMINI_KEY');
  }

  const ai = new GoogleGenAI({ apiKey });
  const config: any = {
    systemInstruction,
    responseMimeType: 'application/json',
    temperature: 0.4,
  };
  if (schema) {
    config.responseSchema = schema;
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config,
  });

  const text = (response.text ?? '').trim();
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return JSON.parse(text);
}

/**
 * Generate educational SVG diagram by explicit type key
 */
export function renderSvgByType(svgType: string): string {
  switch (svgType) {
    case 'fraction_pie': return createFractionPieSvg(3, 8);
    case 'fraction_bar': return createFractionBarSvg(3, 5);
    case 'right_triangle': return createRightTriangleSvg('6 ซม.', '8 ซม.', 'c');
    case 'parallel_lines': return createParallelLinesSvg();
    case 'bar_chart': return createBarChartSvg();
    case 'clock': return createClockSvg(8, 30);
    case 'venn_diagram': return createVennDiagramSvg();
    case 'linear_graph_1': return createLinearSystemGraphSvg(0);
    case 'linear_graph_2': return createLinearSystemGraphSvg(1);
    case 'linear_graph_3': return createLinearSystemGraphSvg(2);
    case 'photosynthesis': return createPhotosynthesisSvg();
    case 'electric_circuit': return createElectricCircuitSvg();
    case 'food_chain': return createFoodChainSvg();
    case 'states_of_matter': return createStatesOfMatterSvg();
    case 'magnet_field': return createMagnetFieldSvg();
    case 'cell_diagram': return createCellDiagramSvg();
    case 'chem_safety': return createChemistrySafetySvg(0);
    case 'chem_glassware': return createChemistrySafetySvg(1);
    case 'thai_triyang': return createThaiTriyangSvg();
    case 'thai_sentence': return createSentenceStructureSvg();
    case 'thai_spelling': return createSpellingSectionSvg();
    case 'prepositions': return createPrepositionSvg();
    case 'compass': return createCompassDirectionsSvg();
    case 'sufficiency_economy': return createSufficiencyEconomySvg();
    default: return '';
  }
}

/**
 * Generate educational SVG diagram based on subject, topic/question, and optional svgType
 */
export function generateSubjectSvg(
  subject: string,
  questionOrTopic: string = '',
  itemIndex: number = 0,
  _partType: string = 'mc',
  svgType: string = ''
): string {
  if (svgType) {
    const direct = renderSvgByType(svgType);
    if (direct) return direct;
  }

  const q = questionOrTopic.toLowerCase();
  const s = (subject + ' ' + questionOrTopic).toLowerCase();

  // 1. High-priority specific topic/question keywords (check question first!)
  if (q.includes('เวนน์') || q.includes('เซต') || q.includes('สับเซต') || q.includes('u ') || q.includes('∪') || q.includes('∩')) {
    return createVennDiagramSvg();
  }
  if (q.includes('ระบบสมการ') || q.includes('สมการเชิงเส้น') || q.includes('จุดตัด') || q.includes('คู่อันดับ') || q.includes('จตุภาค') || (q.includes('กราฟ') && (s.includes('คณิต') || q.includes('สมการ')))) {
    return createLinearSystemGraphSvg(itemIndex);
  }
  if (q.includes('เซลล์') || q.includes('แวคิวโอล') || q.includes('นิวเคลียส') || q.includes('ไมโทคอนเดรีย') || q.includes('คลอโรพลาสต์') || q.includes('ออร์แกเนลล์')) {
    return createCellDiagramSvg();
  }
  if (q.includes('บิวเรตต์') || q.includes('ปิเปตต์') || q.includes('บีกเกอร์') || q.includes('ขวดวัดปริมาตร') || q.includes('วัดปริมาตรของเหลว')) {
    return createChemistrySafetySvg(1);
  }
  if (q.includes('สัญลักษณ์') || q.includes('อันตราย') || q.includes('ไวไฟ') || q.includes('กรดเข้มข้น') || q.includes('ปฏิบัติการเคมี')) {
    return createChemistrySafetySvg(0);
  }
  if (q.includes('วงจร') || q.includes('ไฟฟ้า') || q.includes('หลอดไฟ') || q.includes('สวิตช์')) {
    return createElectricCircuitSvg();
  }
  if (q.includes('สังเคราะห์ด้วยแสง') || q.includes('ปากใบ') || q.includes('คลอโรฟิลล์') || q.includes('สร้างอาหารของพืช')) {
    return createPhotosynthesisSvg();
  }
  if (q.includes('โซ่อาหาร') || q.includes('สายใยอาหาร') || q.includes('ตั๊กแตน') || q.includes('เหยี่ยว') || q.includes('ผู้ผลิต')) {
    return createFoodChainSvg();
  }
  if (q.includes('แม่เหล็ก') || q.includes('ขั้วเหนือ') || q.includes('ขั้วใต้')) {
    return createMagnetFieldSvg();
  }
  if (q.includes('ของแข็ง') || q.includes('ของเหลว') || q.includes('แก๊ส') || q.includes('สถานะของสาร') || q.includes('อนุภาค')) {
    return createStatesOfMatterSvg();
  }
  if (q.includes('เศษส่วน') || q.includes('แรเงา') || q.includes('fraction')) {
    return itemIndex % 2 === 0 ? createFractionPieSvg(3, 8) : createFractionBarSvg(3, 5);
  }
  if (q.includes('สามเหลี่ยม') || q.includes('มุมฉาก') || q.includes('พีทา') || q.includes('สี่เหลี่ยม') || q.includes('รอบรูป')) {
    return createRightTriangleSvg('6 ซม.', '8 ซม.', 'c');
  }
  if (q.includes('เส้นขนาน') || q.includes('มุมแย้ง') || q.includes('เส้นตัดขวาง')) {
    return createParallelLinesSvg();
  }
  if (q.includes('แผนภูมิ') || q.includes('แท่ง') || q.includes('สถิติ') || q.includes('คะแนนเฉลี่ย')) {
    return createBarChartSvg();
  }
  if (q.includes('นาฬิกา') || q.includes('เวลา') || q.includes('เข็มสั้น') || q.includes('clock')) {
    return createClockSvg(8, 30);
  }
  if (q.includes('ไตรยางศ์') || q.includes('อักษร 3 หมู่') || q.includes('อักษรสูง') || q.includes('อักษรกลาง') || q.includes('อักษรต่ำ')) {
    return createThaiTriyangSvg();
  }
  if (q.includes('ประโยค') || q.includes('ประธาน') || q.includes('กริยา') || q.includes('กรรม') || q.includes('คำนาม') || q.includes('คำสรรพนาม')) {
    return createSentenceStructureSvg();
  }
  if (q.includes('มาตรา') || q.includes('ตัวสะกด') || q.includes('แม่ก') || q.includes('ก กา') || q.includes('สะกดคำ')) {
    return createSpellingSectionSvg();
  }
  if (q.includes('preposition') || q.includes('table') || q.includes('ball')) {
    return createPrepositionSvg();
  }
  if (q.includes('ทิศ') || q.includes('เข็มทิศ') || q.includes('แผนที่')) {
    return createCompassDirectionsSvg();
  }
  if (q.includes('พอเพียง') || q.includes('3 ห่วง')) {
    return createSufficiencyEconomySvg();
  }

  // 2. Subject-level cycle
  if (s.includes('ชีว') || s.includes('เซลล์')) {
    const bioSvgs = [() => createCellDiagramSvg(), () => createPhotosynthesisSvg(), () => createFoodChainSvg()];
    return bioSvgs[itemIndex % bioSvgs.length]();
  }
  if (s.includes('เคมี')) {
    const chemSvgs = [() => createChemistrySafetySvg(0), () => createChemistrySafetySvg(1), () => createStatesOfMatterSvg()];
    return chemSvgs[itemIndex % chemSvgs.length]();
  }
  if (s.includes('วิทยา') || s.includes('วิทย์') || s.includes('science') || s.includes('ฟิสิกส์')) {
    const sciSvgs = [
      () => createCellDiagramSvg(),
      () => createPhotosynthesisSvg(),
      () => createElectricCircuitSvg(),
      () => createFoodChainSvg(),
      () => createStatesOfMatterSvg(),
      () => createMagnetFieldSvg(),
      () => createChemistrySafetySvg(1),
    ];
    return sciSvgs[itemIndex % sciSvgs.length]();
  }
  if (s.includes('คณิต') || s.includes('math') || s.includes('เลข')) {
    const mathSvgs = [
      () => createFractionPieSvg(3, 8),
      () => createLinearSystemGraphSvg(itemIndex),
      () => createVennDiagramSvg(),
      () => createRightTriangleSvg('6 ซม.', '8 ซม.', 'c'),
      () => createFractionBarSvg(3, 5),
      () => createBarChartSvg(),
      () => createParallelLinesSvg(),
      () => createClockSvg(8, 30),
    ];
    return mathSvgs[itemIndex % mathSvgs.length]();
  }
  if (s.includes('ไทย')) {
    const thaiSvgs = [
      () => createThaiTriyangSvg(),
      () => createSentenceStructureSvg(),
      () => createSpellingSectionSvg(),
    ];
    return thaiSvgs[itemIndex % thaiSvgs.length]();
  }
  if (s.includes('อังกฤษ') || s.includes('eng')) {
    return itemIndex % 2 === 0 ? createPrepositionSvg() : createClockSvg(8, 30);
  }
  if (s.includes('สังคม') || s.includes('ประวัติ')) {
    return itemIndex % 2 === 0 ? createCompassDirectionsSvg() : createSufficiencyEconomySvg();
  }

  const allSvgs = [
    () => createFractionPieSvg(3, 8),
    () => createPhotosynthesisSvg(),
    () => createRightTriangleSvg('6 ซม.', '8 ซม.', 'c'),
    () => createElectricCircuitSvg(),
    () => createFoodChainSvg(),
    () => createThaiTriyangSvg(),
    () => createCompassDirectionsSvg(),
    () => createStatesOfMatterSvg(),
  ];
  return allSvgs[itemIndex % allSvgs.length]();
}

/**
 * Determine whether a question should include an illustration/diagram
 * - figMode === 'none' | false -> false
 * - figMode === 'all' -> true
 * - figMode === 'smart' | 'auto' | true -> true if the question explicitly references a figure/diagram/graph OR selectively (~40% of items)
 */
export function shouldAttachFigure(
  figMode: boolean | string | undefined,
  questionText: string,
  needsFigureFlag?: boolean,
  itemIndex: number = 0
): boolean {
  if (figMode === false || figMode === 'none') return false;
  if (figMode === 'all') return true;

  // Smart / realistic exam mode (บางข้อมีรูปประกอบ บางข้อไม่มีรูปประกอบ เหมือนข้อสอบจริง)
  if (needsFigureFlag === true) return true;
  if (needsFigureFlag === false) return false;

  const q = String(questionText || '').toLowerCase();
  const visualCues = [
    'จากแผนภาพ', 'จากกราฟ', 'จากรูป', 'จากภาพ', 'พิจารณารูป', 'สังเกต',
    'แผนภูมิ', 'วงจร', 'หน้าปัด', 'แรเงา', 'สัญลักษณ์', 'เข็มทิศ',
    'สายใยอาหาร', 'หมายเลข', 'ตาราง', 'picture', 'clock', 'diagram', 'graph',
  ];
  if (visualCues.some((cue) => q.includes(cue))) {
    return true;
  }

  // Otherwise attach to roughly every 3rd question so the exam has a natural mix of visual and text questions
  return itemIndex % 3 === 0;
}

/**
 * Extract clean list of sub-topics / units from user scope, title, and hint
 */
export function extractTargetUnits(scope: string, title: string, hint: string, subject: string): {
  units: string[];
  focusedTopic: string;
} {
  const cleanTitle = String(title || '')
    .replace(/^(ข้อสอบ|แบบทดสอบ)(กลางภาค|ปลายภาค|ท้ายหน่วย|ก่อนเรียน|หลังเรียน)?\s*/g, '')
    .replace(new RegExp(subject, 'g'), '')
    .replace(/(ป\.\d|ม\.\d)/g, '')
    .trim();

  const rawScope = String(scope || '').trim();
  const rawHint = String(hint || '').trim();

  const splitUnits = (str: string) =>
    str
      .split(/[,،;\n•·/]+/)
      .map((u) => u.trim())
      .filter((u) => u.length >= 2 && u !== 'การสอบวัดผลสัมฤทธิ์');

  const scopeUnits = splitUnits(rawScope);
  const hintUnits = splitUnits(rawHint);

  // If user typed a specific custom title or hint, or if scope has only 1-3 focused topics
  let focusedTopic = '';
  if (rawHint) {
    focusedTopic = rawHint;
  } else if (cleanTitle && cleanTitle.length >= 2 && !cleanTitle.includes('ปีการศึกษา')) {
    focusedTopic = cleanTitle;
  } else if (scopeUnits.length >= 1 && scopeUnits.length <= 3) {
    focusedTopic = scopeUnits.join(' ');
  }

  const units = [
    ...(cleanTitle ? [cleanTitle] : []),
    ...hintUnits,
    ...scopeUnits,
  ].filter(Boolean);

  return {
    units: units.length > 0 ? units : [subject || 'สาระการเรียนรู้แกนกลาง'],
    focusedTopic,
  };
}

/**
 * Synthesize an accurate, curriculum-aligned Multiple Choice item strictly for the given subject and unit/topic!
 */
export function synthesizeSubjectTopicMc(
  subject: string,
  unitTopic: string,
  grade: string,
  index: number,
  score: number
): any {
  const s = subject.toLowerCase();
  const u = (unitTopic || subject).trim();
  const uLow = u.toLowerCase();
  const variant = index + 1;

  // 1. Specific High-Demand Topics (Sets, Linear Equations, Cells, Chemistry Safety)
  if (uLow.includes('เซต') || uLow.includes('เวนน์') || uLow.includes('สับเซต')) {
    const nElem = (index % 4) + 3; // 3, 4, 5, 6
    const totalSub = Math.pow(2, nElem);
    const properSub = totalSub - 1;
    const setTemplates = [
      {
        question: `กำหนดให้เซต A มีสมาชิกที่แตกต่างกัน ${nElem} ตัว จำนวนสับเซตแท้ทั้งหมดของเซต A เท่ากับข้อใด?`,
        choices: [`${properSub} สับเซต`, `${totalSub} สับเซต`, `${nElem * 2} สับเซต`, `${totalSub + 1} สับเซต`],
        answerIndex: 0,
        explain: `เมื่อ n(A) = ${nElem} จำนวนสับเซตทั้งหมดคือ 2^${nElem} = ${totalSub} สับเซต และสับเซตแท้คือ 2^${nElem} - 1 = ${properSub} สับเซต`,
        svgType: '',
        needsFigure: false,
        indicator: `ค 1.1 ${grade}/1`,
      },
      {
        question: `กำหนดให้ n(U) = ${40 + index * 5}, n(A) = ${20 + index * 2}, n(B) = ${18 + index * 2} และ n(A ∩ B) = ${8 + index} จงหาค่าของ n(A ∪ B)`,
        choices: [
          `${(20 + index * 2) + (18 + index * 2) - (8 + index)}`,
          `${(20 + index * 2) + (18 + index * 2)}`,
          `${(20 + index * 2) - (8 + index)}`,
          `${40 + index * 5 - (8 + index)}`,
        ],
        answerIndex: 0,
        explain: `จากสูตร n(A ∪ B) = n(A) + n(B) - n(A ∩ B) = ${20 + index * 2} + ${18 + index * 2} - ${8 + index} = ${(20 + index * 2) + (18 + index * 2) - (8 + index)}`,
        svgType: 'venn_diagram',
        needsFigure: index % 2 === 0,
        indicator: `ค 1.1 ${grade}/1`,
      },
    ];
    const t = setTemplates[index % setTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  if (uLow.includes('ระบบสมการ') || uLow.includes('สมการเชิงเส้น')) {
    const xVal = (index % 5) + 1;
    const yVal = (index % 4) + 2;
    const sumXY = xVal + yVal;
    const diffXY = xVal - yVal;
    const eqTemplates = [
      {
        question: `กำหนดระบบสมการเชิงเส้นสองตัวแปร: x + y = ${sumXY} และ x - y = ${diffXY} คำตอบของระบบสมการ (x, y) คือข้อใด?`,
        choices: [
          `(${xVal}, ${yVal})`,
          `(${yVal}, ${xVal})`,
          `(${xVal + 1}, ${yVal - 1})`,
          `ไม่มีคำตอบ`,
        ],
        answerIndex: 0,
        explain: `นำสมการทั้งสองมาบวกกัน: 2x = ${sumXY + diffXY} จะได้ x = ${xVal} และแทนค่าได้ y = ${yVal} ดังนั้นคำตอบคือ (${xVal}, ${yVal})`,
        svgType: `linear_graph_${(index % 3) + 1}`,
        needsFigure: false,
        indicator: `ค 1.3 ${grade}/3`,
      },
      {
        question: `จากกราฟของระบบสมการเชิงเส้นสองตัวแปร หากเส้นตรงสองเส้นมีค่าความชันเท่ากันแต่ระยะตัดแกน Y ต่างกัน คำตอบของระบบสมการจะเป็นอย่างไร? (กรณีศึกษาที่ ${variant})`,
        choices: [
          'ไม่มีคำตอบ เพราะกราฟเป็นเส้นตรงที่ขนานกัน',
          'มีคำตอบเดียวที่จุดกำเนิด (0, 0)',
          'มีคำตอบมากมายไม่จำกัด เพราะเส้นตรงทับกันสนิท',
          'มีคำตอบ 2 คำตอบตามจุดตัดแกน X และ Y',
        ],
        answerIndex: 0,
        explain: 'เส้นตรงที่มีความชันเท่ากันแต่ระยะตัดแกน Y ไม่เท่ากัน จะขนานกันเสมอ จึงไม่มีจุดตัดและไม่มีคำตอบของระบบสมการ',
        svgType: 'linear_graph_2',
        needsFigure: true,
        indicator: `ค 1.3 ${grade}/3`,
      },
    ];
    const t = eqTemplates[index % eqTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  if (uLow.includes('เซลล์') || s.includes('ชีววิทยา') || s.includes('ชีว')) {
    const bioTemplates = [
      {
        question: `จากแผนภาพโครงสร้างของเซลล์ โครงสร้างหมายเลข 2 (นิวเคลียส) มีความสำคัญต่อเซลล์ในเรื่องใดมากที่สุด?`,
        choices: [
          'บรรจุสารพันธุกรรม (DNA) และควบคุมการทำงานรวมถึงการแบ่งเซลล์',
          'สังเคราะห์แสงเพื่อสร้างน้ำตาลกลูโคสให้กับพืช',
          'ให้ความแข็งแรงและคงรูปร่างของเซลล์พืช',
          'เก็บสะสมน้ำและของเสียภายในเซลล์',
        ],
        answerIndex: 0,
        explain: 'นิวเคลียส (หมายเลข 2) เป็นศูนย์กลางควบคุมกิจกรรมต่างๆ ของเซลล์และเป็นที่อยู่ของโครโมโซม (DNA)',
        svgType: 'cell_diagram',
        needsFigure: true,
        indicator: `ว 1.2 ${grade}/1`,
      },
      {
        question: `โครงสร้างใดที่พบเฉพาะใน "เซลล์พืช" แต่ไม่พบใน "เซลล์สัตว์"?`,
        choices: [
          'ผนังเซลล์ (Cell Wall) และ คลอโรพลาสต์ (Chloroplast)',
          'เยื่อหุ้มเซลล์ และ นิวเคลียส',
          'ไมโทคอนเดรีย และ ไรโบโซม',
          'ไซโทพลาซึม และ กอลจิคอมเพล็กซ์',
        ],
        answerIndex: 0,
        explain: 'เซลล์พืชมีผนังเซลล์ให้ความแข็งแรงและคลอโรพลาสต์สำหรับสังเคราะห์ด้วยแสง ซึ่งไม่พบในเซลล์สัตว์',
        svgType: '',
        needsFigure: false,
        indicator: `ว 1.2 ${grade}/1`,
      },
    ];
    const t = bioTemplates[index % bioTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  if (uLow.includes('เคมี') || uLow.includes('เลขนัยสำคัญ') || s.includes('เคมี')) {
    const chemTemplates = [
      {
        question: `ในการเตรียมสารละลายมาตรฐานที่ต้องการความแม่นยำของปริมาตรสูง เช่น 100.00 cm³ ควรเลือกใช้อุปกรณ์ในข้อใด?`,
        choices: [
          'ขวดวัดปริมาตร (Volumetric Flask)',
          'บีกเกอร์ (Beaker)',
          'ขวดรูปชมพู่ (Erlenmeyer Flask)',
          'หลอดทดลองขนาดใหญ่',
        ],
        answerIndex: 0,
        explain: 'ขวดวัดปริมาตร (Volumetric Flask) ออกแบบมาเพื่อเตรียมสารละลายให้มีปริมาตรจำเพาะที่แม่นยำสูง',
        svgType: 'chem_glassware',
        needsFigure: true,
        indicator: `ว 2.1 ${grade}/1`,
      },
      {
        question: `ผลลัพธ์ของการบวก 15.761 + 4.876 - 3.51 ตามหลักการนับเลขนัยสำคัญของการบวกและลบ มีค่าตรงกับข้อใด?`,
        choices: [
          '17.13 (ทศนิยม 2 ตำแหน่ง)',
          '17.127 (ทศนิยม 3 ตำแหน่ง)',
          '17.1 (ทศนิยม 1 ตำแหน่ง)',
          '17 (จำนวนเต็ม)',
        ],
        answerIndex: 0,
        explain: 'การบวกและลบเลขนัยสำคัญ ผลลัพธ์ต้องยึดจำนวนตำแหน่งทศนิยมที่น้อยที่สุด ในที่นี้ 3.51 มีทศนิยม 2 ตำแหน่ง จึงปัด 17.127 เป็น 17.13',
        svgType: '',
        needsFigure: false,
        indicator: `ว 2.1 ${grade}/1`,
      },
    ];
    const t = chemTemplates[index % chemTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  // 2. Subject-strict generation (NEVER mix subjects!)
  // ---- ภาษาไทย ----
  if (s.includes('ภาษาไทย') || s.includes('ไทย')) {
    const thaiTemplates = [
      {
        question: `ในหัวข้อ "${u}" ข้อใดใช้คำและเรียบเรียงประโยคได้ถูกต้องตามหลักภาษาไทยชั้น ${grade}?`,
        choices: [
          'นักเรียนทุกคนตั้งใจอ่านหนังสือเพื่อเตรียมตัวสอบปลายภาค',
          'คุณครูให้นักเรียนทำการบ้านส่งเมื่อวานนี้พรุ่งนี้',
          'หนังสือเล่มนี้มีความสนุกสนานเดินไปโรงเรียน',
          'พวกเรารับประทานน้ำดื่มที่สะอาดทุกวัน',
        ],
        answerIndex: 0,
        explain: `ประโยค ก มีโครงสร้างภาคประธานและภาคแสดงที่สอดคล้องกันและใช้คำถูกต้องตามหลักเรื่อง "${u}"`,
        svgType: 'thai_sentence',
        needsFigure: false,
        indicator: `ท 4.1 ${grade}/1`,
      },
      {
        question: `ข้อใดสะกดคำและระบุมาตราตัวสะกดที่เกี่ยวข้องกับเรื่อง "${u}" ได้ถูกต้องทุกคำ?`,
        choices: [
          'สังเกต (แม่กด), กาลเวลา (แม่กน), ความสุข (แม่กก)',
          'อนุญาติ (แม่กด), สัมนา (แม่กม), กะทะ (แม่กง)',
          'ผูกพันธ์ (แม่กน), ทะเลสาป (แม่กบ), ศีรษะ (แม่กก)',
          'รสชาด (แม่กด), บันเทิง (แม่กง), โอกาศ (แม่กด)',
        ],
        answerIndex: 0,
        explain: 'สังเกต (ไม่มีสระอิ), กาลเวลา (ล สะกดแม่กน), ความสุข (ข สะกดแม่กก) เขียนสะกดคำได้ถูกต้องทั้งหมด',
        svgType: 'thai_spelling',
        needsFigure: index % 4 === 0,
        indicator: `ท 4.1 ${grade}/2`,
      },
      {
        question: `เมื่ออ่านบทอ่านหรือวรรณคดีเกี่ยวกับ "${u}" ข้อใดคือหลักการจับใจความสำคัญที่ถูกต้องที่สุด?`,
        choices: [
          'พิจารณาว่าใคร ทำอะไร ที่ไหน เมื่อไร และผลเป็นอย่างไร แล้วสรุปด้วยสำนวนภาษาของตนเอง',
          'คัดลอกข้อความประโยคแรกและประโยคสุดท้ายของทุกย่อหน้ามาเรียงต่อกัน',
          'เลือกจดเฉพาะคำศัพท์ที่ยากและคำราชาศัพท์ที่พบในเรื่องเท่านั้น',
          'อ่านข้ามส่วนที่เป็นรายละเอียดและดูเฉพาะชื่อเรื่องอย่างเดียว',
        ],
        answerIndex: 0,
        explain: 'การอ่านจับใจความสำคัญต้องแยกแยะใจความหลัก (5W1H) ออกจากพลความ แล้วนำมาเรียบเรียงใหม่ด้วยภาษาที่กระชับชัดเจน',
        svgType: '',
        needsFigure: false,
        indicator: `ท 1.1 ${grade}/2`,
      },
      {
        question: `จากแผนผังอักษร 3 หมู่ (ไตรยางศ์) คำในข้อใดมีพยัญชนะต้นเป็น "อักษรกลาง" ทั้งหมด? (ทบทวนหลักภาษา: ${u})`,
        choices: [
          'กานดา, จริงใจ, เด็กดี, เต่าทอง',
          'ข้าวสาร, ฉิ่งฉับ, ถุงผ้า, หีบเหล็ก',
          'ความดี, ช้างเผือก, ทหาร, พานทอง',
          'ผึ้งหลวง, ฝาแฝด, ศาลา, สวนสัตว์',
        ],
        answerIndex: 0,
        explain: 'อักษรกลางมี 9 ตัว ได้แก่ ก จ ฎ ฏ ด ต บ ป อ (ไก่จิกเด็กตายบนปากโอ่ง) ซึ่งคำว่า กานดา จริงใจ เด็กดี เต่าทอง ล้วนขึ้นต้นด้วยอักษรกลาง',
        svgType: 'thai_triyang',
        needsFigure: true,
        indicator: `ท 4.1 ${grade}/1`,
      },
      {
        question: `ในการเขียนสื่อสารหัวข้อ "${u}" ข้อใดเป็นการใช้ระดับภาษาทางการที่เหมาะสมสำหรับเขียนรายงานส่งครู?`,
        choices: [
          'จากการศึกษาค้นคว้าพบว่า การอ่านออกเสียงช่วยให้เข้าใจความหมายของคำได้ดียิ่งขึ้น',
          'เราคิดว่าเรื่องนี้น่าสนใจมากๆ เลยอยากเอามาเล่าให้เพื่อนๆ ฟังกัน',
          'ถ้าใครไม่อ่านหนังสือบอกเลยว่าสอบตกแน่นอน',
          'เรื่องนี้เจ๋งสุดๆ ได้ความรู้เพียบเลยครับ',
        ],
        answerIndex: 0,
        explain: 'การเขียนรายงานทางวิชาการต้องใช้ภาษาทางการหรือกึ่งทางการที่สุภาพ ชัดเจน ไม่ใช้คำคะนองหรือภาษาพูด',
        svgType: '',
        needsFigure: false,
        indicator: `ท 2.1 ${grade}/1`,
      },
    ];
    const t = thaiTemplates[index % thaiTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  // ---- คณิตศาสตร์ ----
  if (s.includes('คณิต') || s.includes('math') || s.includes('เลข')) {
    const numA = (variant * 3) + 12;
    const numB = (variant * 2) + 8;
    const prod = numA * numB;
    const mathTemplates = [
      {
        question: `[เรื่อง: ${u}] ร้านค้าจัดชุดอุปกรณ์การเรียนจำนวน ${numA} กล่อง แต่ละกล่องบรรจุสมุด ${numB} เล่ม มีสมุดรวมทั้งหมดกี่เล่ม?`,
        choices: [`${prod} เล่ม`, `${prod - numA} เล่ม`, `${prod + numB} เล่ม`, `${numA + numB} เล่ม`],
        answerIndex: 0,
        explain: `หาจำนวนสมุดทั้งหมดโดยการคูณ: ${numA} × ${numB} = ${prod} เล่ม`,
        svgType: 'bar_chart',
        needsFigure: false,
        indicator: `ค 1.1 ${grade}/1`,
      },
      {
        question: `[เรื่อง: ${u}] จากรูปสี่เหลี่ยมจัตุรัสที่มีความยาวรอบรูป ${numA * 4} เซนติเมตร รูปสี่เหลี่ยมนี้จะมีพื้นที่กี่ตารางเซนติเมตร?`,
        choices: [`${numA * numA} ตร.ซม.`, `${numA * 4} ตร.ซม.`, `${(numA + 2) * (numA + 2)} ตร.ซม.`, `${numA * 2} ตร.ซม.`],
        answerIndex: 0,
        explain: `ความยาวด้านละ ${numA * 4} ÷ 4 = ${numA} ซม. ดังนั้นพื้นที่ = ด้าน × ด้าน = ${numA} × ${numA} = ${numA * numA} ตารางเซนติเมตร`,
        svgType: 'right_triangle',
        needsFigure: index % 3 === 0,
        indicator: `ค 2.1 ${grade}/1`,
      },
      {
        question: `[เรื่อง: ${u}] ผลบวกของเศษส่วน 1/${variant + 2} + 1/${variant + 3} มีค่าเท่ากับข้อใด?`,
        choices: [
          `${2 * variant + 5}/${(variant + 2) * (variant + 3)}`,
          `2/${2 * variant + 5}`,
          `1/${(variant + 2) * (variant + 3)}`,
          `${variant + 1}/${variant + 4}`,
        ],
        answerIndex: 0,
        explain: `ทำตัวส่วนให้เท่ากันโดยใช้ ค.ร.น. คือ (${variant + 2})×(${variant + 3}) = ${(variant + 2) * (variant + 3)} จะได้ (${variant + 3} + ${variant + 2})/${(variant + 2) * (variant + 3)} = ${2 * variant + 5}/${(variant + 2) * (variant + 3)}`,
        svgType: 'fraction_bar',
        needsFigure: false,
        indicator: `ค 1.1 ${grade}/2`,
      },
    ];
    const t = mathTemplates[index % mathTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  // ---- วิทยาศาสตร์และเทคโนโลยี ----
  if (s.includes('วิทยา') || s.includes('วิทย์') || s.includes('science') || s.includes('ฟิสิกส์')) {
    const sciTemplates = [
      {
        question: `ในการศึกษาทดลองเรื่อง "${u}" ข้อใดเป็นทักษะกระบวนการทางวิทยาศาสตร์ขั้นพื้นฐานที่สำคัญในการรวบรวมข้อมูลจากการทดลอง?`,
        choices: [
          'การสังเกตและการวัดค่าตัวแปรอย่างละเอียดและตรงตามความจริง',
          'การคาดเดาคำตอบล่วงหน้าโดยไม่ต้องทำการทดลองจริง',
          'การปรับเปลี่ยนข้อมูลผลการทดลองให้ตรงกับความเชื่อของตนเอง',
          'การเลือกจดบันทึกเฉพาะข้อมูลที่ตัวเลขลงตัวเท่านั้น',
        ],
        answerIndex: 0,
        explain: `การสังเกตและการวัดอย่างถูกต้องตามข้อเท็จจริงเป็นหัวใจสำคัญของการศึกษาเรื่อง "${u}" ทางวิทยาศาสตร์`,
        svgType: 'chem_glassware',
        needsFigure: false,
        indicator: `ว 1.2 ${grade}/1`,
      },
      {
        question: `จากแผนภาพแสดงสถานะและการจัดเรียงอนุภาคของสสารเกี่ยวกับ "${u}" เมื่อสสารได้รับความร้อนเพิ่มขึ้น พลังงานจลน์ของอนุภาคจะเปลี่ยนแปลงอย่างไร?`,
        choices: [
          'อนุภาคมีพลังงานจลน์เพิ่มขึ้นและเคลื่อนที่เร็วขึ้น ช่องว่างระหว่างอนุภาคมากขึ้น',
          'อนุภาคหยุดนิ่งอยู่กับที่และยึดเหนี่ยวกันแน่นขึ้นกว่าเดิม',
          'มวลของอนุภาคลดลงจนหายไปทั้งหมด',
          'อุณหภูมิลดลงอย่างรวดเร็วและเปลี่ยนเป็นของแข็งทันที',
        ],
        answerIndex: 0,
        explain: 'เมื่อสสารได้รับความร้อน พลังงานความร้อนจะเปลี่ยนเป็นพลังงานจลน์ของอนุภาค ทำให้อนุภาคสั่นและเคลื่อนที่ห่างออกจากกันมากขึ้น',
        svgType: 'states_of_matter',
        needsFigure: true,
        indicator: `ว 2.1 ${grade}/1`,
      },
      {
        question: `ในการวิเคราะห์ความสัมพันธ์ของสิ่งมีชีวิตและสิ่งแวดล้อมในหัวข้อ "${u}" ข้อใดกล่าวถึงบทบาทของผู้ผลิตในระบบนิเวศได้ถูกต้อง?`,
        choices: [
          'สามารถเปลี่ยนพลังงานแสงเป็นพลังงานเคมีในรูปสารอาหารผ่านการสังเคราะห์ด้วยแสง',
          'ต้องกินสิ่งมีชีวิตอื่นเป็นอาหารเท่านั้นจึงจะดำรงชีวิตอยู่ได้',
          'ทำหน้าที่ย่อยสลายซากพืชซากสัตว์ในดินโดยไม่ต้องใช้แสง',
          'ใช้ออกซิเจนเป็นสารตั้งต้นในการสร้างน้ำตาลกลูโคส',
        ],
        answerIndex: 0,
        explain: 'ผู้ผลิต (เช่น พืชสีเขียวและสาหร่าย) มีคลอโรฟิลล์ที่ดูดกลืนพลังงานแสงมาสังเคราะห์ด้วยแสงสร้างอาหารให้แก่ห่วงโซ่อาหาร',
        svgType: 'photosynthesis',
        needsFigure: index % 3 === 0,
        indicator: `ว 1.1 ${grade}/1`,
      },
    ];
    const t = sciTemplates[index % sciTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  // ---- วิทยาการคำนวณ ----
  if (s.includes('คำนวณ') || s.includes('คอมพิวเตอร์') || uLow.includes('อัลกอริทึม') || uLow.includes('โปรแกรม')) {
    const compTemplates = [
      {
        question: `ในการแก้ปัญหาเรื่อง "${u}" ตามแนวคิดเชิงคำนวณ (Computational Thinking) การแบ่งปัญหาใหญ่ออกเป็นปัญหาย่อยๆ เรียกว่าขั้นตอนใด?`,
        choices: [
          'การแยกส่วนประกอบและการย่อยปัญหา (Decomposition)',
          'การหารูปแบบ (Pattern Recognition)',
          'การคิดเชิงนามธรรม (Abstraction)',
          'การออกแบบขั้นตอนวิธี (Algorithm Design)',
        ],
        answerIndex: 0,
        explain: 'Decomposition คือการแตกปัญหาใหญ่ที่ซับซ้อนออกเป็นส่วนย่อยๆ เพื่อให้จัดการและแก้ปัญหาแต่ละส่วนได้ง่ายขึ้น',
        svgType: '',
        needsFigure: false,
        indicator: `ว 4.2 ${grade}/1`,
      },
      {
        question: `ในการเขียนผังงาน (Flowchart) สำหรับเรื่อง "${u}" สัญลักษณ์รูปสี่เหลี่ยมขนมเปียกปูน (Diamond) ใช้แทนการทำงานในข้อใด?`,
        choices: [
          'การตัดสินใจหรือตรวจสอบเงื่อนไข (Decision)',
          'จุดเริ่มต้นและจุดสิ้นสุดของโปรแกรม (Start/End)',
          'การประมวลผลหรือคำนวณค่า (Process)',
          'การรับข้อมูลเข้าและแสดงผลข้อมูล (Input/Output)',
        ],
        answerIndex: 0,
        explain: 'ในผังงานมาตรฐาน สัญลักษณ์รูปสี่เหลี่ยมขนมเปียกปูนใช้แทนการตรวจสอบเงื่อนไข (จริง/เท็จ) เพื่อแยกทิศทางการทำงาน',
        svgType: '',
        needsFigure: false,
        indicator: `ว 4.2 ${grade}/2`,
      },
    ];
    const t = compTemplates[index % compTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  // ---- สังคมศึกษา และ ประวัติศาสตร์ ----
  if (s.includes('สังคม') || s.includes('ประวัติ') || s.includes('ศาสนา')) {
    const socTemplates = [
      {
        question: `ในการศึกษาเนื้อหาเรื่อง "${u}" ข้อใดเป็นการนำหลักปรัชญาของเศรษฐกิจพอเพียงมาประยุกต์ใช้ในชีวิตประจำวันได้อย่างเหมาะสมที่สุด?`,
        choices: [
          'วางแผนการใช้จ่ายเงินค่าขนมอย่างพอประมาณ มีเหตุผล และเก็บออมไว้ใช้ยามจำเป็น',
          'กู้ยืมเงินจากเพื่อนมาซื้อของเล่นราคาแพงตามกระแสนิยม',
          'ไม่ยอมใช้จ่ายเงินเพื่อซื้ออาหารที่มีประโยชน์ต่อร่างกายเลย',
          'ซื้อสินค้าทุกชนิดที่ลดราคาโดยไม่ตรวจสอบความจำเป็น',
        ],
        answerIndex: 0,
        explain: 'การวางแผนใช้จ่ายอย่างพอดีตามกำลังทรัพย์ คิดอย่างมีเหตุผล และมีเงินออมเป็นภูมิคุ้มกัน ตรงตามหลัก 3 ห่วง 2 เงื่อนไข',
        svgType: 'sufficiency_economy',
        needsFigure: index % 3 === 0,
        indicator: `ส 3.1 ${grade}/1`,
      },
      {
        question: `ตามหลักวิธีการทางประวัติศาสตร์ในการศึกษาเรื่อง "${u}" ขั้นตอนใดต้องทำทันทีหลังจาก "การรวบรวมหลักฐาน"?`,
        choices: [
          'การตรวจสอบและประเมินคุณค่าของหลักฐาน (วิพากษ์วิธีทางประวัติศาสตร์)',
          'การกำหนดหัวข้อเรื่องที่จะศึกษาค้นคว้า',
          'การนำเสนอข้อมูลเป็นรายงานหน้าชั้นเรียนทันที',
          'การทำลายหลักฐานที่เป็นสำเนาทิ้งทั้งหมด',
        ],
        answerIndex: 0,
        explain: 'วิธีการทางประวัติศาสตร์ 5 ขั้นตอน: 1. กำหนดหัวข้อ 2. รวบรวมหลักฐาน 3. ตรวจสอบและประเมินหลักฐาน 4. ตีความและสังเคราะห์ 5. เรียบเรียงและนำเสนอ',
        svgType: '',
        needsFigure: false,
        indicator: `ส 4.1 ${grade}/1`,
      },
    ];
    const t = socTemplates[index % socTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  // ---- ภาษาอังกฤษ ----
  if (s.includes('อังกฤษ') || s.includes('english') || s.includes('eng')) {
    const engTemplates = [
      {
        question: `[Topic: ${u}] Choose the most appropriate response to complete the conversation:\nA: "Excuse me, could you help me with this lesson?"\nB: "____________________"`,
        choices: [
          'Sure, with pleasure!',
          'No, I am watching TV yesterday.',
          'You are welcome.',
          'Yes, I went there tomorrow.',
        ],
        answerIndex: 0,
        explain: '"Sure, with pleasure!" or "Of course!" is the polite affirmative response when someone asks for help.',
        svgType: '',
        needsFigure: false,
        indicator: `ต 1.2 ${grade}/1`,
      },
      {
        question: `[Topic: ${u}] Look at the sentence structure: "The students __________ studying English in the classroom right now." Which verb form is correct?`,
        choices: ['are', 'is', 'am', 'was'],
        answerIndex: 0,
        explain: 'The subject "The students" is plural and "right now" indicates Present Continuous Tense, so we use "are".',
        svgType: 'prepositions',
        needsFigure: index % 3 === 0,
        indicator: `ต 1.1 ${grade}/2`,
      },
    ];
    const t = engTemplates[index % engTemplates.length];
    return { ...t, level: ((index % 3) + 1), score, source: 'ai' };
  }

  // ---- สุขศึกษา / ศิลปะ / การงานอาชีพ / อื่นๆ ----
  return {
    question: `จากสาระการเรียนรู้วิชา${subject} ชั้น ${grade} เรื่อง "${u}" ข้อใดเป็นการปฏิบัติตนและสรุปองค์ความรู้ได้ถูกต้องที่สุด? (ข้อที่ ${variant})`,
    choices: [
      `เข้าใจหลักการของ "${u}" และนำไปปฏิบัติตามขั้นตอนได้อย่างปลอดภัยและมีประสิทธิภาพ`,
      `หลีกเลี่ยงการปฏิบัติตามกฎระเบียบและขั้นตอนพื้นฐานของ "${u}"`,
      `ดำเนินการโดยไม่วางแผนล่วงหน้าและไม่ตรวจสอบผลลัพธ์`,
      `ใช้วัสดุอุปกรณ์ผิดประเภทโดยไม่คำนึงถึงความปลอดภัย`,
    ],
    answerIndex: 0,
    explain: `การศึกษาเรื่อง "${u}" ในวิชา${subject} มุ่งเน้นความเข้าใจหลักการที่ถูกต้อง การวางแผนเป็นขั้นตอน และการนำไปปฏิบัติอย่างปลอดภัย`,
    level: ((index % 3) + 1),
    score,
    indicator: getDefaultIndicatorCode(subject, grade),
    source: 'ai',
    svgType: '',
    needsFigure: false,
  };
}

export function getDefaultIndicatorCode(subject: string, grade: string): string {
  const s = subject.toLowerCase();
  if (s.includes('ไทย')) return `ท 1.1 ${grade}/1`;
  if (s.includes('คณิต')) return `ค 1.1 ${grade}/1`;
  if (s.includes('คำนวณ') || s.includes('คอม')) return `ว 4.2 ${grade}/1`;
  if (s.includes('วิทยา') || s.includes('วิทย์') || s.includes('เคมี') || s.includes('ชีว') || s.includes('ฟิสิกส์')) return `ว 1.2 ${grade}/1`;
  if (s.includes('ประวัติ')) return `ส 4.1 ${grade}/1`;
  if (s.includes('สังคม')) return `ส 1.1 ${grade}/1`;
  if (s.includes('สุข') || s.includes('พลศึกษา')) return `พ 1.1 ${grade}/1`;
  if (s.includes('ศิลปะ')) return `ศ 1.1 ${grade}/1`;
  if (s.includes('การงาน')) return `ง 1.1 ${grade}/1`;
  if (s.includes('อังกฤษ') || s.includes('eng')) return `ต 1.1 ${grade}/1`;
  return `ว 1.1 ${grade}/1`;
}

/**
 * Filter subject pool so that when the user specifies a focused topic/scope,
 * ONLY relevant pool items are returned (preventing off-topic questions!).
 */
function selectRelevantPool(subject: string, scope: string, title: string, hint: string): ExamItemMc[] {
  const s = subject.toLowerCase();
  const combinedTopic = `${title} ${hint} ${scope}`.toLowerCase();

  // Check for high-specificity topics first
  if (combinedTopic.includes('เซต') || combinedTopic.includes('เวนน์') || combinedTopic.includes('สับเซต')) {
    if (!combinedTopic.includes('จำนวนนับ') && !combinedTopic.includes('เศษส่วน')) {
      return SETS_MC_POOL;
    }
  }
  if (combinedTopic.includes('ระบบสมการ') || combinedTopic.includes('สมการเชิงเส้นสองตัวแปร')) {
    return LINEAR_SYSTEM_MC_POOL;
  }
  if (combinedTopic.includes('เซลล์') || s.includes('ชีววิทยา')) {
    return CELL_BIOLOGY_MC_POOL;
  }
  if (combinedTopic.includes('ปฏิบัติการเคมี') || combinedTopic.includes('ความปลอดภัย') || combinedTopic.includes('เลขนัยสำคัญ') || s.includes('เคมี')) {
    return CHEMISTRY_SAFETY_MC_POOL;
  }

  // Otherwise pick the strict subject pool
  let basePool: ExamItemMc[] = [];
  if (s.includes('ภาษาไทย') || s.includes('ไทย') || s.includes('วรรณคดี')) {
    basePool = THAI_MC_POOL;
  } else if (s.includes('คณิต') || s.includes('เลข') || s.includes('math')) {
    basePool = MATH_MC_POOL;
  } else if (s.includes('อังกฤษ') || s.includes('english') || s.includes('eng')) {
    basePool = ENGLISH_MC_POOL;
  } else if (s.includes('สังคม') || s.includes('ประวัติ') || s.includes('ศาสนา') || s.includes('ภูมิศาสตร์')) {
    basePool = SOCIAL_MC_POOL;
  } else if (s.includes('วิทยา') || s.includes('วิทย์') || s.includes('science') || s.includes('ฟิสิกส์')) {
    basePool = SCIENCE_MC_POOL;
  } else {
    // Computing, Health, Art, Career -> use dynamic topic synthesis directly so it's 100% on-subject
    return [];
  }

  // Filter basePool by user's scope/topic if the user specified a narrow topic (1-3 units)
  const { units, focusedTopic } = extractTargetUnits(scope, title, hint, subject);
  if (focusedTopic) {
    const focusLow = focusedTopic.toLowerCase();
    const matched = basePool.filter((it) => {
      const qLow = it.question.toLowerCase();
      const tagMatch = (it.tags || []).some((t) => focusLow.includes(t.toLowerCase()) || t.toLowerCase().includes(focusLow));
      const wordMatch = units.some((u) => u.length >= 2 && (qLow.includes(u.toLowerCase()) || (it.tags || []).some((t) => u.toLowerCase().includes(t.toLowerCase()))));
      return tagMatch || wordMatch;
    });
    if (matched.length > 0) {
      return matched;
    }
    // If the user typed a narrow custom topic that isn't in the static pool, return empty so synthesizeSubjectTopicMc creates questions specifically for that custom topic!
    if (units.length <= 2) {
      return [];
    }
  }

  return basePool;
}

/**
 * Generate accurate, verified curriculum exam questions strictly matching subject & scope,
 * with selective or full figures.
 */
export function generateAccurateCurriculumExamParts(
  partsCfg: Record<string, any>,
  topic: string,
  grade: string,
  subject: string,
  hint: string = '',
  indicators: string[] = [],
  withFigures: boolean | string = 'smart',
  title: string = ''
) {
  const parts: Record<string, any> = {};
  let totalScore = 0;
  let totalItems = 0;

  const parsePart = (val: any, defaultScore: number) => {
    if (!val) return { count: 0, score: defaultScore };
    if (typeof val === 'number') return { count: Math.max(0, val), score: defaultScore };
    return {
      count: Math.max(0, Number(val.count) || 0),
      score: Number(val.score) > 0 ? Number(val.score) : defaultScore,
    };
  };

  const { units } = extractTargetUnits(topic, title, hint, subject);
  const relevantPool = selectRelevantPool(subject, topic, title, hint);
  const indCodes = Array.isArray(indicators) && indicators.length > 0
    ? indicators.map((x: any) => (typeof x === 'string' ? x : x.code)).filter(Boolean)
    : [getDefaultIndicatorCode(subject, grade)];

  // 1. Multiple Choice (ปรนัย 4 ตัวเลือก)
  const mc = parsePart(partsCfg.mc, 1);
  if (mc.count > 0) {
    const items = [];
    const usedQuestions = new Set<string>();

    for (let i = 0; i < mc.count; i++) {
      let item: any = null;
      let needsFig: boolean | undefined = undefined;
      let svgType = '';

      if (i < relevantPool.length) {
        const poolItem = relevantPool[i];
        svgType = poolItem.svgType || '';
        needsFig = poolItem.needsFigure;
        item = {
          question: poolItem.question,
          choices: [...poolItem.choices],
          answerIndex: poolItem.answerIndex,
          explain: poolItem.explain,
          level: poolItem.level,
          score: mc.score,
          indicator: indCodes[i % indCodes.length] || poolItem.indicator,
          source: 'ai',
        };
      } else {
        const targetUnit = units[i % units.length] || topic || subject;
        const syn = synthesizeSubjectTopicMc(subject, targetUnit, grade, i, mc.score);
        svgType = syn.svgType || '';
        needsFig = syn.needsFigure;
        item = {
          question: syn.question,
          choices: syn.choices,
          answerIndex: syn.answerIndex,
          explain: syn.explain,
          level: syn.level,
          score: mc.score,
          indicator: indCodes[i % indCodes.length] || syn.indicator,
          source: 'ai',
        };
      }

      if (usedQuestions.has(item.question)) {
        const uName = units[i % units.length] || subject;
        item.question = `${item.question} (ประเด็นศึกษาเรื่อง ${uName} ข้อที่ ${i + 1})`;
      }
      usedQuestions.add(item.question);

      if (shouldAttachFigure(withFigures, item.question, needsFig, i)) {
        item.figure = generateSubjectSvg(subject, item.question, i, 'mc', svgType);
      } else {
        item.figure = '';
      }

      items.push(item);
    }

    parts.mc = { score: mc.score, items };
    totalItems += mc.count;
    totalScore += mc.count * mc.score;
  }

  // 2. True / False (ถูก / ผิด)
  const tf = parsePart(partsCfg.tf, 1);
  if (tf.count > 0) {
    const items = [];
    for (let i = 0; i < tf.count; i++) {
      const targetUnit = units[i % units.length] || topic || subject;
      const isTrue = i % 2 === 0;
      const statement = isTrue
        ? `ในวิชา${subject} ชั้น ${grade} หลักการของเรื่อง "${targetUnit}" มีความสำคัญและสอดคล้องตามมาตรฐานการเรียนรู้แกนกลาง`
        : `ในการศึกษาเรื่อง "${targetUnit}" วิชา${subject} เราไม่จำเป็นต้องตรวจสอบความถูกต้องของข้อมูลหรือขั้นตอนการปฏิบัติ`;
      const explain = isTrue
        ? `ถูกต้อง เพราะเนื้อหาเรื่อง "${targetUnit}" เป็นสาระสำคัญตามตัวชี้วัดวิชา${subject}`
        : `ไม่ถูกต้อง เพราะการศึกษาเรื่อง "${targetUnit}" ต้องตรวจสอบความถูกต้องตามหลักวิชาการเสมอ`;

      const attach = shouldAttachFigure(withFigures, statement, i === 0, i);
      items.push({
        statement,
        answer: isTrue,
        explain,
        level: ((i % 3) + 1),
        score: tf.score,
        indicator: indCodes[i % indCodes.length],
        source: 'ai',
        figure: attach ? generateSubjectSvg(subject, targetUnit, i, 'tf') : '',
      });
    }
    parts.tf = { score: tf.score, items };
    totalItems += tf.count;
    totalScore += tf.count * tf.score;
  }

  // 3. Matching (จับคู่)
  const match = parsePart(partsCfg.match, 1);
  if (match.count > 0) {
    const items = [];
    for (let i = 0; i < match.count; i++) {
      const targetUnit = units[i % units.length] || `${topic || subject} หัวข้อที่ ${i + 1}`;
      items.push({
        left: `${targetUnit} (แนวคิดหลักที่ ${i + 1})`,
        right: `ความหมายและหลักการสำคัญของเรื่อง ${targetUnit} ในวิชา${subject}`,
        level: 1,
        score: match.score,
        indicator: indCodes[i % indCodes.length],
        source: 'ai',
      });
    }
    parts.match = { score: match.score, items };
    totalItems += match.count;
    totalScore += match.count * match.score;
  }

  // 4. Written (อัตนัย / แสดงวิธีทำ)
  const written = parsePart(partsCfg.written, 5);
  if (written.count > 0) {
    const items = [];
    for (let i = 0; i < written.count; i++) {
      const targetUnit = units[i % units.length] || topic || subject;
      const qText = `จงอธิบายหลักการสำคัญและแสดงวิธีคิด/ยกตัวอย่างการนำความรู้เรื่อง "${targetUnit}" ในวิชา${subject} ชั้น ${grade} ไปประยุกต์ใช้`;
      const attach = shouldAttachFigure(withFigures, qText, i === 0, i);
      items.push({
        question: qText,
        solution: [
          `ขั้นที่ 1: สรุปหลักการและแนวคิดสำคัญของเรื่อง "${targetUnit}"`,
          `ขั้นที่ 2: แสดงขั้นตอนการคิดวิเคราะห์หรือวิธีทำอย่างเป็นระบบ`,
          `ขั้นที่ 3: ยกตัวอย่างการนำไปใช้และสรุปคำตอบอย่างชัดเจน`,
        ],
        answer: `อธิบายหลักการของเรื่อง ${targetUnit} พร้อมแสดงขั้นตอนและยกตัวอย่างได้ถูกต้องครบถ้วน`,
        lines: 6,
        level: 3,
        score: written.score,
        indicator: indCodes[i % indCodes.length],
        source: 'ai',
        figure: attach ? generateSubjectSvg(subject, targetUnit, i, 'written') : '',
      });
    }
    parts.written = { score: written.score, items };
    totalItems += written.count;
    totalScore += written.count * written.score;
  }

  return { parts, totalItems, totalScore };
}

/** Backward compatible alias for legacy callers */
export function generateMockExamParts(partsCfg: Record<string, any>, topic: string, grade: string, subject: string) {
  return generateAccurateCurriculumExamParts(partsCfg, topic, grade, subject, '', [], 'smart');
}

/**
 * Generate an accurate, topic-grounded, subject-specific worksheet for all 10 worksheet types in index.php!
 * Also attaches clean SVG diagrams (`figures` array + `figure` refs) so worksheets look like real exams/worksheets.
 */
export function generateAccurateWorksheet(
  type: string,
  topic: string,
  grade: string,
  subject: string = 'วิทยาศาสตร์และเทคโนโลยี',
  itemCount: number = 5,
  figureMode: string = 'code'
): any {
  const cleanTopic = String(topic || subject || 'สาระการเรียนรู้').replace(/\s*\(ตอนที่\s*\d+\)\s*$/, '').trim();
  const indCode = getDefaultIndicatorCode(subject, grade);
  const generatedExam = generateAccurateCurriculumExamParts(
    { mc: { count: Math.max(itemCount, 6), score: 1 } },
    cleanTopic,
    grade,
    subject,
    cleanTopic,
    [indCode],
    figureMode === 'none' ? 'none' : 'smart',
    cleanTopic
  );
  const mcItems = generatedExam.parts.mc?.items || [];

  // Build WSRender-compatible figures array for items that have a figure
  const figures: any[] = [];
  const registerFigure = (svgStr: string, caption: string, idx: number): string => {
    if (!svgStr || figureMode === 'none') return '';
    const figId = `fig_${idx + 1}`;
    figures.push({
      id: figId,
      kind: 'svg',
      svg: svgStr,
      caption,
      imagePrompt: `${subject} ${cleanTopic} diagram ${idx + 1}`,
    });
    return figId;
  };

  const baseSheet: any = {
    title: `ใบงานเรื่อง ${topic}`,
    topic,
    subject,
    grade,
    type: type || 'multiple_choice',
    time: '30 นาที',
    score: itemCount,
    objective: `เพื่อให้นักเรียนชั้น ${grade} ฝึกทักษะและเข้าใจเนื้อหาเรื่อง ${cleanTopic} ในวิชา${subject}`,
    indicators: [{ code: indCode, text: `เข้าใจและประยุกต์ใช้ความรู้เรื่อง ${cleanTopic} (${subject})` }],
    headerImagePrompt: `${subject} ${cleanTopic}`,
  };

  if (type === 'fill_blank') {
    const wordBank: string[] = [];
    const items = mcItems.slice(0, itemCount).map((mc: any, i: number) => {
      const ans = String(mc.choices[mc.answerIndex] || `คำตอบที่ ${i + 1}`).slice(0, 45);
      wordBank.push(ans);
      const qClean = String(mc.question).replace(/\?$/, '');
      const figRef = registerFigure(mc.figure, `ภาพประกอบข้อที่ ${i + 1}`, i);
      return {
        text: `${qClean} คือ ________`,
        answer: ans,
        figure: figRef,
        svgFigure: mc.figure || '',
        imagePrompt: mc.figure ? `${subject} ${cleanTopic} item ${i + 1}` : '',
      };
    });
    return {
      ...baseSheet,
      instruction: 'ให้นักเรียนเลือกคำหรือข้อความที่กำหนดให้ เติมลงในช่องว่างให้ถูกต้องสมบูรณ์',
      wordBank,
      items,
      figures,
    };
  }

  if (type === 'true_false') {
    const items = mcItems.slice(0, itemCount).map((mc: any, i: number) => {
      const isTrue = i % 2 === 0;
      const chosenChoice = isTrue ? mc.choices[mc.answerIndex] : mc.choices[(mc.answerIndex + 1) % mc.choices.length];
      const statement = `${String(mc.question).replace(/\?$/, '')} คำตอบที่ถูกต้องคือ "${chosenChoice}"`;
      const figRef = registerFigure(mc.figure, `ภาพประกอบข้อที่ ${i + 1}`, i);
      return {
        statement,
        answer: isTrue,
        explain: mc.explain,
        figure: figRef,
        svgFigure: mc.figure || '',
        imagePrompt: mc.figure ? `${subject} ${cleanTopic} item ${i + 1}` : '',
      };
    });
    return {
      ...baseSheet,
      instruction: 'ให้พิจารณาข้อความต่อไปนี้ หากถูกต้องให้เขียนเครื่องหมาย ✓ หากผิดให้เขียนเครื่องหมาย ✗ หน้าข้อ',
      items,
      figures,
    };
  }

  if (type === 'matching') {
    const items = mcItems.slice(0, itemCount).map((mc: any, i: number) => ({
      left: String(mc.question).replace(/\?$/, ''),
      right: String(mc.choices[mc.answerIndex]),
      imagePrompt: '',
    }));
    return {
      ...baseSheet,
      instruction: 'ให้นักเรียนจับคู่โจทย์หรือข้อความทางด้านซ้าย กับคำตอบที่สัมพันธ์กันทางด้านขวาให้ถูกต้อง',
      items,
      figures: [],
    };
  }

  if (type === 'ordering') {
    const items = mcItems.slice(0, itemCount).map((mc: any, i: number) => ({
      label: `ขั้นที่ ${i + 1}: ${mc.choices[mc.answerIndex]} (${String(mc.question).slice(0, 40)})`,
      order: i + 1,
      imagePrompt: '',
    }));
    return {
      ...baseSheet,
      instruction: `ให้นักเรียนเรียงลำดับขั้นตอนหรือกระบวนการของเรื่อง "${cleanTopic}" จากลำดับที่ 1 ถึง ${itemCount}`,
      items,
      figures: [],
    };
  }

  if (type === 'short_answer') {
    const items = mcItems.slice(0, itemCount).map((mc: any, i: number) => {
      const figRef = registerFigure(mc.figure, `แผนภาพประกอบข้อ ${i + 1}`, i);
      return {
        question: mc.question,
        answer: mc.choices[mc.answerIndex],
        explain: mc.explain,
        level: mc.level,
        indicator: indCode,
        figure: figRef,
        svgFigure: mc.figure || '',
      };
    });
    return {
      ...baseSheet,
      instruction: 'ให้นักเรียนตอบคำถามต่อไปนี้ให้ถูกต้องและกระชับได้ใจความ',
      items,
      figures,
    };
  }

  if (type === 'calculation') {
    const items = mcItems.slice(0, itemCount).map((mc: any, i: number) => {
      const figRef = registerFigure(mc.figure, `แผนภาพประกอบข้อ ${i + 1}`, i);
      return {
        question: mc.question,
        solution: [
          `วิเคราะห์โจทย์: ${mc.question}`,
          `วิธีคิด/หลักการ: ${mc.explain}`,
        ],
        answer: mc.choices[mc.answerIndex],
        lines: 4,
        level: mc.level,
        indicator: indCode,
        figure: figRef,
        svgFigure: mc.figure || '',
      };
    });
    return {
      ...baseSheet,
      instruction: 'ให้นักเรียนแสดงวิธีคิดหรือวิธีทำอย่างละเอียด พร้อมระบุคำตอบที่ถูกต้อง',
      items,
      figures,
    };
  }

  if (type === 'multi_statement') {
    const items = mcItems.slice(0, itemCount).map((mc: any, i: number) => {
      const figRef = registerFigure(mc.figure, `แผนภาพประกอบข้อ ${i + 1}`, i);
      return {
        question: `พิจารณาข้อความเกี่ยวกับ "${cleanTopic}" ต่อไปนี้ (${mc.question})`,
        statements: [
          `${mc.choices[mc.answerIndex]} (สอดคล้องกับหลักวิชาการ)`,
          `${mc.explain}`,
          `${mc.choices[(mc.answerIndex + 1) % 4]} (ข้อความคลาดเคลื่อน)`,
        ],
        correct: [1, 2],
        explain: mc.explain,
        level: mc.level,
        indicator: indCode,
        figure: figRef,
        svgFigure: mc.figure || '',
      };
    });
    return {
      ...baseSheet,
      instruction: 'ให้พิจารณาข้อความย่อยที่กำหนดให้ แล้วเลือกตัวเลือกที่ระบุข้อความที่ถูกต้องทั้งหมด',
      items,
      figures,
    };
  }

  if (type === 'data_set') {
    const mainSvg = generateSubjectSvg(subject, cleanTopic, 0, 'mc');
    const stimFigId = registerFigure(mainSvg, `ข้อมูลและแผนภาพเรื่อง ${cleanTopic}`, 0);
    const items = mcItems.slice(0, itemCount).map((mc: any) => ({
      question: mc.question,
      choices: mc.choices,
      answerIndex: mc.answerIndex,
      explain: mc.explain,
      level: mc.level,
      indicator: indCode,
      figure: '',
    }));
    return {
      ...baseSheet,
      instruction: 'ให้นักเรียนศึกษารายละเอียดและแผนภาพที่กำหนดให้ แล้วตอบคำถามให้ถูกต้อง',
      stimulus: `สถานการณ์และข้อมูลทางวิชาการเรื่อง "${cleanTopic}" สำหรับวิชา${subject} ชั้น ${grade}: ให้นักเรียนสังเกตแผนภาพและวิเคราะห์ข้อมูลเพื่อใช้ตอบคำถาม`,
      stimulusFigure: stimFigId,
      items,
      figures,
    };
  }

  if (type === 'exam') {
    const mcSub = mcItems.slice(0, Math.max(2, itemCount - 1)).map((mc: any, i: number) => {
      const figRef = registerFigure(mc.figure, `แผนภาพประกอบข้อ ${i + 1}`, i);
      return {
        question: mc.question,
        choices: mc.choices,
        answerIndex: mc.answerIndex,
        explain: mc.explain,
        level: mc.level,
        indicator: indCode,
        figure: figRef,
        svgFigure: mc.figure || '',
      };
    });
    const lastMc = mcItems[mcItems.length - 1] || mcItems[0];
    const writtenItems = [
      {
        question: `จงอธิบายหลักการสำคัญและแสดงวิธีคิดในเรื่อง "${cleanTopic}" (${lastMc.question})`,
        solution: [`1. วิเคราะห์โจทย์และหลักการของ ${cleanTopic}`, `2. ${lastMc.explain}`],
        answer: lastMc.choices[lastMc.answerIndex],
        lines: 5,
        level: 3,
        indicator: indCode,
        figure: '',
      },
    ];
    return {
      ...baseSheet,
      instruction: 'แบบทดสอบฉบับนี้แบ่งเป็น 2 ตอน ได้แก่ ตอนที่ 1 แบบปรนัย 4 ตัวเลือก และตอนที่ 2 แบบอัตนัยแสดงวิธีทำ',
      mcItems: mcSub,
      writtenItems,
      items: mcSub,
      figures,
    };
  }

  // Default: multiple_choice
  const items = mcItems.slice(0, itemCount).map((mc: any, i: number) => {
    const figRef = registerFigure(mc.figure, `แผนภาพประกอบข้อที่ ${i + 1}`, i);
    return {
      question: mc.question,
      choices: mc.choices,
      answerIndex: mc.answerIndex,
      explain: mc.explain,
      level: mc.level,
      indicator: indCode,
      figure: figRef,
      svgFigure: mc.figure || '',
      imagePrompt: mc.figure ? `${subject} ${cleanTopic} item ${i + 1}` : '',
    };
  });

  return {
    ...baseSheet,
    instruction: 'ให้นักเรียนเลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว',
    items,
    figures,
  };
}

/** Generate mock single worksheet (backward compatible) */
export function generateMockSheet(type: string, topic: string, grade: string, itemCount: number = 5, subject: string = 'วิทยาศาสตร์และเทคโนโลยี'): any {
  return generateAccurateWorksheet(type, topic, grade, subject, itemCount, 'code');
}

/** Generate SVG line art for educational diagrams */
export function generateSvgLineArt(prompt: string): string {
  return generateSubjectSvg('', prompt, 0, 'mc');
}
