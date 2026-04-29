
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2500);
}

function filterSearch(query) {
  const q = query.trim().toLowerCase();
  const rows = document.querySelectorAll('#mainTable tbody tr');
  rows.forEach(row => {
    const patient  = row.querySelector('.patient-main').textContent.toLowerCase();
    const chartNo  = row.querySelector('.patient-sub').textContent.toLowerCase();
    const reqId    = row.cells[0].textContent.toLowerCase();
    const priority = row.cells[3].textContent.toLowerCase();
    const matches  = patient.includes(q) || chartNo.includes(q) || reqId.includes(q) || priority.includes(q);
    row.style.display = (q === '' || matches) ? '' : 'none';
  });
}

function toggleDropdown(id) {
  const dd = document.getElementById(id);
  const allDDs = document.querySelectorAll('.dropdown-menu-custom');
  allDDs.forEach(d => { if (d.id !== id) d.classList.remove('open'); });
  dd.classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown-wrap')) {
    document.querySelectorAll('.dropdown-menu-custom').forEach(d => d.classList.remove('open'));
  }
  if (!e.target.closest('.cliniq-overlay')) return;
  if (e.target.classList.contains('cliniq-overlay')) {
    e.target.classList.remove('open');
  }
});

function selectPriority(btn, val) {
  document.querySelectorAll('#ddPriority button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('btnPriority').innerHTML = val + ' <i class="bi bi-chevron-down"></i>';
  document.getElementById('ddPriority').classList.remove('open');

  const rows = document.querySelectorAll('#mainTable tbody tr');
  rows.forEach(row => {
    if (val === 'All Priorities') {
      row.style.display = '';
    } else {
      const statusText = row.cells[4].textContent.trim().toUpperCase();
      row.style.display = statusText === val.toUpperCase() ? '' : 'none';
    }
  });

  showToast('Priority filter: ' + val);
}

function selectDate(btn, val) {
  document.querySelectorAll('#ddDate button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('btnDate').innerHTML = val + ' <i class="bi bi-chevron-down"></i>';
  document.getElementById('ddDate').classList.remove('open');
  showToast('Date filter: ' + val);
}

function exportCSV() {
  const rows = document.querySelectorAll('#mainTable tbody tr');
  let csv = 'Req ID,Submitted,Patient,Chart No,Priority,Status,TAT\n';
  rows.forEach(row => {
    const cells     = row.cells;
    const reqId     = cells[0].textContent.trim();
    const submitted = cells[1].textContent.trim();
    const patient   = cells[2].querySelector('.patient-main').textContent.trim();
    const chartNo   = cells[2].querySelector('.patient-sub').textContent.trim();
    const priority  = cells[3].textContent.trim();
    const status    = cells[4].textContent.trim();
    const tat       = cells[5].textContent.trim();
    csv += `"${reqId}","${submitted}","${patient}","${chartNo}","${priority}","${status}","${tat}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'test-catalogue.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully');
}

function printBatch() {
  showToast('Sending to printer…');
  setTimeout(() => window.print(), 400);
}

function getPatient(btn) {
  const row = btn.closest('tr');
  return row.querySelector('.patient-main').textContent.trim();
}


function handleStart(btn) {
  const patient = getPatient(btn);
  document.getElementById('smPatient').value = patient;
  document.getElementById('smSuccessOverlay').classList.remove('visible');
  document.getElementById('startOverlay').classList.add('open');
  document.getElementById('startOverlay')._triggerBtn = btn;
}

function closeStartModal() {
  document.getElementById('startOverlay').classList.remove('open');
}

function smShowTagInput() {
  document.getElementById('smTagAddBtn').style.display = 'none';
  document.getElementById('smTagInputWrap').style.display = 'flex';
  document.getElementById('smTagInputField').focus();
}
function smAddTag() {
  const input = document.getElementById('smTagInputField');
  const val = input.value.trim();
  if (!val) return;
  const container = document.getElementById('smTags');
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.dataset.name = val;
  tag.innerHTML = `${val} <span class="tag-remove" onclick="this.closest('.tag').remove()">✕</span>`;
  container.insertBefore(tag, document.getElementById('smTagAddBtn'));
  input.value = '';
  document.getElementById('smTagInputWrap').style.display = 'none';
  document.getElementById('smTagAddBtn').style.display = '';
}
function smTagKeydown(e) {
  if (e.key === 'Enter') smAddTag();
  if (e.key === 'Escape') {
    document.getElementById('smTagInputWrap').style.display = 'none';
    document.getElementById('smTagAddBtn').style.display = '';
  }
}

function smValidate() {
  let ok = true;
  [
    { id: 'smPatient',   err: 'smErrPatient' },
    { id: 'smDob',       err: 'smErrDob' },
    { id: 'smChart',     err: 'smErrChart' },
    { id: 'smPhysician', err: 'smErrPhysician' },
  ].forEach(({ id, err }) => {
    const el    = document.getElementById(id);
    const errEl = document.getElementById(err);
    if (!el.value.trim()) {
      el.classList.add('invalid');
      errEl.classList.add('show');
      ok = false;
    } else {
      el.classList.remove('invalid');
      errEl.classList.remove('show');
    }
  });
  const tags   = document.querySelectorAll('#smTags .tag');
  const errTags = document.getElementById('smErrTags');
  if (tags.length === 0) { errTags.classList.add('show'); ok = false; }
  else { errTags.classList.remove('show'); }
  const tech    = document.getElementById('smTech');
  const errTech = document.getElementById('smErrTech');
  if (!tech.value) { errTech.classList.add('show'); ok = false; }
  else { errTech.classList.remove('show'); }
  return ok;
}

function smHandleConfirm() {
  if (!smValidate()) {
    showToast('Please fill in all required fields.');
    return;
  }
  const tech = document.getElementById('smTech').value;
  document.getElementById('smSuccessSub').textContent =
    `REQ-2026001 has been assigned to ${tech}.`;
  document.getElementById('smSuccessOverlay').classList.add('visible');
}

function smDone() {

  const btn = document.getElementById('startOverlay')._triggerBtn;
  if (btn) {
    const row = btn.closest('tr');
    row.cells[5].innerHTML = '<span class="tat-processing">Processing</span>';
    row.querySelector('.actions-wrap').innerHTML = `
      <button class="act-complete" onclick="handleComplete(this)">Complete</button>
      <button class="act-view" onclick="handleView(this)">View</button>
    `;
  }
  closeStartModal();
  showToast('Marked as Processing!');
}

function handleView(btn) {
  const patient = getPatient(btn);
  document.getElementById('vPatientName').textContent = patient;
  document.getElementById('vStatusBadge').textContent = 'Processing';
  document.getElementById('vStatusBadge').classList.remove('completed');
  document.getElementById('vBtnComplete').disabled = false;
  document.getElementById('vBtnComplete').style.opacity = '';
  document.getElementById('vBtnComplete').style.cursor = '';

  document.getElementById('vDot1').className = 'vstep-dot dot-active';
  document.getElementById('vStep1Title').textContent = 'Processing in progress';
  document.getElementById('vStep1Sub').textContent = 'Assigned to Jose Rizal, RMT · EST. TAT: 4h';
  document.getElementById('vDot2').className = 'vstep-dot dot-pending';
  document.getElementById('vStep2Title').textContent = 'Results ready – pending';
  document.getElementById('vStep2Title').classList.add('muted');
  document.getElementById('vStep2Sub').textContent = '';
  document.getElementById('viewOverlay').classList.add('open');
  document.getElementById('viewOverlay')._triggerBtn = btn;
}

function closeViewModal() {
  document.getElementById('viewOverlay').classList.remove('open');
}

function vMarkComplete() {
  const badge = document.getElementById('vStatusBadge');
  badge.textContent = 'Completed';
  badge.classList.add('completed');

  document.getElementById('vDot1').classList.replace('dot-active', 'dot-done');
  document.getElementById('vDot2').classList.replace('dot-pending', 'dot-active');
  document.getElementById('vStep1Title').textContent = 'Processing complete';
  const s2t = document.getElementById('vStep2Title');
  s2t.textContent = 'Results ready';
  s2t.classList.remove('muted');
  const now = new Date();
  document.getElementById('vStep2Sub').textContent =
    now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const btn = document.getElementById('vBtnComplete');
  btn.disabled      = true;
  btn.style.opacity = '0.6';
  btn.style.cursor  = 'not-allowed';

  const triggerBtn = document.getElementById('viewOverlay')._triggerBtn;
  if (triggerBtn) {
    const row = triggerBtn.closest('tr');
    row.cells[5].innerHTML = '<span class="tat-completed">Completed</span>';
    row.querySelector('.actions-wrap').innerHTML = `
      <button class="act-pdf" onclick="handlePdf(this)">PDF <i class="bi bi-download"></i></button>
    `;
  }
}

function handleComplete(btn) {
  const row     = btn.closest('tr');
  const patient = getPatient(btn);
  row.cells[5].innerHTML = '<span class="tat-completed">Completed</span>';
  row.querySelector('.actions-wrap').innerHTML = `
    <button class="act-pdf" onclick="handlePdf(this)">PDF <i class="bi bi-download"></i></button>
  `;
  showToast('Completed: ' + patient);
}


function handlePdf(btn) {
  const patient = getPatient(btn);
  showToast('Downloading PDF for: ' + patient);
}


const numPages = 3;
let currentPage = 1;

function changePage(btn, direction) {
  const pgBtns  = document.querySelectorAll('.pg-btn');
  const numbered = Array.from(pgBtns).filter(b => !isNaN(parseInt(b.textContent)));

  if (direction !== undefined) {
    const next = currentPage + direction;
    if (next < 1 || next > numPages) return;
    currentPage = next;
  } else {
    currentPage = parseInt(btn.textContent);
  }

  numbered.forEach(b => {
    b.classList.toggle('active', parseInt(b.textContent) === currentPage);
  });

  document.getElementById('pageLabel').textContent = 'Showing ' + currentPage + ' of 12 tests';
  showToast('Page ' + currentPage);
}