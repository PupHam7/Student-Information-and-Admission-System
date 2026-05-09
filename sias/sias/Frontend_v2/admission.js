const capsInputs = document.querySelectorAll(".caps");
capsInputs.forEach(input => {
  input.addEventListener("input", function () {
    this.value = this.value.toUpperCase();
  });
});

const lrnInput = document.getElementById('iLRN');
if (lrnInput) {
  lrnInput.addEventListener('keypress', function (e) {
    if (!/\d/.test(e.key)) e.preventDefault();
  });
  lrnInput.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
  });
}

let isControlNumberValid = false;

function generateControlNumber() {
  let n = '';
  for (let i = 0; i < 16; i++) {
    n += Math.floor(Math.random() * 10);
  }
  return n;
}

function toggleControlNo() {
  const checkbox = document.getElementById('newApplicantCheck');
  const controlRow = document.getElementById('controlRow');
  const hint = document.getElementById('hNewApplicant');
  if (checkbox.checked) {
    document.getElementById('ctrlNo').textContent = generateControlNumber();
    controlRow.style.display = 'block';
    isControlNumberValid = true;
    if (hint) hint.textContent = '';
    checkbox.disabled = true;
  } else {
    controlRow.style.display = 'none';
    document.getElementById('ctrlNo').textContent = '';
    isControlNumberValid = false;
  }
}

function openPopup(id) {
  document.getElementById(id).classList.add('open');
}

function closePopup(id) {
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.popup-overlay').forEach(overlay => {
  overlay.addEventListener('click', function (e) {
    if (e.target === this) {
      this.classList.remove('open');
    }
  });
});

function setErr(inputId, hintId, message) {
  const el = document.getElementById(inputId);
  const hint = hintId ? document.getElementById(hintId) : null;
  if (message) {
    if (el) el.classList.add('err');
    if (hint) hint.textContent = message;
    return true;
  } else {
    if (el) el.classList.remove('err');
    if (hint) hint.textContent = '';
    return false;
  }
}

function showInstructionMessage(type) {
  const messageDiv = document.getElementById('instructionMessage');
  if (!type) {
    messageDiv.style.display = 'none';
    return;
  }
  let message = '';
  switch (type) {
    case 'Freshman':
      message = 'You selected as a FRESHMAN. Please fill out the "High School / Senior High School" section below. The "Last School Attended" section is not required for you.';
      break;
    case 'PEPT/ALS Graduate':
      message = 'You selected as a PEPT/ALS GRADUATE. Please fill out the "High School / Senior High School" section below. The "Last School Attended" section is not required for you.';
      break;
    case 'Transferee':
      message = 'You selected as a TRANSFEREE. Please fill out the "Last School Attended" section below. The "High School / Senior High School" section is not required for you.';
      break;
    case 'Shifter':
      message = 'You selected as a SHIFTER. Please fill out the "Last School Attended" section below. The "High School / Senior High School" section is not required for you.';
      break;
    case 'Returnee':
      message = 'You selected as a RETURNEE. Please fill out the "Last School Attended" section below. The "High School / Senior High School" section is not required for you.';
      break;
    default:
      messageDiv.style.display = 'none';
      return;
  }
  messageDiv.innerHTML = message;
  messageDiv.style.display = 'flex';
  setTimeout(() => {
    if (messageDiv.style.display === 'flex') {
      messageDiv.style.opacity = '0.8';
      setTimeout(() => {
        messageDiv.style.display = 'none';
        messageDiv.style.opacity = '1';
      }, 500);
    }
  }, 8000);
}

function toggleFieldsByType() {
  const type = document.getElementById('admAs').value;
  const isTransShifterReturnee = (type === 'Transferee' || type === 'Shifter' || type === 'Returnee');
  const isFreshman = (type === 'Freshman');

  const lsBaseFields = ['tSchoolName', 'tSchoolAddr', 'tLastYear', 'tLastLevel', 'tGWA'];
  const lrnField = document.getElementById('iLRN');
  const lrnAsterisk = document.getElementById('lrnAsterisk');
  const tProgramField = document.getElementById('tProgramField');
  const tProgram = document.getElementById('tProgram');
  const strandContainer = document.getElementById('strandContainer');
  const shsStrand = document.getElementById('shsStrand');

  showInstructionMessage(type);

  const yearSel = document.getElementById('iYearLevel');
  if (yearSel) {
    if (isFreshman) {
      yearSel.value = '1';
      yearSel.disabled = true;
      yearSel.style.opacity = '0.7';
      yearSel.style.background = '#e8e8e8';
      setErr('iYearLevel', 'hYearLevel', '');
    } else {
      yearSel.disabled = false;
      yearSel.style.opacity = '1';
      yearSel.style.background = '#fafafa';
    }
  }

  lsBaseFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.disabled = false;
      field.required = true;
      field.style.opacity = '1';
      field.style.background = '#fafafa';
    }
  });

  const lastLevelInput = document.getElementById('tLastLevel');

  if (isTransShifterReturnee) {
    if (tProgramField) tProgramField.style.display = '';
    if (tProgram) {
      tProgram.disabled = false;
      tProgram.required = true;
      tProgram.style.opacity = '1';
      tProgram.style.background = '#fafafa';
    }
    if (strandContainer) strandContainer.style.display = 'none';
    if (shsStrand) { shsStrand.value = ''; shsStrand.disabled = true; shsStrand.required = false; shsStrand.classList.remove('err'); setErr('shsStrand', 'hShsStrand', ''); }
    lrnField.disabled = false;
    lrnField.required = false;
    lrnAsterisk.style.display = 'none';
    lrnField.style.opacity = '1';
    lrnField.style.background = '#fafafa';
    setErr('iLRN', 'hLRN', '');
    if (lastLevelInput) lastLevelInput.placeholder = 'e.g. 1st Year, 2nd Year';

  } else if (isFreshman) {
    if (tProgramField) tProgramField.style.display = 'none';
    if (tProgram) { tProgram.value = ''; tProgram.disabled = true; tProgram.required = false; tProgram.classList.remove('err'); setErr('tProgram', 'hTProgram', ''); }
    if (strandContainer) strandContainer.style.display = '';
    if (shsStrand) {
      shsStrand.disabled = false;
      shsStrand.required = true;
      shsStrand.style.opacity = '1';
      shsStrand.style.background = '#fafafa';
    }
    lrnField.disabled = false;
    lrnField.required = true;
    lrnAsterisk.style.display = 'inline';
    lrnField.style.opacity = '1';
    lrnField.style.background = '#fafafa';
    if (lastLevelInput) lastLevelInput.placeholder = 'e.g. Grade 12';

  } else {
    if (tProgramField) tProgramField.style.display = 'none';
    if (tProgram) { tProgram.value = ''; tProgram.disabled = true; tProgram.required = false; tProgram.classList.remove('err'); setErr('tProgram', 'hTProgram', ''); }
    if (strandContainer) strandContainer.style.display = 'none';
    if (shsStrand) { shsStrand.value = ''; shsStrand.disabled = true; shsStrand.required = false; shsStrand.classList.remove('err'); setErr('shsStrand', 'hShsStrand', ''); }
    lrnField.disabled = false;
    lrnField.required = true;
    lrnAsterisk.style.display = 'inline';
    lrnField.style.opacity = '1';
    lrnField.style.background = '#fafafa';
    if (lastLevelInput) lastLevelInput.placeholder = 'e.g. Grade 12';
  }
}

const PSGC = 'https://psgc.gitlab.io/api';
const COUNTRIES_API = 'https://restcountries.com/v3.1/all?fields=name,demonyms';
let cachedCountryNames = null;
let cachedNationalityList = null;
let countryToDemonymMap = null;

