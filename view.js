function startEdit(field, type) {
  const fv = document.getElementById('fv-' + field);
  const current = fv.textContent.trim();
  fv.onclick = null;

  if (type === 'select') {
    const sel = document.createElement('select');
    sel.className = 'field-edit-select';
    ['STAT', 'Routine', 'Urgent'].forEach(opt => {
      const o = document.createElement('option');
      o.value = opt; o.textContent = opt;
      if (opt === current) o.selected = true;
      sel.appendChild(o);
    });
    fv.textContent = '';
    fv.appendChild(sel);
    sel.focus();
    sel.onblur = () => commitField(fv, sel.value, field, type);
  } else {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'field-edit-input';
    inp.value = current;
    fv.textContent = '';
    fv.appendChild(inp);
    inp.focus();
    inp.select();
    inp.onblur    = () => commitField(fv, inp.value.trim() || current, field, type);
    inp.onkeydown = e => {
      if (e.key === 'Enter')  inp.blur();
      if (e.key === 'Escape') commitField(fv, current, field, type);
    };
  }
}

function commitField(fv, value, field, type) {
  fv.textContent = value;
  fv.onclick = () => startEdit(field, type);
}

function editNotes() {
  const display = document.getElementById('notesDisplay');
  const editor  = document.getElementById('notesEditor');
  const actions = document.getElementById('notesActions');
  editor.value          = display.textContent.trim();
  display.style.display = 'none';
  editor.style.display  = 'block';
  actions.style.display = 'flex';
  editor.focus();
}

function saveNotes() {
  const display = document.getElementById('notesDisplay');
  const editor  = document.getElementById('notesEditor');
  const actions = document.getElementById('notesActions');
  display.textContent   = editor.value.trim() || display.textContent.trim();
  display.style.display = 'block';
  editor.style.display  = 'none';
  actions.style.display = 'none';
}

function cancelNotes() {
  document.getElementById('notesDisplay').style.display = 'block';
  document.getElementById('notesEditor').style.display  = 'none';
  document.getElementById('notesActions').style.display = 'none';
}

function markComplete() {
  document.getElementById('completeModal').classList.add('open');
}

function doMarkComplete() {
  const badge = document.getElementById('statusBadge');
  badge.textContent      = 'Completed';
  badge.style.background = '#d4f5d4';
  badge.style.color      = '#1a7a1a';

  document.getElementById('dot1').classList.replace('dot-active', 'dot-done');
  document.getElementById('dot2').classList.replace('dot-pending', 'dot-active');
  document.getElementById('step1title').textContent = 'Processing complete';

  const s2t = document.getElementById('step2title');
  s2t.textContent = 'Results ready';
  s2t.classList.remove('muted');

  const now = new Date();
  document.getElementById('step2sub').textContent =
    now.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) +
    ', ' + now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });

  const btn = document.getElementById('btnComplete');
  btn.disabled      = true;
  btn.style.opacity = '0.6';
  btn.style.cursor  = 'not-allowed';
}

function openCloseModal() {
  document.getElementById('closeModal').classList.add('open');
}

function doClose() {
  document.getElementById('requestCard').style.display = 'none';
  document.getElementById('closeModal').classList.remove('open');
}

document.getElementById('btnX').addEventListener('click', openCloseModal);
document.getElementById('btnClose').addEventListener('click', openCloseModal);

document.getElementById('closeModalCancel').addEventListener('click', () => {
  document.getElementById('closeModal').classList.remove('open');
});
document.getElementById('closeModalConfirm').addEventListener('click', doClose);

document.getElementById('closeModal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('open');
});

document.getElementById('completeModalCancel').addEventListener('click', () => {
  document.getElementById('completeModal').classList.remove('open');
});

document.getElementById('completeModalConfirm').addEventListener('click', () => {
  document.getElementById('completeModal').classList.remove('open');
  doMarkComplete();
});

document.getElementById('completeModal').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('open');
});