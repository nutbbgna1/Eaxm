import fs from 'fs';
import path from 'path';

export function navHtml(active: string): string {
  const steps: Record<string, [string, string, string, string]> = {
    home: ['home.php', '⌂', 'หน้าเริ่มต้น', 'ภาพรวม ขั้นตอนการใช้งาน และเช็กความพร้อมของระบบ'],
    term: ['term.php', '1', 'แผนภาคเรียน', 'วางหัวข้อรายสัปดาห์ทั้งภาคเรียน'],
    lplan: ['lplan.php', '2', 'แผนการสอน', 'ให้ AI ร่างแผนการจัดการเรียนรู้ของแต่ละเรื่อง (แกนหลักของบทเรียน)'],
    index: ['index.php', '3', 'สร้างใบงาน', 'สร้างใบงาน เฉลย ใบความรู้ ตามแผนการสอน แล้วพิมพ์เป็น PDF'],
    book: ['book.php', '4', 'รวมเล่ม', 'รวมใบงานหลายชุดเป็นเล่ม มีปก สารบัญ และเฉลย'],
    exam: ['exam.php', '5', 'ข้อสอบ', 'สร้างข้อสอบกลางภาค/ปลายภาค พร้อมตารางวิเคราะห์ กระดาษคำตอบ และเฉลย'],
  };

  const tools: Record<string, [string, string, string, string]> = {
    saved: ['saved.php', '🗂', 'คลังใบงาน', 'ชุดใบงานที่สร้างไว้ จัดหมวด ค้นหา ส่งออก'],
    bank: ['bank.php', '🧩', 'คลังข้อสอบ', 'โจทย์รายข้อ เลือกมาประกอบเป็นชุดใหม่'],
    library: ['library.php', '📚', 'คลังเอกสาร', 'อัปโหลดหนังสือเรียน/บทอ่านให้ AI ใช้อ้างอิง'],
    curriculum: ['curriculum.php', '🎯', 'ตัวชี้วัด', 'นำเข้าและจัดการตัวชี้วัดของหลักสูตร'],
    settings: ['settings.php', '⚙️', 'ตั้งค่า AI', 'ใส่คีย์ และเลือกผู้ให้บริการ/โมเดลของแต่ละเมนู'],
    setup: ['check_setup.php', '🩺', 'ตรวจระบบ', 'ตรวจว่าไฟล์ครบ เขียนข้อมูลได้ และตั้งค่า AI แล้ว'],
  };

  const title = (steps[active] || tools[active] || [null, null, 'ผู้ช่วยครู AI'])[2];

  const renderLink = (k: string, x: [string, string, string, string]) => {
    const on = k === active;
    return `<a class="nl${on ? ' on' : ''}" href="${x[0]}" title="${x[3]}"${on ? ' aria-current="page"' : ''}>` +
      `<span class="ic" aria-hidden="true">${x[1]}</span><span>${x[2]}</span></a>`;
  };

  let h = '<nav class="topnav no-print" id="topnav" aria-label="เมนูหลัก">' +
    '<div class="navbar"><button type="button" class="burger" id="burger" aria-label="เปิดเมนู" aria-expanded="false" aria-controls="navmenu"><span></span><span></span><span></span></button>' +
    `<span class="navtitle">${title}</span></div>` +
    '<div class="navscrim" id="navscrim"></div>' +
    '<div class="navmenu" id="navmenu">' +
    '<a class="brand" href="home.php"><b>ผู้ช่วยครู AI</b><span>แผนการสอน ใบงาน และข้อสอบ</span></a>' +
    '<div class="navrow"><div class="navlabel">ขั้นตอนการทำงาน</div>';

  for (const [k, x] of Object.entries(steps)) {
    h += renderLink(k, x);
  }
  h += '</div><div class="navrow"><div class="navlabel">คลังและเครื่องมือ</div>';
  for (const [k, x] of Object.entries(tools)) {
    h += renderLink(k, x);
  }

  const js = `(function(){var n=document.getElementById("topnav"),b=document.getElementById("burger");if(!n||!b)return;` +
    `function set(o){n.classList.toggle("open",o);b.setAttribute("aria-expanded",o?"true":"false");b.setAttribute("aria-label",o?"ปิดเมนู":"เปิดเมนู");document.documentElement.classList.toggle("nav-lock",o);}` +
    `b.addEventListener("click",function(){set(!n.classList.contains("open"));});` +
    `document.getElementById("navscrim").addEventListener("click",function(){set(false);});` +
    `n.addEventListener("click",function(e){if(e.target.closest("a.nl"))set(false);});` +
    `document.addEventListener("keydown",function(e){if(e.key==="Escape"&&n.classList.contains("open")){set(false);b.focus();}});` +
    `window.addEventListener("resize",function(){if(innerWidth>960)set(false);});})();`;

  return h + `</div><div class="navfoot">ผลงานจาก AI ครูควรตรวจทานก่อนใช้ทุกครั้ง</div></div></nav><script>${js}</script>`;
}