const ADDRESS_GRIDS = {
  home: {
    country: { sel: 'pCountry', hint: 'hCountry' },
    region: { sel: 'pRegion', hint: 'hRegion' },
    province: { sel: 'pProvince', hint: 'hProvince' },
    municipality: { sel: 'pMunicipality', hint: 'hMunicipality' },
    barangay: { sel: 'pBarangay', hint: 'hBarangay' }
  },
  present: {
    country: { sel: 'paCountry', hint: 'hPaCountry' },
    region: { sel: 'paRegion', hint: 'hPaRegion' },
    province: { sel: 'paProvince', hint: 'hPaProvince' },
    municipality: { sel: 'paMunicipality', hint: 'hPaMunicipality' },
    barangay: { sel: 'paBarangay', hint: 'hPaBarangay' }
  }
};

const FOREIGN_HINTS = {
  region: 'e.g. State / Province',
  province: 'e.g. County / District',
  municipality: 'e.g. City / Town',
  barangay: 'e.g. ZIP / Postal Code'
};

function wireErrClear(id, hintId) {
  const el = document.getElementById(id);
  if (!el) return;
  const evt = el.tagName === 'SELECT' ? 'change' : 'input';
  el.addEventListener(evt, function () {
    if (this.value && this.value.trim() !== '') {
      this.classList.remove('err');
      const h = document.getElementById(hintId);
      if (h) h.textContent = '';
    }
  });
}

function swapEl(oldId, newEl) {
  const old = document.getElementById(oldId);
  if (old && old.parentNode) old.parentNode.replaceChild(newEl, old);
}

function makeAddrSelect(id, placeholder, disabled = true) {
  const sel = document.createElement('select');
  sel.id = id;
  sel.innerHTML = `<option value="">${placeholder}</option>`;
  sel.disabled = disabled;
  return sel;
}

function makeAddrInput(id, placeholder = '') {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.id = id;
  inp.className = 'caps';
  inp.placeholder = placeholder;
  return inp;
}

function populateSelect(id, items, placeholder) {
  const sel = document.getElementById(id);
  if (!sel) return;
  sel.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = '';
  ph.textContent = placeholder;
  ph.disabled = true;
  ph.selected = true;
  ph.hidden = true;
  sel.appendChild(ph);
  items.sort((a, b) => a.name.localeCompare(b.name));
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.code;
    opt.textContent = item.name;
    sel.appendChild(opt);
  });
  sel.disabled = false;
}

function resetAddrSelect(id, placeholder, disable = true) {
  const sel = document.getElementById(id);
  if (!sel || sel.tagName !== 'SELECT') return;
  sel.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = '';
  ph.textContent = placeholder;
  ph.disabled = true;
  ph.selected = true;
  ph.hidden = true;
  sel.appendChild(ph);
  sel.disabled = disable;
  sel.classList.remove('err');
}

function wireCascade(gridKey) {
  const g = ADDRESS_GRIDS[gridKey];
  const rEl = document.getElementById(g.region.sel);
  const pEl = document.getElementById(g.province.sel);
  const mEl = document.getElementById(g.municipality.sel);
  if (rEl) rEl.addEventListener('change', () => onRegionChange(gridKey));
  if (pEl) pEl.addEventListener('change', () => onProvinceChange(gridKey));
  if (mEl) mEl.addEventListener('change', () => onMunicipalityChange(gridKey));
}

function switchToPhMode(gridKey) {
  const g = ADDRESS_GRIDS[gridKey];
  const placeholders = [
    'Loading regions...',
    'Waiting for Region...',
    'Waiting for Province...',
    'Waiting for Municipality...'
  ];
  ['region', 'province', 'municipality', 'barangay'].forEach((key, i) => {
    const cfg = g[key];
    const cur = document.getElementById(cfg.sel);
    if (!cur) return;
    if (cur.tagName !== 'SELECT') {
      swapEl(cfg.sel, makeAddrSelect(cfg.sel, placeholders[i], i > 0));
    } else if (i > 0) {
      resetAddrSelect(cfg.sel, placeholders[i], true);
    }
    setErr(cfg.sel, cfg.hint, '');
    wireErrClear(cfg.sel, cfg.hint);
  });
  loadRegions(gridKey);
  wireCascade(gridKey);
}

function switchToForeignMode(gridKey) {
  const g = ADDRESS_GRIDS[gridKey];
  ['region', 'province', 'municipality', 'barangay'].forEach(key => {
    const cfg = g[key];
    const cur = document.getElementById(cfg.sel);
    if (!cur) return;
    if (cur.tagName === 'SELECT') {
      swapEl(cfg.sel, makeAddrInput(cfg.sel, FOREIGN_HINTS[key]));
    } else {
      cur.value = '';
    }
    setErr(cfg.sel, cfg.hint, '');
    wireErrClear(cfg.sel, cfg.hint);
  });
}

function onCountryChange(gridKey) {
  const g = ADDRESS_GRIDS[gridKey];
  const country = document.getElementById(g.country.sel)?.value;
  if (gridKey === 'home' && country && countryToDemonymMap) {
    const demonym = countryToDemonymMap.get(country);
    if (demonym) {
      const natSel = document.getElementById('pNationality');
      if (natSel && [...natSel.options].some(o => o.value === demonym)) {
        natSel.value = demonym;
        setErr('pNationality', 'hNationality', '');
      }
    }
  }
  if (country === 'Philippines') {
    switchToPhMode(gridKey);
  } else {
    switchToForeignMode(gridKey);
  }
}

function fillNationalitySelects() {
  if (!cachedNationalityList) return;
  ['pNationality', 'pNationality2'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    const currentVal = sel.value;
    sel.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = ''; ph.textContent = 'Select Nationality';
    ph.disabled = true; ph.selected = true; ph.hidden = true;
    sel.appendChild(ph);
    cachedNationalityList.forEach(nat => {
      const opt = document.createElement('option');
      opt.value = nat; opt.textContent = nat;
      sel.appendChild(opt);
    });
    if (selId === 'pNationality' && !currentVal) {
      sel.value = 'Filipino';
    } else if (currentVal) {
      sel.value = currentVal;
    }
  });
  wireErrClear('pNationality', 'hNationality');
  wireErrClear('pNationality2', 'hNationality2');
}

function toggleDualCitizenship() {
  const checked = document.getElementById('dualCitizenCheck').checked;
  const container = document.getElementById('secondNatContainer');
  if (checked) {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
    const nat2 = document.getElementById('pNationality2');
    if (nat2) nat2.value = '';
    setErr('pNationality2', 'hNationality2', '');
  }
}

function toggleSpecifyIP() {
  const val = document.getElementById('pIsIP').value;
  const field = document.getElementById('specifyIPContainer');
  const note = document.getElementById('ipNote');
  if (val === 'Yes') {
    field.style.display = 'flex';
    if (note) note.style.display = 'block';
  } else {
    field.style.display = 'none';
    if (note) note.style.display = 'none';
    const inp = document.getElementById('pSpecifyIP');
    if (inp) inp.value = '';
    setErr('pSpecifyIP', 'hSpecifyIP', '');
  }
}

function togglePWD() {
  const val = document.getElementById('pIsPWD').value;
  const note = document.getElementById('pwdNote');
  if (note) note.style.display = (val === 'Yes') ? 'block' : 'none';
}

