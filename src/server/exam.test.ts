import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateAccurateCurriculumExamParts,
  generateAccurateWorksheet,
  generateSubjectSvg,
} from './ai.js';

test('generateSubjectSvg returns valid educational SVG matching specific topics', () => {
  const vennSvg = generateSubjectSvg('คณิตศาสตร์', 'เซตและแผนภาพเวนน์', 0, 'mc');
  assert.ok(vennSvg.startsWith('<svg') && vennSvg.endsWith('</svg>'));
  assert.ok(vennSvg.includes('circle'), 'Venn diagram SVG must contain circles');

  const linearSvg = generateSubjectSvg('คณิตศาสตร์', 'กราฟของระบบสมการเชิงเส้นสองตัวแปร', 0, 'mc');
  assert.ok(linearSvg.startsWith('<svg') && linearSvg.includes('line'));

  const cellSvg = generateSubjectSvg('ชีววิทยา', 'โครงสร้างและส่วนประกอบของเซลล์พืช', 0, 'mc');
  assert.ok(cellSvg.startsWith('<svg') && cellSvg.includes('ellipse'));

  const chemSvg = generateSubjectSvg('เคมี', 'ความปลอดภัยและทักษะในปฏิบัติการเคมี สัญลักษณ์ NFPA', 0, 'mc');
  assert.ok(chemSvg.startsWith('<svg') && chemSvg.includes('สีแดง'));
});

test('generateAccurateCurriculumExamParts respects selective figure mode (smart vs all vs none)', () => {
  const partsCfg = { mc: { count: 8, score: 1 } };

  // 1. Smart mode: some items have figures (e.g. Venn diagram question), some pure symbolic items do not
  const smartRes = generateAccurateCurriculumExamParts(
    partsCfg,
    'เซตและการดำเนินการของเซต',
    'ม.4',
    'คณิตศาสตร์',
    '',
    [],
    'smart',
    'แบบทดสอบเรื่องเซต'
  );
  const smartItems = smartRes.parts.mc.items;
  assert.equal(smartItems.length, 8);
  const withFigCount = smartItems.filter((it: any) => it.figure && it.figure.startsWith('<svg')).length;
  const withoutFigCount = smartItems.filter((it: any) => !it.figure).length;
  assert.ok(withFigCount > 0, 'Smart mode must attach figures to visual questions');
  assert.ok(withoutFigCount > 0, 'Smart mode must omit figures on pure symbolic questions');

  // 2. All mode: every question gets a figure
  const allRes = generateAccurateCurriculumExamParts(
    partsCfg,
    'เซต',
    'ม.4',
    'คณิตศาสตร์',
    '',
    [],
    'all'
  );
  for (const it of allRes.parts.mc.items) {
    assert.ok(it.figure && it.figure.startsWith('<svg'), 'All mode must attach SVG figure to every question');
  }

  // 3. None mode: no question gets a figure
  const noneRes = generateAccurateCurriculumExamParts(
    partsCfg,
    'เซต',
    'ม.4',
    'คณิตศาสตร์',
    '',
    [],
    'none'
  );
  for (const it of noneRes.parts.mc.items) {
    assert.equal(it.figure, '', 'None mode must not attach figures');
  }
});

test('generateAccurateCurriculumExamParts strictly adheres to Thai subject and never drifts to Math', () => {
  const partsCfg = { mc: { count: 20, score: 1 } };
  const { parts } = generateAccurateCurriculumExamParts(
    partsCfg,
    'คำเป็น คำตาย และมาตราตัวสะกด',
    'ป.4',
    'ภาษาไทย',
    'เน้นมาตราตัวสะกดและคำเป็นคำตาย',
    [],
    'smart',
    'ข้อสอบวิชาภาษาไทย เรื่อง คำเป็นคำตาย'
  );

  const items = parts.mc.items;
  assert.equal(items.length, 20);

  const uniqueQuestions = new Set(items.map((it: any) => it.question));
  assert.equal(uniqueQuestions.size, 20, 'All 20 Thai questions must be distinct');

  for (const it of items) {
    assert.ok(
      !it.question.includes('มะม่วง') && !it.question.includes('กิโลกรัมละ'),
      `Thai exam question must never drift to Math word problems: ${it.question}`
    );
  }
});

test('generateAccurateCurriculumExamParts matches specific topics (Linear Systems, Cell Biology, Chemistry Safety)', () => {
  const linearExam = generateAccurateCurriculumExamParts(
    { mc: { count: 4, score: 1 } },
    'ระบบสมการเชิงเส้นสองตัวแปร',
    'ม.3',
    'คณิตศาสตร์',
    '',
    [],
    'smart'
  );
  assert.ok(
    linearExam.parts.mc.items.some((it: any) => it.question.includes('สมการเชิงเส้น') || it.question.includes('กราฟ')),
    'Linear system exam must contain linear system questions'
  );

  const cellExam = generateAccurateCurriculumExamParts(
    { mc: { count: 4, score: 1 } },
    'โครงสร้างและหน้าที่ของเซลล์',
    'ม.4',
    'วิทยาศาสตร์และเทคโนโลยี',
    '',
    [],
    'smart'
  );
  assert.ok(
    cellExam.parts.mc.items.some((it: any) => it.question.includes('เซลล์') || it.question.includes('คลอโรพลาสต์') || it.question.includes('ไมโทคอนเดรีย')),
    'Cell biology exam must contain cell structure questions'
  );

  const chemExam = generateAccurateCurriculumExamParts(
    { mc: { count: 6, score: 1 } },
    'ความปลอดภัยและทักษะในปฏิบัติการเคมี เลขนัยสำคัญ',
    'ม.4',
    'วิทยาศาสตร์และเทคโนโลยี',
    '',
    [],
    'smart'
  );
  assert.ok(
    chemExam.parts.mc.items.some((it: any) => it.question.includes('บิวเรตต์') || it.question.includes('เลขนัยสำคัญ') || it.question.includes('อันตราย')),
    'Chemistry safety exam must contain lab equipment, safety symbol, or significant figure questions'
  );
});

test('generateAccurateWorksheet generates topic-specific items and SVG figures across worksheet types', () => {
  const mcSheet = generateAccurateWorksheet(
    'multiple_choice',
    'ระบบสมการเชิงเส้นสองตัวแปร',
    'ม.3',
    'คณิตศาสตร์',
    4,
    'code'
  );
  assert.equal(mcSheet.items.length, 4);
  assert.ok(mcSheet.figures && mcSheet.figures.length > 0 && mcSheet.figures[0].svg.startsWith('<svg'));
  assert.ok(mcSheet.items.some((it: any) => it.question.includes('สมการ') || it.question.includes('กราฟ')));

  const matchSheet = generateAccurateWorksheet(
    'matching',
    'โครงสร้างและหน้าที่ของเซลล์',
    'ม.4',
    'วิทยาศาสตร์และเทคโนโลยี',
    4,
    'code'
  );
  assert.equal(matchSheet.items.length, 4);
  assert.ok(matchSheet.items.every((it: any) => it.left && it.right));
});