export function renderHomePage(counts = { terms: 0, lplans: 0, saved: 0, bank: 0, library: 0, exams: 0 }): string {
  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>เริ่มต้นใช้งาน · ผู้ช่วยครู AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<div class="app">
  ${navHtml('home')}
  <h1>เริ่มต้นใช้งาน</h1>
  <p class="sub">เครื่องมือช่วยครูวางแผนการสอนและสร้างใบงานตามหลักสูตรแกนกลางฯ โดยให้ <b>แผนการจัดการเรียนรู้</b> เป็นแกนหลัก แล้วสร้างใบงาน ใบความรู้ และเฉลยให้สอดคล้องกับแผนนั้น</p>

  <div class="panel">
    <strong>ขั้นตอนที่แนะนำ</strong>
    <div class="steps">
      <a class="stepcard" href="term.php"><span class="no">1</span><b>แผนภาคเรียน</b><span>ให้ AI ร่างหัวข้อรายสัปดาห์ทั้งภาคเรียน ผูกตัวชี้วัด (ข้ามได้ถ้าวางแผนเองแล้ว)</span><em>บันทึกแล้ว ${counts.terms} แผน</em></a>
      <a class="stepcard" href="lplan.php"><span class="no">2</span><b>แผนการสอน</b><span>เลือกเรื่องที่จะสอน ให้ AI ร่างแผนการจัดการเรียนรู้ ครูตรวจแก้ พิมพ์/Word ได้</span><em>บันทึกแล้ว ${counts.lplans} แผน</em></a>
      <a class="stepcard" href="index.php"><span class="no">3</span><b>สร้างใบงาน</b><span>กด “สร้างใบงานตามแผน” จากข้อ 2 หรือสร้างเองจากหัวข้อก็ได้ ได้ใบงาน เฉลย ใบความรู้ พิมพ์เป็น PDF</span><em>เปิดหน้าสร้างใบงาน</em></a>
      <a class="stepcard" href="book.php"><span class="no">4</span><b>รวมเล่ม</b><span>รวมใบงานหลายชุดเป็นเล่มเดียว มีปก คำนำ สารบัญ และเฉลยท้ายเล่ม</span><em>รวมเล่ม</em></a>
      <a class="stepcard" href="exam.php"><span class="no">5</span><b>ข้อสอบ</b><span>สร้างข้อสอบกลางภาค/ปลายภาค มีตารางวิเคราะห์ สลับข้อหลายชุด กระดาษคำตอบ และเฉลย</span><em>บันทึกแล้ว ${counts.exams} ฉบับ</em></a>
    </div>
    <p style="font-size:13px;color:var(--muted);margin:10px 0 0">ไม่ต้องทำครบทุกขั้น เริ่มจากขั้นไหนก็ได้ เช่น ถ้ามีแผนการสอนของตัวเองแล้ว ข้ามไปขั้น 3 ได้เลย</p>
  </div>

  <div class="panel">
    <strong>คลังของคุณ</strong>
    <div class="steps" style="margin-top:8px">
      <a class="stepcard" href="saved.php"><b>🗂 คลังใบงาน</b><span>ชุดใบงานที่สร้างไว้ จัดหมวด ค้นหา ส่งออก zip</span><em>${counts.saved} ชุด</em></a>
      <a class="stepcard" href="bank.php"><b>🧩 คลังข้อสอบ</b><span>เก็บโจทย์รายข้อ แล้วเลือกมาประกอบเป็นชุดใหม่</span><em>${counts.bank} ข้อ</em></a>
      <a class="stepcard" href="library.php"><b>📚 คลังเอกสาร</b><span>อัปโหลดหนังสือเรียน/บทอ่านให้ AI ใช้อ้างอิง</span><em>${counts.library} เอกสาร</em></a>
      <a class="stepcard" href="settings.php"><b>⚙️ ตั้งค่า AI</b><span>ใส่คีย์ และเลือกผู้ให้บริการ/โมเดลของแต่ละเมนู</span><em>ตั้งค่า</em></a>
      <a class="stepcard" href="curriculum.php"><b>🎯 ตัวชี้วัด</b><span>นำเข้าตัวชี้วัดจากไฟล์หลักสูตรทางการ</span><em>จัดการตัวชี้วัด</em></a>
    </div>
  </div>

  <div class="panel">
    <strong>เช็กความพร้อมของระบบ</strong>
    <div style="margin-top:6px">
      <div class="chk"><span class="ic">✅</span><div><div><b>ระบบพร้อมใช้งานบน Node.js Runtime</b></div><small>เซิร์ฟเวอร์ Express ให้บริการ API และหน้าเว็บครบทุกโมดูล</small></div></div>
      <div class="chk"><span class="ic">✅</span><div><div><b>Google Gemini API</b></div><small>รองรับการเชื่อมต่อกับ Gemini ในการสร้างแผนการสอน ใบงาน และข้อสอบ</small></div></div>
      <div class="chk"><span class="ic">✅</span><div><div><b>โฟลเดอร์จัดเก็บข้อมูล data</b></div><small>สามารถเขียนและบันทึกใบงาน แผนการสอน และข้อสอบได้</small></div></div>
    </div>
    <p style="font-size:13px;color:var(--muted);margin:8px 0 0">รายละเอียดเพิ่มเติม: <a href="check_setup.php" style="color:var(--pink)">🩺 ตรวจระบบ</a></p>
  </div>

  <div class="panel" style="font-size:14px">
    <strong>ข้อควรรู้</strong>
    <ul style="margin:6px 0 0;padding-left:20px;line-height:1.7">
      <li>เนื้อหาที่ AI สร้างเป็นร่างช่วยครู ควรตรวจทานทุกครั้งก่อนใช้สอน (เฉลย ตัวเลข ข้อเท็จจริง)</li>
      <li>ระบบอ้างอิงหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน ไม่ใช่เอกสารที่ผ่านการรับรองจากหน่วยงานใด</li>
      <li>ข้อมูลทั้งหมดเก็บในระบบของคุณ สำรองได้ด้วยปุ่มส่งออก zip ในคลังใบงาน</li>
    </ul>
  </div>
</div>
</body>
</html>`;
}

export function renderIndexPage(): string {
  const types = [
    { id: 'multiple_choice', label: 'ปรนัย 4 ตัวเลือก' },
    { id: 'fill_blank', label: 'เติมคำในช่องว่าง' },
    { id: 'matching', label: 'จับคู่' },
    { id: 'true_false', label: 'ถูก / ผิด' },
    { id: 'ordering', label: 'เรียงลำดับ' },
    { id: 'short_answer', label: 'ตอบสั้น' },
    { id: 'calculation', label: 'คำนวณแสดงวิธีทำ' },
    { id: 'multi_statement', label: 'ปรนัยเลือกข้อความถูก (1, 2, 3)' },
    { id: 'data_set', label: 'ชุดคำถามจากข้อมูล/กราฟ' },
    { id: 'exam', label: 'แบบทดสอบ 2 ตอน (ปรนัย+อัตนัย)' }
  ];

  const provOpts = [
    { id: 'gemini', label: 'Google Gemini', ready: true },
    { id: 'openai', label: 'OpenAI', ready: false },
    { id: 'openrouter', label: 'OpenRouter', ready: false }
  ];

  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ตัวสร้างใบงานด้วย AI · ผู้ช่วยครู AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/vendor/katex/katex.min.css">
</head>
<body>
<div class="app">
  <div id="jserr" class="error hidden"></div>
  <div class="no-print">
    ${navHtml('index')}
    <div class="row" style="justify-content:space-between">
      <h1>สร้างใบงาน</h1>
    </div>
    <p class="sub">บอกเรื่องที่จะสอน เลือกจำนวนใบและรูปแบบโจทย์ แล้วกดสร้าง จะได้ใบงาน เฉลย และภาพประกอบพร้อมพิมพ์เป็น PDF</p>

    <div class="panel form">
      <section class="sec">
        <h2 class="sec-h"><span class="no">1</span>เรื่องที่จะสอน</h2>
        <div class="grid">
        <label class="f">ชั้น
          <select id="grade">
            ${['ป.1','ป.2','ป.3','ป.4','ป.5','ป.6','ม.1','ม.2','ม.3','ม.4','ม.5','ม.6'].map(g => `<option${g === 'ป.2' ? ' selected' : ''}>${g}</option>`).join('')}
          </select>
        </label>
        <label class="f">วิชา
          <select id="subject"><option selected>วิทยาศาสตร์และเทคโนโลยี</option></select>
        </label>
        <label class="f">ภาคเรียน
          <select id="termSel"><option value="">ทุกภาคเรียน</option><option value="1">ภาคเรียนที่ 1</option><option value="2">ภาคเรียนที่ 2</option></select>
        </label>
        </div>
        <div class="grid" style="margin-top:16px">
        <label class="f">หน่วยการเรียนรู้
          <select id="unit"><option value="">— เลือกหน่วยการเรียนรู้ —</option></select>
        </label>
        <label class="f">หัวข้อของใบงาน
          <input type="text" id="topic" value="วัฏจักรของพืช">
        </label>
        <div id="lpBar" class="hidden lpbar" style="grid-column:1/-1">📝 สร้างตามแผนการจัดการเรียนรู้: <b id="lpTitle"></b> <a id="lpOpen" href="#" style="color:var(--pink)">เปิดแผน</a> <button type="button" class="ghost small" id="lpClear">เลิกใช้แผนนี้</button><div style="font-size:12px;color:var(--muted)">ใบงานและใบความรู้จะยึดสาระสำคัญ จุดประสงค์ และสาระการเรียนรู้ของแผนนี้</div></div>
        </div>
        <p class="help">เลือกหน่วยการเรียนรู้แล้วระบบเติมหัวข้อให้ แก้ไขหรือพิมพ์หัวข้อเองได้</p>
      </section>

      <section class="sec">
        <h2 class="sec-h"><span class="no">2</span>ชุดใบงาน</h2>
        <div class="grid">
        <label class="f">จำนวนใบงาน (1–20)
          <input type="number" id="count" min="1" max="20" value="4">
        </label>
        <label class="f">ข้อต่อใบ (3–20)
          <input type="number" id="itemCount" min="3" max="20" value="5">
        </label>
        <label class="f">ระดับความยาก
          <select id="difficulty">
            <optgroup label="ระดับเดียวทั้งใบ">
              <option value="easy">ง่าย</option>
              <option value="medium" selected>ปานกลาง</option>
              <option value="hard">ยาก</option>
              <option value="expert">ยากมาก</option>
            </optgroup>
            <optgroup label="ผสมหลายระดับ (แบ่งจำนวนข้อตามสัดส่วน)">
              <option value="mix:review">ทบทวน (ง่าย 50 / กลาง 40 / ยาก 10)</option>
              <option value="mix:std">มาตรฐาน (ง่าย 20 / กลาง 50 / ยาก 30)</option>
              <option value="mix:exam">เตรียมสอบ (ง่าย 10 / กลาง 30 / ยาก 40 / ยากมาก 20)</option>
              <option value="mix:contest">แข่งขัน (กลาง 20 / ยาก 40 / ยากมาก 40)</option>
              <option value="mix:custom">กำหนดสัดส่วนเอง…</option>
            </optgroup>
          </select>
        </label>
        </div>
        <div id="mixBox" class="hidden" style="margin-top:10px">
        <div class="row">
          <span style="font-size:14px;font-weight:600">สัดส่วนข้อ (%)</span>
          <label style="font-size:13px;font-weight:400">ง่าย <input type="number" id="mixEasy" min="0" max="100" value="20" style="width:70px"></label>
          <label style="font-size:13px;font-weight:400">ปานกลาง <input type="number" id="mixMedium" min="0" max="100" value="40" style="width:70px"></label>
          <label style="font-size:13px;font-weight:400">ยาก <input type="number" id="mixHard" min="0" max="100" value="30" style="width:70px"></label>
          <label style="font-size:13px;font-weight:400">ยากมาก <input type="number" id="mixExpert" min="0" max="100" value="10" style="width:70px"></label>
          <span id="mixSum" style="font-size:12px;color:var(--muted)"></span>
        </div>
      </div>
        <label id="beyondRow" class="hidden" style="display:flex;gap:8px;align-items:center;font-weight:400;font-size:13px;margin-top:8px"><input type="checkbox" id="beyond"> ให้ข้อระดับ “ยากมาก” เกินขอบเขตเนื้อหาของชั้นได้ (เทียบข้อสอบแข่งขัน) ไม่ติ๊ก = ยากด้วยการคิด แต่อยู่ในเนื้อหาของชั้นนี้</label>
        <div style="margin-top:18px;font-weight:600;font-size:14px">รูปแบบโจทย์ <span class="help" style="display:inline;margin:0">เลือกได้หลายแบบ ระบบสลับให้แต่ละใบ เปลี่ยนชั้นประถม/มัธยมแล้วระบบเลือกแบบที่เหมาะให้ใหม่</span></div>
        <div class="types" id="types">${types.map(t => `<label class="chip on"><input type="checkbox" value="${t.id}" checked> ${t.label}</label>`).join('')}</div>
      </section>

      <details class="sec" id="indBox" open>
        <summary><h2 class="sec-h"><span class="no">3</span>ตัวชี้วัดที่ต้องการวัด <small id="indCount"></small></h2></summary>
        <div id="indList" style="margin-top:8px;font-size:14px"></div>
        <div class="row" style="margin-top:6px;font-size:13px">
          <button type="button" class="ghost small" id="indAll">เลือกทั้งหมด</button>
          <button type="button" class="ghost small" id="indNone">ไม่เลือก</button>
          <label style="font-weight:400;display:flex;gap:6px;align-items:center"><input type="checkbox" id="showInd" checked> พิมพ์รหัสตัวชี้วัดในใบงาน</label>
          <a href="curriculum.php" style="color:var(--pink)">จัดการตัวชี้วัด</a>
        </div>
      </details>

      <details class="sec">
        <summary><h2 class="sec-h"><span class="no">4</span>ตัวเลือกเพิ่มเติม <small>รูปแบบเอกสาร รูปประกอบ ใบความรู้ บทอ่าน หัวกระดาษ</small></h2></summary>
        <div class="grid">
        <label class="f">รูปแบบเอกสาร
          <select id="docStyle">
            <option value="auto" selected>อัตโนมัติตามชั้น (ป. = น่ารัก, ม. = ทางการ)</option>
            <option value="kid">น่ารัก (ประถม)</option>
            <option value="formal">ทางการ (มัธยม)</option>
          </select>
        </label>
        <label class="f">รูปประกอบ (กราฟ แผนภาพ ตาราง)
          <select id="figureMode">
            <option value="code" selected>ระบบวาดกราฟ/แผนภาพเอง (แม่นยำ) + AI วาดภาพทั่วไป</option>
            <option value="ai">ให้ AI สร้างภาพทั้งหมด</option>
            <option value="none">ไม่ใช้รูปประกอบ</option>
          </select>
        </label>
        <label class="f">บทอ่านจากคลังเอกสาร (ใส่ตรงตามต้นฉบับ)
          <select id="passage"><option value="">— ไม่ใช้บทอ่าน —</option></select>
        </label>
        <label class="f">เอกสารอ้างอิงจากคลัง
          <select id="refMode">
            <option value="auto" selected>ใช้ท่อนที่เกี่ยวข้องอัตโนมัติ (ตามชั้น/วิชา)</option>
            <option value="off">ไม่ใช้</option>
          </select>
        </label>
        </div>
        <div id="passNote" class="help">บทอ่านที่เลือกจะใช้กับทุกใบในชุดนี้ AI สร้างเฉพาะคำถามจากบทอ่าน (เพิ่มบทอ่านได้ที่ <a href="library.php">คลังเอกสาร</a>)</div>
        <label class="check" style="margin-top:14px"><input type="checkbox" id="withLesson"> สร้างใบความรู้ (บทเรียน) คู่กับใบงานทุกใบ</label>
        <div id="hdrBox" style="margin-top:18px">
          <div style="font-weight:600;font-size:14px;margin-bottom:8px">หัวกระดาษ <span class="help" style="display:inline">ใช้กับสไตล์ทางการและแบบทดสอบ</span></div>
          <div class="grid">
          <label class="f">ชื่อโรงเรียน<input type="text" id="hSchool" maxlength="120" placeholder="เช่น โรงเรียน…วิทยา"></label>
          <label class="f">รหัสวิชา<input type="text" id="hCourse" maxlength="30" placeholder="เช่น ว30201"></label>
          <label class="f">ชื่อครูผู้สอน<input type="text" id="hTeacher" maxlength="80" placeholder="เช่น นาย…"></label>
          <label class="f">เวลาสอบ (นาที)<input type="number" id="hMinutes" min="0" max="300" placeholder="สำหรับแบบทดสอบ"></label>
          </div>
        </div>
      </details>

      <details class="sec" id="aiBox">
        <summary><h2 class="sec-h"><span class="no">5</span>AI ที่ใช้ <small id="aiSummary">Google Gemini</small></h2></summary>
        <div class="grid">
        <label class="f">AI สร้างเนื้อหา + ตรวจทาน
          <select id="textProvider">
            ${provOpts.map(o => `<option value="${o.id}"${o.id === 'gemini' ? ' selected' : ''}>${o.label}</option>`).join('')}
          </select>
        </label>
        <label class="f">AI สร้างภาพ
          <select id="imageProvider">
            ${provOpts.map(o => `<option value="${o.id}"${o.id === 'gemini' ? ' selected' : ''}>${o.label}</option>`).join('')}
          </select>
        </label>
        </div>
        <label class="check" style="margin-top:14px"><input type="checkbox" id="doReview" checked> ให้ AI ตรวจทานเฉลยอีกรอบ</label>
        <p class="help">สามารถตั้งค่าผู้ให้บริการ/โมเดลและใส่ API Key ได้ที่ <a href="settings.php">ตั้งค่า AI</a></p>
      </details>

      <div class="actionbar">
        <button id="startBtn" class="big">สร้างใบงาน</button>
        <button id="stopBtn" type="button" class="stopBtn big ghost hidden" title="หยุดการสร้างทันที">⏹ หยุด</button>
        <p class="help">สร้างทีละใบ เห็นผลทันทีด้านล่าง ระบบบันทึกชุดให้อัตโนมัติ</p>
      </div>
    </div>

    <details class="panel" id="savedBox" style="margin-top:14px">
      <summary style="cursor:pointer;font-weight:600">ชุดใบงานที่บันทึกไว้ล่าสุด <span id="savedCount" style="font-weight:400;color:var(--muted)"></span></summary>
      <div id="savedList" style="margin-top:10px;font-size:14px">กำลังโหลด…</div>
      <div style="font-size:12px;color:var(--muted);margin-top:6px">ระบบบันทึกชุดใบงานให้อัตโนมัติเมื่อสร้างเสร็จ เปิดกลับมาแก้/พิมพ์ได้ภายหลัง</div>
    </details>

    <div id="error" class="error hidden"></div>

    <div id="toolbar" class="panel hidden">
      <div class="row" style="justify-content:space-between">
        <strong id="progressText"></strong>
        <div class="row">
          <button type="button" class="stopBtn ghost hidden">⏹ หยุด</button>
          <button id="viewBoth" title="พิมพ์/บันทึก PDF เป็นไฟล์เดียว">ใบงาน + เฉลย</button>
          <button id="viewWs" class="ghost">ใบงาน</button>
          <button id="viewAns" class="ghost">เฉลย</button>
          <button id="retryImgs" class="ghost hidden">ลองสร้างภาพที่ขาดใหม่</button>
          <button id="printBtn">พิมพ์ / บันทึกเป็น PDF</button>
        </div>
      </div>
      <div class="row" style="margin-top:8px">
        <button id="appendBtn" class="ghost small">＋ สร้างเพิ่มต่อท้าย</button>
        <button id="regenAllBtn" class="ghost small">↻ สร้างทั้งชุดใหม่</button>
        <button id="copyBtn" class="ghost small">⧉ บันทึกเป็นสำเนาใหม่</button>
        <button id="onlineWsBtn" type="button" class="ghost small" style="background:#eff6ff;color:#1d4ed8;border-color:#93c5fd;font-weight:700">🌐 แปลงเป็นข้อสอบออนไลน์</button>
        <a href="book.php" class="small" style="font-size:13px;font-weight:600;color:var(--pink)">📖 รวมเป็นเล่ม</a>
      </div>
      <div id="onlineWsBox" class="hidden" style="margin-top:10px;padding:10px 12px;background:#eff6ff;border:1px solid #93c5fd;border-radius:10px;font-size:13px"></div>
      <div class="progress"><div id="progressBar" style="width:0"></div></div>
      <div id="waitNote" style="font-size:13px;color:#7a5b00;min-height:1.2em"></div>
      <div id="imgErr" style="font-size:13px;color:#b00020"></div>
      <div id="saveNote" style="font-size:13px;color:var(--muted)"></div>
    </div>
  </div>

  <div class="pages" id="pages"></div>
</div>
<script>
window.SHEET_TYPES = ${JSON.stringify(types)};
window.TYPE_DEFAULTS = {
  primary: ['multiple_choice', 'fill_blank', 'matching', 'true_false', 'ordering'],
  secondary: ['multiple_choice', 'short_answer', 'calculation', 'multi_statement', 'data_set', 'exam']
};
window.LEVEL_PRESETS = {
  std: { easy: 20, medium: 50, hard: 30, expert: 0 },
  exam: { easy: 10, medium: 30, hard: 40, expert: 20 },
  review: { easy: 50, medium: 40, hard: 10, expert: 0 },
  contest: { easy: 0, medium: 20, hard: 40, expert: 40 }
};
</script>
<script src="assets/js/data/curriculum.js"></script>
<script src="assets/vendor/katex/katex.min.js"></script>
<script src="assets/vendor/katex/auto-render.min.js"></script>
<script src="assets/js/shared/render.js"></script>
<script src="assets/js/pages/app.js"></script>
</body>
</html>`;
}