async function loadCountries(selectId, gridKey) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="" disabled selected hidden>Loading countries...</option>';
  try {
    const res = await fetch(COUNTRIES_API);
    const data = await res.json();
    const names = data.map(c => c.name.common).filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    cachedCountryNames = names;

    if (!countryToDemonymMap) {
      countryToDemonymMap = new Map();
      const demonymSet = new Set();
      const demonymList = [];
      data.forEach(c => {
        const name = c.name?.common;
        const dem = c.demonyms?.eng?.m || name;
        if (name) countryToDemonymMap.set(name, dem);
        if (dem && !demonymSet.has(dem)) {
          demonymSet.add(dem);
          demonymList.push(dem);
        }
      });
      const sorted = demonymList.filter(d => d !== 'Filipino').sort((a, b) => a.localeCompare(b));
      sorted.unshift('Filipino');
      cachedNationalityList = sorted;
    }

    sel.innerHTML = '';
    const phOpt = document.createElement('option');
    phOpt.value = 'Philippines';
    phOpt.textContent = 'Philippines';
    phOpt.selected = true;
    sel.appendChild(phOpt);
    const sep = document.createElement('option');
    sep.disabled = true;
    sep.textContent = '──────────────────';
    sel.appendChild(sep);
    names.filter(n => n !== 'Philippines').forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      sel.appendChild(opt);
    });
  } catch (e) {
    console.error('Failed to load countries:', e);
    sel.innerHTML = '<option value="Philippines" selected>Philippines</option>';
  }
  sel.addEventListener('change', () => onCountryChange(gridKey));
  wireErrClear(selectId, ADDRESS_GRIDS[gridKey].country.hint);
  onCountryChange(gridKey);
  fillNationalitySelects();
}

async function loadRegions(gridKey) {
  const g = ADDRESS_GRIDS[gridKey];
  resetAddrSelect(g.region.sel, 'Loading regions...', false);
  resetAddrSelect(g.province.sel, 'Waiting for Region...', true);
  resetAddrSelect(g.municipality.sel, 'Waiting for Province...', true);
  resetAddrSelect(g.barangay.sel, 'Waiting for Municipality...', true);
  try {
    const res = await fetch(`${PSGC}/regions/`);
    const data = await res.json();
    populateSelect(g.region.sel, data, 'Select Region');
  } catch (e) {
    console.error('PSGC: failed to load regions', e);
    resetAddrSelect(g.region.sel, 'Failed to load regions', false);
  }
}

async function onRegionChange(gridKey) {
  const g = ADDRESS_GRIDS[gridKey];
  const code = document.getElementById(g.region.sel)?.value;
  resetAddrSelect(g.province.sel, 'Waiting for Region...', true);
  resetAddrSelect(g.municipality.sel, 'Waiting for Province...', true);
  resetAddrSelect(g.barangay.sel, 'Waiting for Municipality...', true);
  setErr(g.province.sel, g.province.hint, '');
  setErr(g.municipality.sel, g.municipality.hint, '');
  setErr(g.barangay.sel, g.barangay.hint, '');
  if (!code) return;
  try {
    const res = await fetch(`${PSGC}/regions/${code}/provinces/`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      const provSel = document.getElementById(g.province.sel);
      if (provSel) {
        provSel.innerHTML = '<option value="NCR" selected>Metro Manila (No Province)</option>';
        provSel.disabled = true;
      }
      try {
        const mRes = await fetch(`${PSGC}/regions/${code}/cities-municipalities/`);
        const mData = await mRes.json();
        populateSelect(g.municipality.sel, mData, 'Select Municipality / City');
      } catch (me) {
        console.error('PSGC: failed to load NCR cities', me);
      }
    } else {
      populateSelect(g.province.sel, data, 'Select Province');
    }
  } catch (e) {
    console.error('PSGC: failed to load provinces', e);
  }
}

async function onProvinceChange(gridKey) {
  const g = ADDRESS_GRIDS[gridKey];
  const code = document.getElementById(g.province.sel)?.value;
  resetAddrSelect(g.municipality.sel, 'Waiting for Province...', true);
  resetAddrSelect(g.barangay.sel, 'Waiting for Municipality...', true);
  setErr(g.municipality.sel, g.municipality.hint, '');
  setErr(g.barangay.sel, g.barangay.hint, '');
  if (!code) return;
  try {
    const res = await fetch(`${PSGC}/provinces/${code}/cities-municipalities/`);
    const data = await res.json();
    populateSelect(g.municipality.sel, data, 'Select Municipality / City');
  } catch (e) {
    console.error('PSGC: failed to load municipalities', e);
  }
}

async function onMunicipalityChange(gridKey) {
  const g = ADDRESS_GRIDS[gridKey];
  const code = document.getElementById(g.municipality.sel)?.value;
  resetAddrSelect(g.barangay.sel, 'Waiting for Municipality...', true);
  setErr(g.barangay.sel, g.barangay.hint, '');
  if (!code) return;
  try {
    const res = await fetch(`${PSGC}/cities-municipalities/${code}/barangays/`);
    const data = await res.json();
    populateSelect(g.barangay.sel, data, 'Select Barangay');
  } catch (e) {
    console.error('PSGC: failed to load barangays', e);
  }
}

function togglePresentAddress() {
  const checked = document.getElementById('sameAddressCheck').checked;
  const container = document.getElementById('presentAddressContainer');
  if (checked) {
    container.style.display = 'none';
    const g = ADDRESS_GRIDS.present;
    const paStreet = document.getElementById('paStreet');
    if (paStreet) paStreet.value = '';
    setErr(g.country.sel, g.country.hint, '');
    const paCountryEl = document.getElementById(g.country.sel);
    if (paCountryEl) paCountryEl.value = 'Philippines';
    const regionEl = document.getElementById(g.region.sel);
    if (regionEl) regionEl.value = '';
    onRegionChange('present');
  } else {
    container.style.display = 'block';
  }
}

