/* ── Fin Flow sample data ── */

const FINFLOW_STORAGE_PREFIX = 'finflow:';

// Bumped whenever the seeded data changes, so a browser holding the previous
// demo data discards it instead of showing rows that no longer exist
const FINFLOW_DATA_VERSION = '2';

function ensureDataVersion() {
  var key = FINFLOW_STORAGE_PREFIX + 'dataVersion';
  if (localStorage.getItem(key) === FINFLOW_DATA_VERSION) return;

  localStorage.removeItem(FINFLOW_STORAGE_PREFIX + 'claims');
  localStorage.removeItem(FINFLOW_STORAGE_PREFIX + 'requests');
  localStorage.removeItem(FINFLOW_STORAGE_PREFIX + 'demoDate');
  localStorage.setItem(key, FINFLOW_DATA_VERSION);
}

/* ── Helpers ── */

function getSession() {
  try {
    const raw = localStorage.getItem(FINFLOW_STORAGE_PREFIX + 'session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// id is the client or broker record this session belongs to, so a dashboard
// knows whose data to load
function setSession(role, name, id) {
  localStorage.setItem(
    FINFLOW_STORAGE_PREFIX + 'session',
    JSON.stringify({ role, name, id, loginTime: new Date().toISOString() })
  );
}

function clearSession() {
  localStorage.removeItem(FINFLOW_STORAGE_PREFIX + 'session');
}

// For a page more than one role may open, such as the broker dashboard the
// insurer shares
function requireAnyRole(allowedRoles) {
  const session = getSession();
  if (!session || allowedRoles.indexOf(session.role) === -1) {
    window.location.href = 'portal.html';
    return null;
  }
  return session;
}

function requireRole(expectedRole) {
  const session = getSession();
  if (!session || session.role !== expectedRole) {
    window.location.href = 'portal.html';
    return null;
  }
  return session;
}

/* ── Demo clock ── */

// The demo runs on its own date so the skip ahead button can fire reminders
// in front of an audience
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

// Keeps the sample dates either side of today, whenever the demo runs
function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getDemoDate() {
  return localStorage.getItem(FINFLOW_STORAGE_PREFIX + 'demoDate') || todayIso();
}

function setDemoDate(isoDate) {
  localStorage.setItem(FINFLOW_STORAGE_PREFIX + 'demoDate', isoDate);
  return isoDate;
}

function advanceDemoDate(days) {
  const d = new Date(getDemoDate());
  d.setDate(d.getDate() + days);
  return setDemoDate(d.toISOString().slice(0, 10));
}

function resetDemoDate() {
  localStorage.removeItem(FINFLOW_STORAGE_PREFIX + 'demoDate');
  return todayIso();
}

// ISO dates compare correctly as strings, so a reminder has fired once its
// trigger date is on or before the demo date
function isDue(triggerDate, onDate) {
  return triggerDate <= (onDate || getDemoDate());
}

/* ── Insurers ── */

const insurers = [
  { id: 'sanlam', name: 'Sanlam', claimsPhone: '0860 726 526', contact: 'Naledi Mofokeng', username: 'sanlam', password: 'demo123' },
  { id: 'old-mutual', name: 'Old Mutual', claimsPhone: '0860 247 365', contact: 'Werner Botha', username: 'oldmutual', password: 'demo123' },
  { id: 'liberty', name: 'Liberty', claimsPhone: '0860 456 789', contact: 'Ayesha Patel', username: 'liberty', password: 'demo123' },
  { id: 'momentum', name: 'Momentum', claimsPhone: '0860 111 636', contact: 'Tebogo Maseko', username: 'momentum', password: 'demo123' },
  { id: 'discovery', name: 'Discovery', claimsPhone: '0860 999 725', contact: 'Rushdi Adams', username: 'discovery', password: 'demo123' },
  { id: 'allan-gray', name: 'Allan Gray', claimsPhone: '0860 000 654', contact: 'Kirsten de Wet', username: 'allangray', password: 'demo123' },
  { id: 'santam', name: 'Santam', claimsPhone: '0860 444 444', contact: 'Musa Ndlovu', username: 'santam', password: 'demo123' }
];

/* ── Claim steps ── */

const claimSteps = [
  { id: 1, label: 'Accident reported', turn: 'client', description: 'Client reports the accident to Fin Flow.' },
  { id: 2, label: 'Photos uploaded', turn: 'client', description: 'Client uploads photos of the damage.' },
  { id: 3, label: 'Claim registered with insurer', turn: 'broker', description: 'Broker submits the claim to the insurer.' },
  { id: 4, label: 'Insurer acknowledges claim', turn: 'insurer', description: 'Insurer confirms receipt and assigns a reference number.' },
  { id: 5, label: 'Assessor appointed', turn: 'insurer', description: 'Insurer appoints a vehicle assessor.' },
  { id: 6, label: 'Vehicle assessed', turn: 'insurer', description: 'Assessor inspects the vehicle and files a report.' },
  { id: 7, label: 'Claim approved or disputed', turn: 'insurer', description: 'Insurer approves, partially approves or disputes the claim.' },
  { id: 8, label: 'Excess paid', turn: 'client', description: 'Client pays the excess amount if applicable.' },
  { id: 9, label: 'Repairs authorised', turn: 'insurer', description: 'Insurer authorises repairs at an approved repairer.' },
  { id: 10, label: 'Claim closed', turn: 'client', description: 'Client reviews the outcome and closes the claim.' }
];

/* ── Sample clients ── */

const clients = [
  {
    id: 'c1',
    name: 'Thandi Mokoena',
    email: 'thandi@example.com',
    username: 'thandi',
    password: 'demo123',
    phone: '082 555 1234',
    broker: 'b1',
    assets: [],
    liabilities: [],
    documents: []
  },
  {
    id: 'c2',
    name: 'James and Priya Naidoo',
    email: 'james@example.com',
    username: 'james',
    password: 'demo123',
    phone: '083 555 5678',
    broker: 'b1',
    assets: [],
    liabilities: [],
    documents: []
  },
  {
    id: 'c3',
    name: 'Sipho Dlamini',
    email: 'sipho@example.com',
    username: 'sipho',
    password: 'demo123',
    phone: '084 555 9012',
    broker: 'b1',
    assets: [],
    liabilities: [],
    documents: []
  },
  {
    id: 'c4',
    name: 'Banele Phali',
    email: 'banele@example.com',
    username: 'Banele',
    password: 'demo123',
    phone: '082 555 3344',
    broker: 'b1',
    assets: [],
    liabilities: [],
    documents: []
  }
];

/* ── Sample goals ── */

const goals = [];

/* ── Sample reminders ── */

const reminders = [];

/* ── Sample claims ── */

const claims = [];

/* ── Brokers ── */

const brokers = [
  {
    id: 'b1',
    name: 'Lerato Khumalo',
    email: 'lerato@royalsquare.co.za',
    username: 'lerato',
    password: 'demo123',
    phone: '011 555 0100'
  }
];

/* ── Demo accounts ── */

// Mock credentials only. There is no real authentication here, and these sit
// in plain text because the demo has no backend and no secrets to protect.
function findAccount(username, password) {
  var name = String(username || '').trim().toLowerCase();
  var pass = String(password || '');

  var match = clients.find(function (c) {
    return c.username && c.username.toLowerCase() === name && c.password === pass;
  });
  if (match) return { role: 'client', id: match.id, name: match.name };

  match = brokers.find(function (b) {
    return b.username && b.username.toLowerCase() === name && b.password === pass;
  });
  if (match) return { role: 'broker', id: match.id, name: match.name };

  match = insurers.find(function (i) {
    return i.username && i.username.toLowerCase() === name && i.password === pass;
  });
  if (match) return { role: 'insurer', id: match.id, name: match.name };

  return null;
}

// What each role is called in the interface
const roleLabels = {
  client: 'Client',
  broker: 'Adviser',
  insurer: 'Insurer'
};

// Where each role lands once signed in
const dashboardForRole = {
  client: 'dashboard-client.html',
  broker: 'dashboard-broker.html',
  insurer: 'dashboard-broker.html'
};

/* ── Provider directory ── */

const providers = [
  { id: 'sanlam', name: 'Sanlam', category: 'Life and investments', phone: '0860 726 526', website: 'sanlam.co.za' },
  { id: 'old-mutual', name: 'Old Mutual', category: 'Life and investments', phone: '0860 247 365', website: 'oldmutual.co.za' },
  { id: 'liberty', name: 'Liberty', category: 'Life and investments', phone: '0860 456 789', website: 'liberty.co.za' },
  { id: 'momentum', name: 'Momentum', category: 'Life and investments', phone: '0860 111 636', website: 'momentum.co.za' },
  { id: 'discovery', name: 'Discovery', category: 'Health and life', phone: '0860 999 725', website: 'discovery.co.za' },
  { id: 'allan-gray', name: 'Allan Gray', category: 'Investments', phone: '0860 000 654', website: 'allangray.co.za' },
  { id: 'santam', name: 'Santam', category: 'Short-term insurance', phone: '0860 444 444', website: 'santam.co.za' }
];

/* ── Request types ── */

const requestTypes = [
  {
    id: 'change-address',
    name: 'Change of address',
    description: 'Update your residential address across all policies.',
    fields: [
      { name: 'newAddress', label: 'New address', type: 'textarea', required: true },
      { name: 'effectiveDate', label: 'Effective date', type: 'date', required: true },
      { name: 'proofDoc', label: 'Proof of new address', type: 'file', required: true }
    ]
  },
  {
    id: 'change-bank',
    name: 'Change of bank details',
    description: 'Update the bank account for premium debit orders or claim payouts.',
    fields: [
      { name: 'bankName', label: 'Bank name', type: 'text', required: true },
      { name: 'accountNumber', label: 'Account number', type: 'text', required: true },
      { name: 'branchCode', label: 'Branch code', type: 'text', required: true },
      { name: 'accountType', label: 'Account type', type: 'select', options: ['Savings', 'Cheque', 'Current'], required: true },
      { name: 'proofDoc', label: 'Bank statement or confirmation letter', type: 'file', required: true }
    ]
  },
  {
    id: 'policy-document',
    name: 'Request a policy document',
    description: 'Request a copy of your policy schedule, contract or certificate.',
    fields: [
      { name: 'policyNumber', label: 'Policy number (if known)', type: 'text', required: false },
      { name: 'documentType', label: 'Document type', type: 'select', options: ['Policy schedule', 'Contract', 'Certificate of insurance', 'Other'], required: true },
      { name: 'notes', label: 'Additional details', type: 'textarea', required: false }
    ]
  },
  {
    id: 'border-letter',
    name: 'Request a border letter',
    description: 'Get a letter confirming your vehicle is insured for cross-border travel.',
    fields: [
      { name: 'vehicleReg', label: 'Vehicle registration number', type: 'text', required: true },
      { name: 'countries', label: 'Countries you will visit', type: 'textarea', required: true },
      { name: 'travelDates', label: 'Travel dates', type: 'text', required: true, placeholder: 'e.g. 15 Dec 2024 to 5 Jan 2025' }
    ]
  },
  {
    id: 'irp5-request',
    name: 'Request an IRP5',
    description: 'Request an IRP5 tax certificate from your investment provider.',
    fields: [
      { name: 'providerName', label: 'Investment provider', type: 'select', options: ['Sanlam', 'Old Mutual', 'Liberty', 'Momentum', 'Discovery', 'Allan Gray'], required: true },
      { name: 'taxYear', label: 'Tax year', type: 'text', required: true, placeholder: 'e.g. 2024' },
      { name: 'accountNumber', label: 'Account or policy number', type: 'text', required: false }
    ]
  },
  {
    id: 'consultation',
    name: 'Request a consultation',
    description: 'Book a meeting with your adviser to review your portfolio or discuss changes.',
    fields: [
      { name: 'topic', label: 'What would you like to discuss?', type: 'textarea', required: true },
      { name: 'preferredDate', label: 'Preferred date', type: 'date', required: true },
      { name: 'preferredTime', label: 'Preferred time', type: 'select', options: ['Morning (08:00-12:00)', 'Afternoon (12:00-17:00)', 'Either'], required: true },
      { name: 'contactMethod', label: 'How should we contact you?', type: 'select', options: ['Phone call', 'Video call', 'In person'], required: true }
    ]
  }
];

/* ── Claim scene checklist items ── */

const sceneChecklist = [
  'Take photos of all vehicles involved',
  'Photograph the damage to each vehicle',
  'Photograph the road surface and surroundings',
  'Photograph registration discs and licence plates',
  'Note the exact location (street name, intersection or landmark)',
  'Record the date and time of the incident',
  'Get contact details of any witnesses',
  'Ask witnesses if they are willing to provide a statement',
  'Note the weather and road conditions',
  'Do not admit fault or sign any documents at the scene'
];

/* ── localStorage helpers for claims and requests ── */

function getSavedClaims() {
  try {
    var raw = localStorage.getItem(FINFLOW_STORAGE_PREFIX + 'claims');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveClaim(claim) {
  var saved = getAllClaims();
  claim.id = 'cl' + Date.now();
  claim.createdAt = new Date().toISOString();
  claim.currentStep = 1;
  saved.push(claim);
  localStorage.setItem(FINFLOW_STORAGE_PREFIX + 'claims', JSON.stringify(saved));
  return claim;
}

function getSavedRequests() {
  ensureDataVersion();
  try {
    var raw = localStorage.getItem(FINFLOW_STORAGE_PREFIX + 'requests');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRequest(request) {
  var saved = getSavedRequests();
  request.id = 'req' + Date.now();
  request.createdAt = new Date().toISOString();
  request.status = 'submitted';
  saved.push(request);
  localStorage.setItem(FINFLOW_STORAGE_PREFIX + 'requests', JSON.stringify(saved));
  return request;
}

// Seeds the sample claims into localStorage on first run, so the broker can
// advance a claim and both dashboards read the same record
function getAllClaims() {
  ensureDataVersion();
  var raw = localStorage.getItem(FINFLOW_STORAGE_PREFIX + 'claims');
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Fall through and seed again
    }
  }
  // Parsed back rather than handed over, so the seeded rows in this file stay
  // read only
  var seeded = JSON.stringify(claims);
  localStorage.setItem(FINFLOW_STORAGE_PREFIX + 'claims', seeded);
  return JSON.parse(seeded);
}

function getClaimsForClient(clientId) {
  return getAllClaims().filter(function (c) { return c.clientId === clientId; });
}

function getClaimById(claimId) {
  return getAllClaims().find(function (c) { return c.id === claimId; }) || null;
}

function updateClaim(updated) {
  var all = getAllClaims().map(function (c) {
    return c.id === updated.id ? updated : c;
  });
  localStorage.setItem(FINFLOW_STORAGE_PREFIX + 'claims', JSON.stringify(all));
  return updated;
}

// The broker moves a claim on one step at a time, on the insurer's behalf
function advanceClaim(claimId) {
  var claim = getClaimById(claimId);
  if (!claim || claim.currentStep >= claimSteps.length) return claim;
  claim.currentStep += 1;
  return updateClaim(claim);
}

function getClaimsForInsurer(insurerId) {
  return getAllClaims().filter(function (c) { return c.insurerId === insurerId; });
}

// An insurer handles whichever clients have a claim registered with it
function getClientsForInsurer(insurerId) {
  var ids = getClaimsForInsurer(insurerId).map(function (c) { return c.clientId; });
  return clients.filter(function (c) { return ids.indexOf(c.id) !== -1; });
}

function getBrokerById(brokerId) {
  return brokers.find(function (b) { return b.id === brokerId; }) || null;
}

function getClientById(clientId) {
  return clients.find(function (c) { return c.id === clientId; }) || null;
}

function getInsurerById(insurerId) {
  return insurers.find(function (i) { return i.id === insurerId; }) || null;
}