export function renderTermPage(): string {
  const types: Record<string, string> = {
    multiple_choice: 'ปรนัย 4 ตัวเลือก',
    fill_blank: 'เติมคำในช่องว่าง',
    matching: 'จับคู่',
    true_false: 'ถูก / ผิด',
    ordering: 'เรียงลำดับ',
    short_answer: 'ตอบสั้น',
    calculation: 'คำนวณแสดงวิธีทำ',
    multi_statement: 'ปรนัยเลือกข้อความถูก (1, 2, 3)',
    data_set: 'ชุดคำถามจากข้อมูล/กราฟ',
    exam: 'แบบทดสอบ 2 ตอน (ปรนัย+อัตนัย)'
  };

  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>แผนทั้งภาคเรียน · ผู้ช่วยครู AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<style>#tbl td,#tbl th{padding:4px 5px}#tbl input[type=text],#tbl select{width:100%;min-width:0;padding:6px 7px;font-size:13px}#tbl select{max-width:130px}#tbl th:nth-child(1){width:64px}#tbl th:nth-child(6){width:140px}#tbl th:nth-child(7){width:110px}@media print{.topnav,.no-print{display:none!important}.panel{box-shadow:none;border:0}select,input{border:0!important;background:none!important;appearance:none}}</style>
</head>
<body>
<div class="app">
  <div id="jserr" class="error hidden"></div>
  ${navHtml('term')}
  <h1>แผนทั้งภาคเรียน</h1>
  <p class="sub">ให้ AI ช่วยร่างแผนรายสัปดาห์จากหน่วยการเรียนรู้และตัวชี้วัดของชั้น/วิชานั้น (ครูแก้ไขได้ทุกช่อง) แล้วกด “สร้างใบงาน” ของแต่ละสัปดาห์ ระบบจะเปิดหน้าสร้างใบงานพร้อมหัวข้อ รูปแบบ และตัวชี้วัดที่เลือกให้</p>

  <div class="panel no-print">
    <div class="grid">
      <label class="f">ชั้น<select id="grade"></select></label>
      <label class="f">วิชา<select id="subject"></select></label>
      <label class="f">ภาคเรียน<select id="term"><option value="">ทุกหน่วย</option><option value="1">ภาคเรียนที่ 1</option><option value="2">ภาคเรียนที่ 2</option></select></label>
      <label class="f">จำนวนสัปดาห์ (1-24)<input type="number" id="weeks" min="1" max="24" value="18"></label>
      <label class="f">สัปดาห์ทบทวน<input type="number" id="review" min="0" max="4" value="1"></label>
      <label class="f">สัปดาห์สอบ<input type="number" id="exam" min="0" max="4" value="2"></label>
      <label class="f" style="grid-column:span 3">ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)<input type="text" id="hint" maxlength="300" placeholder="เช่น เน้นกิจกรรมปฏิบัติ / ช่วงสัปดาห์ที่ 5 มีวันหยุดยาว"></label>
    </div>
    <div id="unitNote" style="font-size:12px;color:var(--muted);margin-top:6px"></div>
    <div class="row" style="margin-top:12px"><button id="gen">ให้ AI ร่างแผน</button><button type="button" class="ghost hidden" id="stopGen">⏹ หยุด</button><span id="genNote" class="sub" style="margin:0"></span></div>
  </div>

  <div class="panel hidden" id="planBox">
    <div class="row" style="justify-content:space-between">
      <label class="f" style="flex:1;min-width:220px">ชื่อแผน<input type="text" id="title" maxlength="120"></label>
      <span class="row no-print"><button id="save">บันทึกแผน</button><button class="ghost" id="print">พิมพ์</button><span id="saveNote" class="sub" style="margin:0"></span></span>
    </div>
    <div id="cov" style="font-size:13px;margin:8px 0"></div>
    <div style="overflow-x:auto"><table class="tbl" id="tbl"><thead><tr><th>สัปดาห์</th><th>หน่วย</th><th>หัวข้อ</th><th>ประเภท</th><th>ชนิดใบงาน</th><th>ตัวชี้วัด</th><th>หมายเหตุ</th><th class="no-print"></th></tr></thead><tbody></tbody></table></div>
    <div class="row no-print" style="margin-top:8px"><button class="ghost small" id="addRow">＋ เพิ่มแถว</button></div>
  </div>

  <div class="panel no-print"><strong>แผนที่บันทึกไว้</strong><div id="saved" style="margin-top:8px;font-size:14px">กำลังโหลด…</div></div>