function validateStep1() {
  let hasError = false;
  const newApplicantCheck = document.getElementById('newApplicantCheck');
  if (!newApplicantCheck.checked) {
    const hint = document.getElementById('hNewApplicant');
    if (hint) hint.textContent = 'Please check "New applicant" to generate your Control Number.';
    openPopup('popupControlRequired');
    return false;
  } else {
    const hint = document.getElementById('hNewApplicant');
    if (hint) hint.textContent = '';
  }
  hasError = setErr('pLastName', 'hLastName', !document.getElementById('pLastName').value.trim() ? 'Last name is required.' : '') || hasError;
  hasError = setErr('pFirstName', 'hFirstName', !document.getElementById('pFirstName').value.trim() ? 'First name is required.' : '') || hasError;
  hasError = setErr('pMiddleName', 'hMiddleName', !document.getElementById('pMiddleName').value.trim() ? 'Middle name is required.' : '') || hasError;
  hasError = setErr('pDOB', 'hDOB', !document.getElementById('pDOB').value.trim() ? 'Date of birth is required.' : '') || hasError;
  hasError = setErr('pCivilStatus', 'hCivilStatus', !document.getElementById('pCivilStatus').value ? 'Civil status is required.' : '') || hasError;
  hasError = setErr('pBirthPlace', 'hBirthPlace', !document.getElementById('pBirthPlace').value.trim() ? 'Birth place is required.' : '') || hasError;
  hasError = setErr('pCountry', 'hCountry', !document.getElementById('pCountry').value.trim() ? 'Country is required.' : '') || hasError;
  hasError = setErr('pRegion', 'hRegion', !document.getElementById('pRegion').value.trim() ? 'Region is required.' : '') || hasError;
  hasError = setErr('pProvince', 'hProvince', !document.getElementById('pProvince').value.trim() ? 'Province is required.' : '') || hasError;
  hasError = setErr('pMunicipality', 'hMunicipality', !document.getElementById('pMunicipality').value.trim() ? 'Municipality is required.' : '') || hasError;
  hasError = setErr('pBarangay', 'hBarangay', !document.getElementById('pBarangay').value.trim() ? 'Barangay is required.' : '') || hasError;
  if (!document.getElementById('sameAddressCheck').checked) {
    hasError = setErr('paCountry', 'hPaCountry', !document.getElementById('paCountry').value.trim() ? 'Country is required.' : '') || hasError;
    hasError = setErr('paRegion', 'hPaRegion', !document.getElementById('paRegion').value.trim() ? 'Region is required.' : '') || hasError;
    hasError = setErr('paProvince', 'hPaProvince', !document.getElementById('paProvince').value.trim() ? 'Province is required.' : '') || hasError;
    hasError = setErr('paMunicipality', 'hPaMunicipality', !document.getElementById('paMunicipality').value.trim() ? 'Municipality is required.' : '') || hasError;
    hasError = setErr('paBarangay', 'hPaBarangay', !document.getElementById('paBarangay').value.trim() ? 'Barangay is required.' : '') || hasError;
  }
  if (document.getElementById('pReligion').value === 'Other') {
    hasError = setErr('pReligionOther', 'hReligionOther', !document.getElementById('pReligionOther').value.trim() ? 'Please specify your religion.' : '') || hasError;
  }
  hasError = setErr('pCellNo', 'hCellNo', !document.getElementById('pCellNo').value.trim() ? 'Mobile number is required.' : '') || hasError;
  hasError = setErr('pNationality', 'hNationality', !document.getElementById('pNationality').value ? 'Nationality is required.' : '') || hasError;
  if (document.getElementById('dualCitizenCheck').checked) {
    hasError = setErr('pNationality2', 'hNationality2', !document.getElementById('pNationality2').value ? 'Second nationality is required.' : '') || hasError;
  }
  hasError = setErr('pIsIP', 'hIsIP', !document.getElementById('pIsIP').value ? 'Please indicate if you belong to an indigenous group.' : '') || hasError;
  if (document.getElementById('pIsIP').value === 'Yes') {
    hasError = setErr('pSpecifyIP', 'hSpecifyIP', !document.getElementById('pSpecifyIP').value.trim() ? 'Please specify your IP group.' : '') || hasError;
  }
  hasError = setErr('pHeight', 'hHeight', !document.getElementById('pHeight').value ? 'Height is required.' : '') || hasError;
  hasError = setErr('pWeight', 'hWeight', !document.getElementById('pWeight').value ? 'Weight is required.' : '') || hasError;
  hasError = setErr('pIsPWD', 'hIsPWD', !document.getElementById('pIsPWD').value ? 'Please indicate PWD status.' : '') || hasError;
  hasError = setErr('pIsWorking', 'hIsWorking', !document.getElementById('pIsWorking').value ? 'Please indicate working student status.' : '') || hasError;
  const cellNo = document.getElementById('pCellNo').value.trim();
  if (cellNo && !/^\d{11}$/.test(cellNo)) {
    hasError = setErr('pCellNo', 'hCellNo', 'Mobile number must be exactly 11 digits.') || hasError;
  }
  const sexSelected = document.querySelector('input[name="sex"]:checked');
  const sexRow = document.getElementById('sexRow');
  const sexHint = document.getElementById('hSex');
  if (!sexSelected) {
    sexRow.classList.add('err');
    sexHint.textContent = 'Please select your sex.';
    hasError = true;
  } else {
    sexRow.classList.remove('err');
    sexHint.textContent = '';
  }
  const email = document.getElementById('pEmail').value.trim();
  if (!email) {
    hasError = setErr('pEmail', 'hEmail', 'Email address is required.') || hasError;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    hasError = setErr('pEmail', 'hEmail', 'Enter a valid email address.') || hasError;
  } else {
    setErr('pEmail', 'hEmail', '');
  }
  if (hasError) {
    openPopup('popupRequired');
    return false;
  }
  return true;
}

function validateStep2() {
  let hasError = false;
  hasError = setErr('fLastName', 'hFLastName', !document.getElementById('fLastName').value.trim() ? "Father's last name is required." : '') || hasError;
  hasError = setErr('fFirstName', 'hFFirstName', !document.getElementById('fFirstName').value.trim() ? "Father's first name is required." : '') || hasError;
  hasError = setErr('fMiddleName', 'hFMiddleName', !document.getElementById('fMiddleName').value.trim() ? "Father's middle name is required." : '') || hasError;
  hasError = setErr('mLastName', 'hMLastName', !document.getElementById('mLastName').value.trim() ? "Mother's last name is required." : '') || hasError;
  hasError = setErr('mFirstName', 'hMFirstName', !document.getElementById('mFirstName').value.trim() ? "Mother's first name is required." : '') || hasError;
  hasError = setErr('mMiddleName', 'hMMiddleName', !document.getElementById('mMiddleName').value.trim() ? "Mother's middle name is required." : '') || hasError;
  hasError = setErr('gName', 'hGName', !document.getElementById('gName').value.trim() ? "Guardian's complete name is required." : '') || hasError;
  hasError = setErr('gCP', 'hGCP', !document.getElementById('gCP').value.trim() ? "Guardian's mobile number is required." : '') || hasError;
  hasError = setErr('gRelationship', 'hGRelationship', !document.getElementById('gRelationship').value ? "Relationship is required." : '') || hasError;
  if (document.getElementById('gRelationship').value === 'Other') {
    hasError = setErr('gRelationshipOther', 'hGRelationshipOther', !document.getElementById('gRelationshipOther').value.trim() ? 'Please specify the relationship.' : '') || hasError;
  }
  const guardianCP = document.getElementById('gCP').value.trim();
  if (guardianCP && !/^\d{11}$/.test(guardianCP)) {
    hasError = setErr('gCP', 'hGCP', 'Guardian mobile number must be exactly 11 digits.') || hasError;
  }
  const ecMobileVal = document.getElementById('ecMobile').value.trim();
  if (ecMobileVal && !/^\d{11}$/.test(ecMobileVal)) {
    hasError = setErr('ecMobile', 'hEcMobile', 'Emergency contact mobile must be exactly 11 digits.') || hasError;
  }
  if (hasError) {
    openPopup('popupRequired');
    return false;
  }
  return true;
}