</div>
<script src="assets/js/data/curriculum.js"></script>
<script src="assets/js/shared/common.js"></script>
<script>window.SHEET_TYPE_LABELS = ${JSON.stringify(types)};</script>
<script src="assets/js/pages/term.js"></script>
</body>
</html>`;
}

export function renderLplanPage(): string {
  const types: Record<string, string> = {
    multiple_choice: 'ปรนัย 4 ตัวเลือก',
    fill_blank: 'เติมคำในช่องว่าง',
    matching: 'จับคู่',
    true_false: 'ถูก / ผิด',
    ordering: 'เรียงลำดับ',
    short_answer: 'ตอบสั้น',
    calculation: 'คำนวณแสดงวิธีทำ',
    multi_statement: 'ปรนัยเลือกข้อความถูก (1, 2, 3)',
    data_set: 'ชุดคำถามจากข้อมูล/กราฟ',
    exam: 'แบบทดสอบ 2 ตอน (ปรนัย+อัตนัย)'
  };

  const models = {
    '3stage': { label: 'ขั้นนำ - ขั้นสอน - ขั้นสรุป (มาตรฐาน 3 ขั้น)' },
    '5e': { label: 'การสืบเสาะหาความรู้ 5E (วิทยาศาสตร์)' },
    'gpas': { label: 'GPAS 5 Steps (คิดขั้นสูง)' },
    'active': { label: 'Active Learning (ปฏิบัติ/โครงงาน)' }
  };

  const comps = [
    'ความสามารถในการสื่อสาร',
    'ความสามารถในการคิด',
    'ความสามารถในการแก้ปัญหา',
    'ความสามารถในการใช้ทักษะชีวิต',
    'ความสามารถในการใช้เทคโนโลยี'
  ];

  const traits = [
    'รักชาติ ศาสน์ กษัตริย์',
    'ซื่อสัตย์สุจริต',
    'มีวินัย',
    'ใฝ่เรียนรู้',
    'อยู่อย่างพอเพียง',
    'มุ่งมั่นในการทำงาน',
    'รักความเป็นไทย',
    'มีจิตสาธารณะ'
  ];

  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>แผนการจัดการเรียนรู้ · ผู้ช่วยครู AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=Sarabun:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<style>
  .lp-doc{background:#fff;width:210mm;max-width:100%;margin:0 auto;padding:18mm 18mm 20mm;border:1px solid var(--line);box-shadow:0 2px 10px rgba(0,0,0,.05);font-family:"Sarabun",sans-serif;font-size:15px;line-height:1.6;color:#111}
  .lp-doc h2{text-align:center;font-size:20px;margin:0 0 6px}
  .lp-doc .hd{text-align:center;margin-bottom:12px}
  .lp-doc .hd div{margin:1px 0}
  .lp-doc h3{font-size:16px;margin:14px 0 4px}
  .lp-doc h4{font-size:15px;margin:6px 0 2px 14px}
  .lp-doc ol,.lp-doc ul{margin:2px 0 2px 34px;padding:0}
  .lp-doc p{margin:2px 0 2px 18px;text-indent:24px}
  .lp-doc table{width:100%;border-collapse:collapse;margin:6px 0;font-size:14px;page-break-inside:auto}
  .lp-doc th,.lp-doc td{border:1px solid #555;padding:5px 7px;vertical-align:top;text-align:left}
  .lp-doc th{background:#f2f2f2;text-align:center}
  .lp-doc tr{page-break-inside:avoid}
  .lp-doc .dots{border-bottom:1px dotted #555;height:26px}
  .lp-doc .sign{margin:18px 0 0 50%;text-align:center}
  .lp-doc .muted{color:#666}
  .lp-ed textarea{width:100%;min-height:70px;font-size:14px}
  .lp-ed input[type=text],.lp-ed input[type=number]{width:100%}
  .lp-ed .sec{border-top:1px solid #eee;padding-top:10px;margin-top:12px}
  .lp-ed .sec > b{display:block;margin-bottom:6px}
  .lp-ed .g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
  .lp-ed .stage{border:1px solid #eee;border-radius:10px;padding:10px;margin-bottom:8px}
  .ideas .idea{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0e6ea}
  @media print{
    body{background:#fff}
    .app{max-width:none;padding:0}
    .app > *:not(#docWrap){display:none!important}
    #docWrap > *:not(#doc){display:none!important}
    .lp-doc{border:0;box-shadow:none;width:auto;padding:0;font-size:15px}
    @page{size:A4;margin:18mm 18mm 18mm 22mm}
  }
</style>
</head>
<body>
<div class="app">
  <div id="jserr" class="error hidden"></div>
  ${navHtml('lplan')}
  <h1>แผนการจัดการเรียนรู้</h1>
  <p class="sub">เริ่มจากแผนการสอน: ให้ AI ร่างแผนตามหลักสูตร (จุดประสงค์ สาระการเรียนรู้ กิจกรรม การวัดผล) ครูตรวจแก้ แล้วกด “สร้างใบงานตามแผน”</p>

  <div class="panel" id="formBox">
    <div class="grid">
      <label class="f">ชั้น<select id="grade"></select></label>
      <label class="f">วิชา<select id="subject"></select></label>
      <label class="f">ภาคเรียน<select id="term"><option value="">—</option><option value="1">1</option><option value="2">2</option></select></label>
      <label class="f">ปีการศึกษา<input type="text" id="year" maxlength="4" placeholder="เช่น 2569"></label>
      <label class="f" style="grid-column:span 2">หน่วยการเรียนรู้<select id="unit"></select></label>
      <label class="f">หน่วยที่<input type="text" id="unitNo" maxlength="5" placeholder="เช่น 1"></label>
      <label class="f">แผนที่<input type="text" id="planNo" maxlength="5" placeholder="เช่น 1"></label>
      <label class="f" style="grid-column:span 2">เรื่องที่สอน<input type="text" id="topic" maxlength="200" placeholder="เช่น การบวกเศษส่วนที่ตัวส่วนเท่ากัน"></label>
      <label class="f">จำนวนชั่วโมง<input type="number" id="hours" min="1" max="10" value="1"></label>
      <label class="f">นาทีต่อคาบ<input type="number" id="periodMinutes" min="30" max="120" value="50"></label>
      <label class="f" style="grid-column:span 2">รูปแบบการจัดกิจกรรม<select id="model">
        ${Object.entries(models).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join('')}
      </select></label>
      <label class="f">โรงเรียน<input type="text" id="school" maxlength="150"></label>
      <label class="f">ครูผู้สอน<input type="text" id="teacher" maxlength="120"></label>
      <label class="f">เอกสารอ้างอิงจากคลัง<select id="refMode"><option value="auto">ใช้ท่อนที่เกี่ยวข้อง</option><option value="off">ไม่ใช้</option></select></label>
      <label class="f" style="grid-column:1/-1">ข้อเสนอแนะเพิ่มเติม (ไม่บังคับ)<input type="text" id="hint" maxlength="500" placeholder="เช่น นักเรียนอ่อนเรื่องการหาร เน้นสื่อของจริง / ห้องเรียนมี 40 คน"></label>
    </div>
    <details id="indBox" style="margin-top:12px" open>
      <summary style="cursor:pointer;font-weight:600;font-size:14px">🎯 ตัวชี้วัด <span id="indCount" style="font-weight:400;color:var(--muted)"></span></summary>
      <div id="indList" style="margin-top:8px;font-size:14px"></div>
    </details>
    <div class="row" style="margin-top:14px"><button id="gen">ให้ AI ร่างแผนการจัดการเรียนรู้</button><button type="button" class="ghost hidden" id="stopGen">⏹ หยุด</button><button class="ghost" id="blank">เริ่มจากแผนว่าง</button><span id="genNote" class="sub" style="margin:0"></span></div>
  </div>

  <div id="docWrap" class="hidden">
    <div class="panel no-print">
      <div class="row" style="justify-content:space-between">
        <span class="row">
          <button id="save">💾 บันทึก</button>
          <button class="ghost" id="modeBtn">✎ แก้ไข</button>
          <button class="ghost" id="printBtn">🖨 พิมพ์ / PDF</button>
          <button class="ghost" id="wordBtn">⬇ Word</button>
          <button class="ghost" id="regen" title="ร่างใหม่ทั้งแผนด้วยค่าด้านบน">↻ ร่างใหม่</button>
        </span>
        <span id="saveNote" class="sub" style="margin:0"></span>
      </div>
      <div class="ideas" style="margin-top:12px">
        <div class="row" style="justify-content:space-between"><strong>ใบงานตามแผนนี้</strong><button id="makeAll">➡ สร้างใบงานทั้งหมดตามแผน</button></div>
        <div id="ideas" style="font-size:14px;margin-top:4px"></div>
      </div>
    </div>
    <div id="editor" class="panel lp-ed hidden no-print"></div>
    <div id="doc" class="lp-doc"></div>
  </div>

  <div class="panel no-print" style="margin-top:20px">
    <div class="row" style="justify-content:space-between"><strong>แผนที่บันทึกไว้</strong>
      <span class="row"><select id="fGrade"><option value="">ทุกชั้น</option></select><select id="fSubject"><option value="">ทุกวิชา</option></select><select id="fTerm"><option value="">ทุกภาคเรียน</option><option value="1">ภาคเรียนที่ 1</option><option value="2">ภาคเรียนที่ 2</option></select><input type="search" id="fQ" placeholder="ค้นหา"></span></div>
    <div id="saved" style="margin-top:8px;font-size:14px">กำลังโหลด…</div>
  </div>
</div>
<script src="assets/js/data/curriculum.js"></script>
<script src="assets/js/shared/common.js"></script>
<script>
window.SHEET_TYPE_LABELS = ${JSON.stringify(types)};
window.LP_MODELS = ${JSON.stringify(models)};
window.LP_COMPETENCIES = ${JSON.stringify(comps)};
window.LP_TRAITS = ${JSON.stringify(traits)};
</script>
<script src="assets/js/pages/lplan.js"></script>
</body>
</html>`;
}