function validateStep3() {
  let hasError = false;
  const admLevel = document.getElementById('admFor').value;
  const type = document.getElementById('admAs').value;
  const isTransShifterReturnee = (type === 'Transferee' || type === 'Shifter' || type === 'Returnee');
  const isFreshman = (type === 'Freshman');
  const isGraduate = (admLevel === 'Graduate School');

  hasError = setErr('admFor', 'hAdmFor', !admLevel ? 'Please select admission level.' : '') || hasError;
  if (!isGraduate) {
    hasError = setErr('admAs', 'hAdmAs', !type ? 'Please select applicant category.' : '') || hasError;
  }

  if (!document.getElementById('tSchoolName').disabled) {
    hasError = setErr('tSchoolName', 'hTSchoolName', !document.getElementById('tSchoolName').value.trim() ? 'Last school name is required.' : '') || hasError;
    hasError = setErr('tSchoolAddr', 'hTSchoolAddr', !document.getElementById('tSchoolAddr').value.trim() ? 'Last school address is required.' : '') || hasError;
    if (isTransShifterReturnee) {
      hasError = setErr('tProgram', 'hTProgram', !document.getElementById('tProgram').value.trim() ? 'Program is required.' : '') || hasError;
    }
    hasError = setErr('tLastYear', 'hTLastYear', !document.getElementById('tLastYear').value.trim() ? 'Last year attended is required.' : '') || hasError;
    const tLastLevelEl = document.getElementById('tLastLevel');
    if (!tLastLevelEl.disabled) {
      hasError = setErr('tLastLevel', 'hTLastLevel', !tLastLevelEl.value.trim() ? 'Last year level is required.' : '') || hasError;
    }
    hasError = setErr('tGWA', 'hTGWA', !document.getElementById('tGWA').value.trim() ? 'G.W.A. is required.' : '') || hasError;
  }

  if (isFreshman) {
    const shsStrand = document.getElementById('shsStrand');
    if (shsStrand && !shsStrand.disabled) {
      hasError = setErr('shsStrand', 'hShsStrand', !shsStrand.value.trim() ? 'SHS Track / Strand is required.' : '') || hasError;
    }
  }

  const lrnField = document.getElementById('iLRN');
  if (lrnField && lrnField.required) {
    hasError = setErr('iLRN', 'hLRN', !lrnField.value.trim() ? "Learner's Reference No. is required." : '') || hasError;
    if (lrnField.value.trim() && !/^\d{12}$/.test(lrnField.value.trim())) {
      hasError = setErr('iLRN', 'hLRN', "Learner's Reference No. must be 12 digits.") || hasError;
    }
  }

  const yearLevelEl = document.getElementById('iYearLevel');
  if (!yearLevelEl.disabled) {
    hasError = setErr('iYearLevel', 'hYearLevel', !yearLevelEl.value.trim() ? 'Year level is required.' : '') || hasError;
  }

  hasError = setErr('iCampus', 'hCampus', !document.getElementById('iCampus').value.trim() ? 'Campus is required.' : '') || hasError;
  hasError = setErr('c1', 'hC1', !document.getElementById('c1').value.trim() ? 'Preferred course is required.' : '') || hasError;

  if (hasError) {
    openPopup('popupRequired');
    return false;
  }
  return true;
}