export function renderSavedPage(): string {
  return renderPageFromFile('saved.php', 'saved', 'คลังใบงาน');
}

export function renderBankPage(): string {
  return renderPageFromFile('bank.php', 'bank', 'คลังข้อสอบ');
}

export function renderBookPage(): string {
  return renderPageFromFile('book.php', 'book', 'รวมใบงานเป็นเล่ม');
}

export function renderExamPage(): string {
  return renderPageFromFile('exam.php', 'exam', 'สร้างข้อสอบ');
}

export function renderLibraryPage(): string {
  return renderPageFromFile('library.php', 'library', 'คลังเอกสารอ้างอิง');
}

export function renderCurriculumPage(): string {
  return renderPageFromFile('curriculum.php', 'curriculum', 'หลักสูตรและตัวชี้วัด');
}

export function renderSettingsPage(): string {
  return renderPageFromFile('settings.php', 'settings', 'ตั้งค่า AI');
}

export function renderSchedulePage(): string {
  return renderPageFromFile('schedule.php', 'settings', 'จัดตารางสอนด้วย AI');
}

export function renderResultsPage(): string {
  return renderPageFromFile('results.php', 'saved', 'ผลการมอบหมาย');
}

export function renderCheckSetupPage(): string {
  return renderPageFromFile('check_setup.php', 'setup', 'ตรวจระบบ');
}