function goToStep(n) {
  document.querySelectorAll('.step-page').forEach(p => p.classList.remove('active'));
  document.getElementById('page' + n).classList.add('active');
  for (let i = 1; i <= 4; i++) {
    const tab = document.getElementById('tab' + i);
    if (!tab) continue;
    tab.classList.remove('active', 'done');
    if (i === n) tab.classList.add('active');
    else if (i < n) tab.classList.add('done');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goStep(n) {
  // Validation for moving forward
  if (n === 2 && !validateStep1()) return;
  if (n === 3 && !validateStep2()) return;

  // THE FIX: When moving to the Final Step (4)
  if (n === 4) {
    if (!validateStep3()) return; // Validate Step 3 fields first

    console.log("Generating summary..."); // Debugging check
    populateSummary(); // Fill the table with user data
  }

  goToStep(n); // Finally show the next section
}

function handleStep2Next() {
  if (!validateStep2()) return;
  const ecName = document.getElementById('ecName').value.trim();
  if (!ecName) {
    document.getElementById('friendlyEmergencyModal').style.display = 'flex';
  } else {
    goStep(3);
  }
}

function closeFriendlyModal() {
  document.getElementById('friendlyEmergencyModal').style.display = 'none';
}

function proceedFromFriendlyModal() {
  closeFriendlyModal();
  goStep(3);
}

const parsuPrograms = {
  // GRADUATE PROGRAMS
  "Doctor of Philosophy in English Language Education": "Goa (Main Campus)",
  "Doctor of Philosophy in Mathematics Education": "Goa (Main Campus)",
  "Master of Arts in Education - English": "Goa (Main Campus)",
  "Master of Arts in Education - Science Education": "Goa (Main Campus)",
  "Master of Arts in Education - Mathematics Education": "Goa (Main Campus)",
  "Master of Arts in Education - Instructional Management": "Goa (Main Campus)",
  "Master in Business Administration": "Goa (Main Campus)",
  "Master in Public Administration": "Goa (Main Campus)",

  // UNDERGRADUATE - GOA CAMPUS
  "Bachelor of Elementary Education": "Goa (Main Campus)",
  "Bachelor of Secondary Education - English": "Goa (Main Campus)",
  "Bachelor of Secondary Education - Filipino": "Goa (Main Campus)",
  "Bachelor of Secondary Education - Mathematics": "Goa (Main Campus)",
  "Bachelor of Secondary Education - Science": "Goa (Main Campus)",
  "Bachelor of Secondary Education - Social Studies": "Goa (Main Campus)",
  "Bachelor of Secondary Education - Values Education": "Goa (Main Campus)",
  "Bachelor of Science in Accountancy": "Goa (Main Campus)",
  "Bachelor of Science in Business Administration - Financial Management": "Goa (Main Campus)",
  "Bachelor of Science in Office Administration": "Goa (Main Campus)",
  "Bachelor of Science in Entrepreneurship": "Goa (Main Campus)",
  "Bachelor of Science in Economics": "Goa (Main Campus)",
  "Bachelor of Science in Civil Engineering": "Goa (Main Campus)",
  "Bachelor of Science in Sanitary Engineering": "Goa (Main Campus)",
  "Bachelor of Science in Computer Science": "Goa (Main Campus)",
  "Bachelor of Science in Mathematics": "Goa (Main Campus)",
  "Bachelor of Science in Information Technology": "Goa (Main Campus)",
  "Bachelor of Automotive Technology (Goa)": "Goa (Main Campus)",
  "Bachelor of Engineering Technology - Electrical": "Goa (Main Campus)",
  "Bachelor of Engineering Technology - Automotive": "Goa (Main Campus)",
  "Bachelor of Engineering Technology - Refrigeration & Airconditioning": "Goa (Main Campus)",
  "Bachelor of Arts in Communication": "Goa (Main Campus)",
  "Bachelor of Science in Biology": "Goa (Main Campus)",
  "Bachelor of Science in Geology": "Goa (Main Campus)",

  // CARAMOAN CAMPUS
  "Bachelor of Automotive Technology (Caramoan)": "Caramoan Campus",
  "Bachelor of Science in Hospitality Management (Caramoan)": "Caramoan Campus",
  "Bachelor of Science in Biology - Conservation Ecology": "Caramoan Campus",
  "Bachelor of Science in Tourism Management - Ecotourism": "Caramoan Campus",
  "Bachelor of Engineering Technology - Mechanical/Automotive (Caramoan)": "Caramoan Campus",

  // LAGONOY CAMPUS
  "Bachelor of Science in Nutrition and Dietetics": "Lagonoy Campus",
  "Bachelor of Science in Criminology": "Lagonoy Campus",
  "Bachelor of Science in Industrial Security Management": "Lagonoy Campus",

  // SAGÑAY CAMPUS
  "Bachelor of Science in Fisheries": "Sagñay Campus",
  "Bachelor of Science in Marine Biology": "Sagñay Campus",

  // SALOGON CAMPUS
  "Bachelor of Science in Agribusiness": "Salogon Campus",
  "Bachelor of Science in Community Development": "Salogon Campus",

  // SAN JOSE CAMPUS
  "Bachelor of Science in Hospitality Management (San Jose)": "San Jose Campus",
  "Bachelor of Science in Tourism Management": "San Jose Campus",

  // TINAMBAC CAMPUS
  "Bachelor of Science in Environmental Science": "Tinambac Campus",
  "Bachelor of Science in Environmental Planning": "Tinambac Campus",
  "Bachelor of Science in Forestry": "Tinambac Campus",
};

function onCourseChange() {
  const c1Val = document.getElementById('c1').value;
  const campus = c1Val ? (parsuPrograms[c1Val] || '') : '';
  document.getElementById('iCampus').value = campus;
  setErr('iCampus', 'hCampus', '');
  if (c1Val) setErr('c1', 'hC1', '');
}

function populateCourseDropdowns(level) {
  const keys = Object.keys(parsuPrograms).filter(k => {
    if (level === 'Graduate') return k.startsWith('Master') || k.startsWith('Doctor');
    if (level === 'College') return k.startsWith('Bachelor');
    return true;
  }).sort((a, b) => a.localeCompare(b));

  const placeholders = {
    c1: 'Select Primary Course',
    c2: 'Select Second Course (Optional)',
    c3: 'Select Third Course (Optional)'
  };

  ['c1', 'c2', 'c3'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    const prev = sel.value;
    sel.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = ''; ph.textContent = placeholders[selId];
    ph.disabled = true; ph.selected = true; ph.hidden = true;
    sel.appendChild(ph);
    keys.forEach(prog => {
      const opt = document.createElement('option');
      opt.value = prog; opt.textContent = prog;
      sel.appendChild(opt);
    });
    if (keys.includes(prev)) sel.value = prev;
  });

  onCourseChange();
}

function setContainerVisible(id, visible) {
  const el = document.getElementById(id);
  if (el) el.style.display = visible ? '' : 'none';
}

function onAdmissionLevelChange() {
  const level = document.getElementById('admFor').value;
  const admAs = document.getElementById('admAs');

  setErr('admFor', 'hAdmFor', '');

  if (level === 'Graduate School') {
    admAs.value = '';
    admAs.disabled = true;
    admAs.style.opacity = '0.7';
    admAs.style.background = '#e8e8e8';
    setErr('admAs', 'hAdmAs', '');
    document.getElementById('docsSection').style.display = 'none';
    document.getElementById('instructionMessage').style.display = 'none';
    document.getElementById('iCampus').value = '';
    populateCourseDropdowns('Graduate');

    setContainerVisible('iYearLevelField', false);
    const yearSel = document.getElementById('iYearLevel');
    if (yearSel) { yearSel.value = ''; yearSel.disabled = true; }
    setErr('iYearLevel', 'hYearLevel', '');

    setContainerVisible('iLRNField', false);
    const iLRN = document.getElementById('iLRN');
    if (iLRN) { iLRN.required = false; setErr('iLRN', 'hLRN', ''); }
    const lrnAsterisk = document.getElementById('lrnAsterisk');
    if (lrnAsterisk) lrnAsterisk.style.display = 'none';

    setContainerVisible('c2Field', false);
    setContainerVisible('c3Field', false);
    const c1Cont = document.getElementById('c1Container');
    if (c1Cont) c1Cont.classList.add('full-width');

    setContainerVisible('tLastLevelField', false);
    const tLastLevel = document.getElementById('tLastLevel');
    if (tLastLevel) { tLastLevel.disabled = true; tLastLevel.value = ''; setErr('tLastLevel', 'hTLastLevel', ''); }

    setContainerVisible('tProgramField', false);
    const tProgram = document.getElementById('tProgram');
    if (tProgram) { tProgram.value = ''; tProgram.disabled = true; tProgram.required = false; }

    setContainerVisible('strandContainer', false);
    const shsStrand = document.getElementById('shsStrand');
    if (shsStrand) { shsStrand.value = ''; shsStrand.disabled = true; shsStrand.required = false; }

  } else if (level === 'College') {
    admAs.disabled = false;
    admAs.style.opacity = '1';
    admAs.style.background = '#fafafa';

    setContainerVisible('iYearLevelField', true);
    const yearSel = document.getElementById('iYearLevel');
    if (yearSel) { yearSel.disabled = false; yearSel.style.opacity = '1'; yearSel.style.background = '#fafafa'; }

    setContainerVisible('iLRNField', true);
    const iLRN = document.getElementById('iLRN');
    if (iLRN) { iLRN.style.opacity = '1'; iLRN.style.background = '#fafafa'; }

    setContainerVisible('c2Field', true);
    setContainerVisible('c3Field', true);
    const c1Cont = document.getElementById('c1Container');
    if (c1Cont) c1Cont.classList.remove('full-width');

    setContainerVisible('tLastLevelField', true);
    const tLastLevel = document.getElementById('tLastLevel');
    if (tLastLevel) { tLastLevel.disabled = false; tLastLevel.style.opacity = '1'; tLastLevel.style.background = '#fafafa'; }

    populateCourseDropdowns('College');
    toggleFieldsByType();
  }
}

function toggleReligionOther() {
  const other = document.getElementById('pReligionOther');
  const hint = document.getElementById('hReligionOther');
  if (document.getElementById('pReligion').value === 'Other') {
    other.style.display = 'block';
  } else {
    other.style.display = 'none';
    other.value = '';
    other.classList.remove('err');
    if (hint) hint.textContent = '';
  }
}

function toggleRelationshipOther() {
  const other = document.getElementById('gRelationshipOther');
  const hint = document.getElementById('hGRelationshipOther');
  if (document.getElementById('gRelationship').value === 'Other') {
    other.style.display = 'block';
  } else {
    other.style.display = 'none';
    other.value = '';
    other.classList.remove('err');
    if (hint) hint.textContent = '';
  }
}

const requirements = {
  'Freshman': {
    title: 'Required Documents — Freshman',
    info: 'Please prepare the following documents:',
    items: ['Senior High School Report Card / Form 138', 'Certificate of Graduation or Diploma', 'Good Moral Certificate', 'Birth Certificate (PSA)', '2×2 ID Photos', "Learner's Reference Number (LRN)"]
  },
  'Transferee': {
    title: 'Required Documents — Transferee',
    info: 'Please prepare the following documents from your previous college:',
    items: ['Transcript of Records (TOR) from previous college', 'Honorable Dismissal / Transfer Credential', 'Birth Certificate (PSA)', 'Course Description / Syllabus']
  },
  'Shifter': {
    title: 'Required Documents — Shifter',
    info: 'Please prepare the following documents for shifting:',
    items: ['Shifting Form / Request Letter', 'Grades or Transcript of Records', 'Approval from Department']
  },
  'Returnee': {
    title: 'Required Documents — Returnee',
    info: 'Please prepare the following documents for re-admission:',
    items: ['Previous School Record / Transcript', 'Re-admission Form', 'Clearance', 'Good Moral Certificate']
  },
  'PEPT/ALS Graduate': {
    title: 'Required Documents — PEPT/ALS Graduate',
    info: 'Please prepare the following documents:',
    items: ['ALS Certificate or PEPT Certificate', 'Form 138 / Equivalent Record', 'Birth Certificate (PSA)', 'Good Moral Certificate', 'ID Photos']
  }
};

function onApplicantTypeChange() {
  const type = document.getElementById('admAs').value;
  const docsSection = document.getElementById('docsSection');
  if (type && requirements[type]) {
    document.getElementById('docsTypeLabel').textContent = type;
    document.getElementById('docsInfo').textContent = requirements[type].info;
    docsSection.style.display = 'block';
    showReqPopup();
  } else {
    docsSection.style.display = 'none';
  }
  toggleFieldsByType();
}

function showReqPopup() {
  const type = document.getElementById('admAs').value;
  if (!type || !requirements[type]) return;
  const req = requirements[type];
  document.getElementById('popupReqHeader').textContent = req.title;
  const list = document.getElementById('popupReqList');
  list.innerHTML = '';
  req.items.forEach(function (item) {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  openPopup('popupReqs');
}

function populateSummary() {
  const get = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const getChecked = id => { const el = document.getElementById(id); return el ? el.checked : false; };
  const getSex = () => { const r = document.querySelector('input[name="sex"]:checked'); return r ? r.value : ''; };
  const selText = id => {
    const el = document.getElementById(id);
    if (!el || el.selectedIndex < 0) return '';
    const t = el.options[el.selectedIndex]?.text || '';
    return /^(Select|Loading|Waiting)/.test(t) ? '' : t;
  };

  const section = (title, items) => {
    const filled = items.filter(([, v]) => v);
    if (!filled.length) return '';
    const rows = filled.map(([label, value]) =>
      `<div class="summary-item"><span class="label">${label}</span><span class="value">${value}</span></div>`
    ).join('');
    return `<div class="summary-section"><h4>${title}</h4><div class="summary-grid">${rows}</div></div>`;
  };

  const fullName = [get('pLastName'), get('pFirstName'), get('pMiddleName'), get('pNameExt')].filter(Boolean).join(', ');
  const religionVal = get('pReligion') === 'Other' ? (get('pReligionOther') || 'Other') : get('pReligion');
  const natVal = get('pNationality') + (get('pNationality2') ? ` / ${get('pNationality2')}` : '');
  const ipVal = get('pIsIP') === 'Yes' ? `Yes – ${get('pSpecifyIP') || '?'}` : get('pIsIP');
  const gRelVal = get('gRelationship') === 'Other' ? (get('gRelationshipOther') || 'Other') : get('gRelationship');
  const tProgVal = get('tProgram') || get('shsStrand');
  const admTypeVal = get('admAs') || (get('admFor') === 'Graduate School' ? 'Graduate' : '');
  const yearLevelText = selText('iYearLevel');

  let html = '';
  html += section('Personal Information', [
    ['Full Name', fullName],
    ['Date of Birth', get('pDOB')],
    ['Sex', getSex()],
    ['Height', get('pHeight')],
    ['Weight (kg)', get('pWeight')],
    ['Civil Status', selText('pCivilStatus')],
    ['Birth Place', get('pBirthPlace')],
    ['Religion', religionVal],
    ['Nationality', natVal],
    ['Indigenous Group (IP)', ipVal],
    ['PWD Status', get('pIsPWD')],
    ['Working Student', get('pIsWorking')],
    ['GIDA Resident', getChecked('pIsGIDA') ? 'Yes' : 'No'],
  ]);
  html += section('Contact Information', [
    ['Mobile Number', get('pCellNo')],
    ['Email Address', get('pEmail')],
  ]);
  html += section('Father', [
    ['Name', [get('fLastName'), get('fFirstName'), get('fMiddleName')].filter(Boolean).join(', ')],
    ['Mobile', get('fCP')],
    ['Occupation', get('fOccupation')],
    ['Annual Income', selText('fIncome')],
  ]);
  html += section("Mother's Maiden Name", [
    ['Name', [get('mLastName'), get('mFirstName'), get('mMiddleName')].filter(Boolean).join(', ')],
    ['Mobile', get('mCP')],
    ['Occupation', get('mOccupation')],
    ['Annual Income', selText('mIncome')],
  ]);
  html += section('Guardian', [
    ['Name', get('gName')],
    ['Mobile', get('gCP')],
    ['Relationship', gRelVal],
  ]);
  if (get('ecName')) {
    html += section('Emergency Contact', [
      ['Name', get('ecName')],
      ['Relationship', get('ecRelationship')],
      ['Mobile', get('ecMobile')],
    ]);
  }
  html += section('Admission Details', [
    ['Admission For', get('admFor')],
    ['Applicant Type', admTypeVal],
    ['Campus', get('iCampus')],
    ['Year Level', yearLevelText],
    ['LRN', get('iLRN')],
  ]);
  html += section('Last School Attended', [
    ['School Name', get('tSchoolName')],
    ['School Address', get('tSchoolAddr')],
    ['Program / Strand', tProgVal],
    ['Last Year Attended', get('tLastYear')],
    ['Last Year Level', get('tLastLevel')],
    ['G.W.A.', get('tGWA')],
  ]);
  html += section('Preferred Courses', [
    ['1st Choice', selText('c1')],
    ['2nd Choice', selText('c2')],
    ['3rd Choice', selText('c3')],
  ]);

  document.getElementById('summaryContainer').innerHTML = html || '<p style="color:#aaa;text-align:center;">No data found.</p>';
}



function submitForm() {
  // 1. Get the Emergency Name (falls back to Guardian Name if eName is missing)
  const eNameField = document.getElementById('eName') || document.getElementById('gName');
  const eNameValue = eNameField ? eNameField.value.trim() : "";

  // 2. Validate the Certification Checkbox (Crucial for Step 4)
  const confirmCheck = document.getElementById('confirmCheck');
  if (!confirmCheck || !confirmCheck.checked) {
    alert("Please check the certification box at the bottom of the Summary page.");
    return;
  }

  // 3. Logic for the "Friendly Modal"
  // If eNameValue is empty, show the "heads-up" popup
  if (!eNameValue) {
    const modal = document.getElementById('friendlyModal');
    if (modal) {
      modal.style.display = 'flex';
    } else {
      // If the modal doesn't exist, just proceed to save
      proceedFromFriendlyModal();
    }
  } else {
    // If they provided a name, go straight to the backend save
    proceedFromFriendlyModal();
  }
}

async function submitApplication() {
  const submitBtn = document.querySelector('.popup-btn');
  submitBtn.innerText = "Submitting...";
  submitBtn.disabled = true;

  const data = {
    controlNumber: document.getElementById("ctrlNo").textContent,

    // PERSONAL DATA
    lastName: document.getElementById("pLastName").value,
    firstName: document.getElementById("pFirstName").value,
    middleName: document.getElementById("pMiddleName").value,
    nameExtension: document.getElementById("pNameExt").value,
    dateOfBirth: document.getElementById("pDOB").value,
    sex: document.querySelector('input[name="sex"]:checked')?.value,

    mobileNumber: document.getElementById("pCellNo").value,
    emailAddress: document.getElementById("pEmail").value,
    civilStatus: document.getElementById("pCivilStatus").value,
    birthPlace: document.getElementById("pBirthPlace").value,
    height: document.getElementById("pHeight").value,
    weight: document.getElementById("pWeight").value,
    religion: document.getElementById("pReligion").value,
    nationality: document.getElementById("pNationality").value,

    // HOME ADDRESS
    homeAddress: {
      country: document.getElementById("pCountry").value,
      region: document.getElementById("pRegion").value,
      province: document.getElementById("pProvince").value,
      municipality: document.getElementById("pMunicipality").value,
      barangay: document.getElementById("pBarangay").value,
      street: document.getElementById("pStreet").value,
      useHomeAsPresent: document.getElementById("sameAddressCheck").checked
    },

    presentCountry: document.getElementById("paCountry")?.value,
    presentRegion: document.getElementById("paRegion")?.value,
    presentProvince: document.getElementById("paProvince")?.value,
    presentMunicipality: document.getElementById("paMunicipality")?.value,
    presentBarangay: document.getElementById("paBarangay")?.value,
    presentStreet: document.getElementById("paStreet")?.value,

    isGida: document.getElementById("pIsGIDA").checked,

    // FAMILY BACKGROUND
    fatherLastName: document.getElementById("fLastName").value,
    fatherFirstName: document.getElementById("fFirstName").value,
    fatherMiddleName: document.getElementById("fMiddleName").value,
    fatherMobile: document.getElementById("fCP").value,
    fatherOccupation: document.getElementById("fOccupation").value,
    fatherIncome: document.getElementById("fIncome").value,

    motherLastName: document.getElementById("mLastName").value,
    motherFirstName: document.getElementById("mFirstName").value,
    motherMiddleName: document.getElementById("mMiddleName").value,
    motherMobile: document.getElementById("mCP").value,
    motherOccupation: document.getElementById("mOccupation").value,
    motherIncome: document.getElementById("mIncome").value,

    guardianName: document.getElementById("gName").value,
    guardianContact: document.getElementById("gCP").value,
    guardianRelationship: document.getElementById("gRelationship").value,

    emergencyContactName: document.getElementById("ecName").value,
    emergencyContactNo: document.getElementById("ecMobile").value,

    // ADMISSION DATA
    admissionLevel: document.getElementById("admFor").value,
    admissionType: document.getElementById("admAs").value,

    lrn: document.getElementById("iLRN").value,

    choice1: document.getElementById("c1").value,
    choice2: document.getElementById("c2").value,
    choice3: document.getElementById("c3").value,

    lastSchoolName: document.getElementById("tSchoolName").value,
    lastSchoolAddress: document.getElementById("tSchoolAddr").value,
    campus: document.getElementById("iCampus").value,

    lastYearAttended: document.getElementById("tLastYear").value,
    lastYearLevel: document.getElementById("tLastLevel").value,
    gwa: document.getElementById("tGWA").value,
    programOrStrand: document.getElementById("tProgram").value,
    appliedYearLevel: document.getElementById("iYearLevel").value,

    isConfirmed: true
  };

  try {

    const response = await fetch("http://localhost:8080/api/admissions/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to submit application");
    }

    const result = await response.text();

    alert("Application submitted successfully!");
    console.log(result);

  } catch (error) {
    console.error(error);
    alert("Error submitting application");
  }
}

const allValidationFields = [
  { id: 'pLastName', hint: 'hLastName' }, { id: 'pMiddleName', hint: 'hMiddleName' }, { id: 'pFirstName', hint: 'hFirstName' },
  { id: 'pDOB', hint: 'hDOB' }, { id: 'pCivilStatus', hint: 'hCivilStatus' }, { id: 'pBirthPlace', hint: 'hBirthPlace' },
  { id: 'pHeight', hint: 'hHeight' }, { id: 'pWeight', hint: 'hWeight' },
  { id: 'pCellNo', hint: 'hCellNo' }, { id: 'pEmail', hint: 'hEmail' },
  { id: 'pNationality', hint: 'hNationality' }, { id: 'pNationality2', hint: 'hNationality2' },
  { id: 'pIsIP', hint: 'hIsIP' }, { id: 'pSpecifyIP', hint: 'hSpecifyIP' },
  { id: 'pIsPWD', hint: 'hIsPWD' }, { id: 'pIsWorking', hint: 'hIsWorking' },
  { id: 'pReligionOther', hint: 'hReligionOther' }, { id: 'gRelationshipOther', hint: 'hGRelationshipOther' },
  { id: 'fLastName', hint: 'hFLastName' },
  { id: 'fMiddleName', hint: 'hFMiddleName' }, { id: 'fFirstName', hint: 'hFFirstName' }, { id: 'mLastName', hint: 'hMLastName' },
  { id: 'mMiddleName', hint: 'hMMiddleName' }, { id: 'mFirstName', hint: 'hMFirstName' }, { id: 'gName', hint: 'hGName' },
  { id: 'gCP', hint: 'hGCP' }, { id: 'gRelationship', hint: 'hGRelationship' },
  { id: 'ecName', hint: 'hEcName' }, { id: 'ecRelationship', hint: 'hEcRelationship' }, { id: 'ecMobile', hint: 'hEcMobile' },
  { id: 'admFor', hint: 'hAdmFor' }, { id: 'admAs', hint: 'hAdmAs' },
  { id: 'shsStrand', hint: 'hShsStrand' },
  { id: 'iYearLevel', hint: 'hYearLevel' }, { id: 'iLRN', hint: 'hLRN' }, { id: 'iCampus', hint: 'hCampus' },
  { id: 'c1', hint: 'hC1' }, { id: 'tSchoolName', hint: 'hTSchoolName' }, { id: 'tSchoolAddr', hint: 'hTSchoolAddr' },
  { id: 'tProgram', hint: 'hTProgram' }, { id: 'tLastYear', hint: 'hTLastYear' }, { id: 'tLastLevel', hint: 'hTLastLevel' },
  { id: 'tGWA', hint: 'hTGWA' }
];

allValidationFields.forEach(pair => {
  const el = document.getElementById(pair.id);
  if (!el) return;
  const evt = (el.tagName === 'SELECT') ? 'change' : 'input';
  el.addEventListener(evt, function () {
    if (this.value && this.value.trim() !== '') {
      this.classList.remove('err');
      const hint = document.getElementById(pair.hint);
      if (hint) hint.textContent = '';
    }
  });
});

document.querySelectorAll('input[name="sex"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.getElementById('sexRow').classList.remove('err');
    document.getElementById('hSex').textContent = '';
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const lsBaseFields = ['tSchoolName', 'tSchoolAddr', 'tLastYear', 'tLastLevel', 'tGWA'];
  lsBaseFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.disabled = false;
      field.required = true;
      field.style.opacity = '1';
      field.style.background = '#fafafa';
    }
  });

  const tProgram = document.getElementById('tProgram');
  if (tProgram) { tProgram.disabled = true; tProgram.required = false; }

  const lrnField = document.getElementById('iLRN');
  if (lrnField) {
    lrnField.disabled = false;
    lrnField.required = true;
    lrnField.style.opacity = '1';
    lrnField.style.background = '#fafafa';
  }

  populateCourseDropdowns('College');

  const campusInput = document.getElementById('iCampus');
  if (campusInput) {
    campusInput.style.background = '#f0f2f5';
    campusInput.style.color = '#555';
    campusInput.style.cursor = 'not-allowed';
  }

  loadCountries('pCountry', 'home');
  loadCountries('paCountry', 'present');
});

async function handleFinalSubmit() {
    // Collect data - Make sure these IDs exist in your HTML!
    const admissionData = {
        firstName: document.getElementById('pFirstName').value,
        lastName: document.getElementById('pLastName').value,
        middleName: document.getElementById('pMiddleName')?.value || "", // Added
        email: document.getElementById('pEmail').value,
        contactNumber: document.getElementById('pContact').value,
        sex: document.querySelector('input[name="pSex"]:checked')?.value || "N/A", // Added
        dateOfBirth: document.getElementById('pBirthDate').value, // Must be YYYY-MM-DD
        civilStatus: document.getElementById('pCivilStatus')?.value || "Single",
        nationality: document.getElementById('pNationality')?.value || "Filipino",
        
        fatherName: document.getElementById('fName').value,
        motherName: document.getElementById('mName').value,
        guardianName: document.getElementById('gName').value,
        
        controlNumber: document.getElementById('ctrlNo').innerText,
        program: document.getElementById('tProgram').value,
        department: document.getElementById('tCollege').value,
        yearLevel: document.getElementById('iYearLevel')?.value || "1st Year",
        admissionType: document.querySelector('input[name="admAs"]:checked')?.value || "Freshman",
        lrn: document.getElementById('iLRN').value,
        gwa: parseFloat(document.getElementById('tGWA')?.value) || 0.0, // Convert to Number
        lastSchoolAttended: document.getElementById('tLastSchool')?.value || "N/A"
    };

    console.log("Sending Data:", admissionData); // Debugging

    try {
        const response = await fetch("http://localhost:8080/api/admissions/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(admissionData)
        });

        if (response.ok) {
            document.getElementById('successModal').style.display = 'flex';
        } else {
            const errorData = await response.json();
            console.error("Server Error:", errorData);
            alert("Failed to submit. Check console for details.");
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Server is offline.");
    }
}