export function renderCheckModelsPage(): string {
  return renderPageFromFile('check_models.php', 'setup', 'ตรวจโมเดล AI');
}

export function renderOnlineExamPage(): string {
  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ระบบสอบออนไลน์ · ผู้ช่วยครู AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/vendor/katex/katex.min.css">
<style>
  body { background: #f1f5f9; font-family: 'Sarabun', sans-serif; }
  .oe-shell { max-width: 860px; margin: 0 auto; padding: 16px; }
  .oe-banner { background: #fff; border: 2px solid #334155; border-radius: 14px; padding: 18px 22px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(15,23,42,0.06); }
  .oe-banner h1 { margin: 0 0 6px; font-size: 22px; color: #0f172a; text-align: center; }
  .oe-meta { text-align: center; color: #475569; font-size: 14px; margin-bottom: 12px; }
  .oe-timer-bar { display: flex; justify-content: space-between; align-items: center; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 8px 14px; font-size: 14px; font-weight: 600; color: #1e40af; }
  .oe-student-box { background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .oe-qcard { background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.03); }
  .oe-qhead { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .oe-qno { background: #1e293b; color: #fff; font-weight: 700; padding: 3px 10px; border-radius: 6px; font-size: 13px; }
  .oe-qtext { font-size: 16px; font-weight: 600; color: #0f172a; line-height: 1.55; margin-bottom: 10px; }
  .oe-fig { text-align: center; margin: 10px 0 12px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; }
  .oe-fig svg, .oe-fig img { max-width: 100%; max-height: 210px; height: auto; display: inline-block; }
  .oe-choices { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media (max-width: 640px) { .oe-choices { grid-template-columns: 1fr; } }
  .oe-choice { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; cursor: pointer; background: #f8fafc; transition: all .15s; font-size: 15px; }
  .oe-choice:hover { border-color: #60a5fa; background: #eff6ff; }
  .oe-choice input { margin-top: 4px; transform: scale(1.15); }
  .oe-input { width: 100%; padding: 10px 12px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 15px; }
  .oe-fb { margin-top: 10px; padding: 10px 12px; border-radius: 8px; font-size: 14px; }
  .oe-fb.ok { background: #dcfce7; border: 1px solid #86efac; color: #14532d; }
  .oe-fb.wrong { background: #fee2e2; border: 1px solid #fca5a5; color: #7f1d1d; }
  .oe-result-card { background: #ecfdf5; border: 2px solid #10b981; border-radius: 14px; padding: 18px 20px; margin-bottom: 16px; text-align: center; color: #064e3b; }
  .oe-result-score { font-size: 28px; font-weight: 700; color: #047857; margin: 6px 0; }
</style>
</head>
<body>
<div class="oe-shell">
  ${navHtml('exam')}
  <div id="oeApp">
    <div class="panel" style="text-align:center;padding:30px">กำลังโหลดข้อสอบออนไลน์…</div>
  </div>
</div>
<script src="assets/vendor/katex/katex.min.js"></script>
<script src="assets/vendor/katex/auto-render.min.js"></script>
<script>
(() => {
  const LET = ['ก', 'ข', 'ค', 'ง', 'จ', 'ฉ'];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nl = (s) => esc(s).replace(/\\n/g, '<br>');
  const appEl = document.getElementById('oeApp');
  const qs = new URLSearchParams(location.search);
  const examId = qs.get('id') || '';
  let startTime = Date.now();
  let timerHandle = null;

  function renderFig(fig) {
    if (!fig) return '';
    const s = String(fig).trim();
    if (!s) return '';
    if (s.startsWith('<svg')) return '<div class="oe-fig">' + s + '</div>';
    if (s.startsWith('http') || s.startsWith('data:') || s.startsWith('api/')) {
      return '<div class="oe-fig"><img src="' + esc(s) + '" alt="ภาพประกอบข้อสอบ"></div>';
    }
    return '';
  }

  function typeset(el) {
    if (typeof window.renderMathInElement !== 'function') return;
    try {
      window.renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\\\(', right: '\\\\)', display: false },
        ],
        throwOnError: false,
      });
    } catch {}
  }

  async function init() {
    try {
      const res = await fetch('api/online_exam.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get', id: examId }),
      });
      const data = await res.json();
      if (!res.ok || !data.exam) {
        appEl.innerHTML = '<div class="panel"><h2 style="margin-top:0">ไม่พบข้อสอบออนไลน์</h2><p>กรุณาสร้างข้อสอบจากหน้า <a href="exam.php" style="color:var(--pink);font-weight:700">สร้างข้อสอบ</a> หรือ <a href="index.php" style="color:var(--pink);font-weight:700">สร้างใบงาน</a> แล้วกดแปลงเป็นข้อสอบออนไลน์</p></div>';
        return;
      }
      renderExam(data.exam);
    } catch (e) {
      appEl.innerHTML = '<div class="panel error">เกิดข้อผิดพลาดในการโหลดข้อสอบออนไลน์: ' + esc(e.message) + '</div>';
    }
  }

  function renderExam(exam) {
    document.title = exam.title + ' · ข้อสอบออนไลน์';
    const questions = Array.isArray(exam.questions) ? exam.questions : [];
    let remainSec = (Number(exam.minutes) || 45) * 60;

    const qHtml = questions.map((q, idx) => {
      const fig = renderFig(q.figure);
      if (q.type === 'mc' || q.type === 'tf') {
        const chs = (q.choices || []).map((c, ci) =>
          '<label class="oe-choice"><input type="radio" name="ans_' + esc(q.id) + '" value="' + ci + '"><span><b>' + (q.type === 'mc' ? LET[ci] + '.' : '') + '</b> ' + nl(c) + '</span></label>'
        ).join('');
        return '<div class="oe-qcard" id="qcard_' + esc(q.id) + '">' +
          '<div class="oe-qhead"><span class="oe-qno">ข้อที่ ' + (idx + 1) + '</span><span style="font-size:13px;color:#64748b">' + (q.indicator ? esc(q.indicator) + ' · ' : '') + (q.score || 1) + ' คะแนน</span></div>' +
          '<div class="oe-qtext">' + nl(q.question) + '</div>' +
          fig +
          '<div class="oe-choices">' + chs + '</div>' +
          '<div class="oe-fb hidden" id="fb_' + esc(q.id) + '"></div>' +
        '</div>';
      }
      return '<div class="oe-qcard" id="qcard_' + esc(q.id) + '">' +
        '<div class="oe-qhead"><span class="oe-qno">ข้อที่ ' + (idx + 1) + '</span><span style="font-size:13px;color:#64748b">' + (q.score || 1) + ' คะแนน</span></div>' +
        '<div class="oe-qtext">' + nl(q.question) + '</div>' +
        fig +
        '<input type="text" class="oe-input" name="ans_' + esc(q.id) + '" placeholder="พิมพ์คำตอบของคุณ…">' +
        '<div class="oe-fb hidden" id="fb_' + esc(q.id) + '"></div>' +
      '</div>';
    }).join('');

    appEl.innerHTML =
      '<div class="oe-banner">' +
        (exam.school ? '<div style="text-align:center;font-weight:700;color:#334155;margin-bottom:4px">' + esc(exam.school) + '</div>' : '') +
        '<h1>' + esc(exam.title) + '</h1>' +
        '<div class="oe-meta">วิชา' + esc(exam.subject) + ' · ชั้น' + esc(exam.grade) + ' · จำนวน ' + questions.length + ' ข้อ · คะแนนเต็ม ' + exam.totalScore + ' คะแนน</div>' +
        '<div class="oe-timer-bar">' +
          '<span id="oeAnsweredStatus">ตอบแล้ว 0 / ' + questions.length + ' ข้อ</span>' +
          '<span id="oeTimer">⏱ เวลาที่เหลือ ' + (exam.minutes || 45) + ':00 นาที</span>' +
        '</div>' +
      '</div>' +
      '<div id="oeResultBanner" class="hidden"></div>' +
      '<div class="oe-student-box">' +
        '<div class="grid">' +
          '<label class="f" style="grid-column:span 2">ชื่อ-นามสกุล นักเรียน<input type="text" id="stName" placeholder="กรอกชื่อ-นามสกุล" value="เด็กชายรักเรียน เพียรศึกษา"></label>' +
          '<label class="f">ชั้น/ห้อง<input type="text" id="stClass" value="' + esc(exam.grade || '') + '"></label>' +
          '<label class="f">เลขที่<input type="text" id="stNo" value="1"></label>' +
        '</div>' +
      '</div>' +
      '<div id="oeQuestions">' + qHtml + '</div>' +
      '<div class="panel" style="text-align:center">' +
        '<button type="button" class="big" id="btnSubmitOnline">✅ ส่งคำตอบและตรวจผลคะแนนทันที</button>' +
      '</div>';

    typeset(appEl);

    function updateProgress() {
      let done = 0;
      questions.forEach((q) => {
        if (q.type === 'mc' || q.type === 'tf') {
          if (appEl.querySelector('input[name="ans_' + q.id + '"]:checked')) done++;
        } else {
          const inp = appEl.querySelector('input[name="ans_' + q.id + '"]');
          if (inp && inp.value.trim()) done++;
        }
      });
      const el = document.getElementById('oeAnsweredStatus');
      if (el) el.textContent = 'ตอบแล้ว ' + done + ' / ' + questions.length + ' ข้อ';
    }
    appEl.addEventListener('change', updateProgress);
    appEl.addEventListener('input', updateProgress);

    if (timerHandle) clearInterval(timerHandle);
    timerHandle = setInterval(() => {
      if (remainSec > 0) remainSec--;
      const m = String(Math.floor(remainSec / 60)).padStart(2, '0');
      const s = String(remainSec % 60).padStart(2, '0');
      const tEl = document.getElementById('oeTimer');
      if (tEl) tEl.textContent = '⏱ เวลาที่เหลือ ' + m + ':' + s + ' นาที';
    }, 1000);

    document.getElementById('btnSubmitOnline').addEventListener('click', async () => {
      const btn = document.getElementById('btnSubmitOnline');
      const answers = {};
      questions.forEach((q) => {
        if (q.type === 'mc' || q.type === 'tf') {
          const chk = appEl.querySelector('input[name="ans_' + q.id + '"]:checked');
          if (chk) answers[q.id] = Number(chk.value);
        } else {
          const inp = appEl.querySelector('input[name="ans_' + q.id + '"]');
          if (inp) answers[q.id] = inp.value;
        }
      });

      btn.disabled = true;
      btn.textContent = 'กำลังตรวจคำตอบ…';
      try {
        const res = await fetch('api/online_exam.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'submit',
            id: exam.id,
            studentName: document.getElementById('stName').value.trim() || 'นักเรียน',
            studentClass: document.getElementById('stClass').value.trim(),
            studentNo: document.getElementById('stNo').value.trim(),
            answers,
            durationSec: Math.round((Date.now() - startTime) / 1000),
          }),
        });
        const out = await res.json();
        if (!res.ok) throw new Error(out.error || 'ส่งคำตอบไม่สำเร็จ');
        if (timerHandle) clearInterval(timerHandle);

        const sub = out.submission;
        const rb = document.getElementById('oeResultBanner');
        rb.classList.remove('hidden');
        rb.className = 'oe-result-card';
        rb.innerHTML =
          '<div>🎉 <b>ส่งกระดาษคำตอบเรียบร้อยแล้ว!</b> (' + esc(sub.studentName) + ' ชั้น ' + esc(sub.studentClass) + ')</div>' +
          '<div class="oe-result-score">ได้คะแนน ' + sub.score + ' / ' + sub.totalScore + ' คะแนน (' + sub.percent + '%)</div>' +
          '<div>ตอบถูก ' + sub.correctCount + ' ข้อ จากทั้งหมด ' + sub.totalItems + ' ข้อ · ดูเฉลยและคำอธิบายรายข้อด้านล่าง</div>';

        (out.results || []).forEach((r) => {
          const fb = document.getElementById('fb_' + r.id);
          if (!fb) return;
          fb.classList.remove('hidden');
          fb.className = 'oe-fb ' + (r.isCorrect ? 'ok' : 'wrong');
          const corr = typeof r.correctAnswer === 'number' ? LET[r.correctAnswer] : r.correctAnswer;
          fb.innerHTML = (r.isCorrect ? '✅ <b>ถูกต้อง!</b> (+' + r.score + ' คะแนน)' : '❌ <b>ยังไม่ถูกต้อง</b> · เฉลยที่ถูกคือ: <b>' + esc(String(corr)) + '</b>') +
            (r.explain ? '<div style="margin-top:4px;font-size:13px">' + nl(r.explain) + '</div>' : '');
        });

        rb.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) {
        btn.disabled = false;
        btn.textContent = '✅ ส่งคำตอบและตรวจผลคะแนนทันที';
      }
    });
  }

  init();
})();
</script>
</body>
</html>`;
}

function renderPageFromFile(fileName: string, navActive: string, fallbackTitle: string): string {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    return `<!doctype html><html><body><h1>${fallbackTitle}</h1></body></html>`;
  }
  let content = fs.readFileSync(filePath, 'utf-8');

  // Strip initial PHP block up to <!doctype html>
  const doctypeIndex = content.indexOf('<!doctype html>');
  if (doctypeIndex !== -1) {
    content = content.slice(doctypeIndex);
  }

  // Replace <?= nav_html('...') ?> with real navHtml
  content = content.replace(/<\?=\s*nav_html\(['"](\w+)['"]\)\s*\?>/g, (_, act) => navHtml(act || navActive));

  // Replace PHP versioning <?= $v ?>
  content = content.replace(/<\?=\s*\$v\s*\?>/g, '1');

  // Replace json_encode types
  const types: Record<string, string> = {
    multiple_choice: 'ปรนัย 4 ตัวเลือก',
    fill_blank: 'เติมคำในช่องว่าง',
    matching: 'จับคู่',
    true_false: 'ถูก / ผิด',
    ordering: 'เรียงลำดับ',
    short_answer: 'ตอบสั้น',
    calculation: 'คำนวณแสดงวิธีทำ',
    multi_statement: 'ปรนัยเลือกข้อความถูก (1, 2, 3)',
    data_set: 'ชุดคำถามจากข้อมูล/กราฟ',
    exam: 'แบบทดสอบ 2 ตอน (ปรนัย+อัตนัย)'
  };
  content = content.replace(/<\?=\s*json_encode\(\$types[^)]*\)\s*\?>/g, JSON.stringify(types));

  // Remove any remaining PHP tags cleanly
  content = content.replace(/<\?php[\s\S]*?\?>/g, '');
  content = content.replace(/<\?=[\s\S]*?\?>/g, '');

  return content;
}
