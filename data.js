/* ── Fin Flow sample data ── */

const FINFLOW_STORAGE_PREFIX = 'finflow:';

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

function requireRole(expectedRole) {
  const session = getSession();
  if (!session || session.role !== expectedRole) {
    window.location.href = 'portal.html';
    return null;
  }
  return session;
}

/* ── Insurers ── */

const insurers = [
  { id: 'sanlam', name: 'Sanlam', claimsPhone: '0860 726 526' },
  { id: 'old-mutual', name: 'Old Mutual', claimsPhone: '0860 247 365' },
  { id: 'liberty', name: 'Liberty', claimsPhone: '0860 456 789' },
  { id: 'momentum', name: 'Momentum', claimsPhone: '0860 111 636' },
  { id: 'discovery', name: 'Discovery', claimsPhone: '0860 999 725' },
  { id: 'allan-gray', name: 'Allan Gray', claimsPhone: '0860 000 654' },
  { id: 'santam', name: 'Santam', claimsPhone: '0860 444 444' }
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
    phone: '082 555 1234',
    broker: 'b1',
    assets: [
      { name: 'Primary residence', value: 1850000 },
      { name: 'Vehicle - Toyota Hilux', value: 380000 },
      { name: 'Sanlam retirement annuity', value: 520000 },
      { name: 'Allan Gray investment', value: 275000 },
      { name: 'Savings account', value: 45000 }
    ],
    liabilities: [
      { name: 'Home loan', value: 1200000 },
      { name: 'Vehicle finance', value: 210000 }
    ],
    documents: [
      { id: 'd1', name: 'ID copy', status: 'received' },
      { id: 'd2', name: 'Proof of address', status: 'received' },
      { id: 'd3', name: 'Payslip - latest', status: 'outstanding' }
    ]
  },
  {
    id: 'c2',
    name: 'James and Priya Naidoo',
    email: 'james@example.com',
    phone: '083 555 5678',
    broker: 'b1',
    assets: [
      { name: 'Primary residence', value: 2400000 },
      { name: 'Vehicle - BMW X3', value: 520000 },
      { name: 'Liberty living annuity', value: 980000 },
      { name: 'Old Mutual unit trusts', value: 410000 },
      { name: 'Joint savings', value: 120000 }
    ],
    liabilities: [
      { name: 'Home loan', value: 950000 },
      { name: 'Vehicle finance', value: 310000 }
    ],
    documents: [
      { id: 'd4', name: 'ID copies - both', status: 'received' },
      { id: 'd5', name: 'Marriage certificate', status: 'received' }
    ]
  },
  {
    id: 'c3',
    name: 'Sipho Dlamini',
    email: 'sipho@example.com',
    phone: '084 555 9012',
    broker: 'b1',
    assets: [
      { name: 'Vehicle - VW Polo', value: 195000 },
      { name: 'Discovery retirement fund', value: 340000 },
      { name: 'Savings account', value: 28000 }
    ],
    liabilities: [
      { name: 'Vehicle finance', value: 140000 },
      { name: 'Credit card', value: 15000 }
    ],
    documents: [
      { id: 'd6', name: 'ID copy', status: 'received' },
      { id: 'd7', name: 'Proof of address', status: 'outstanding' }
    ]
  }
];

/* ── Sample goals ── */

const goals = [
  {
    id: 'g1',
    clientId: 'c1',
    name: 'Emergency fund',
    target: 100000,
    current: 45000,
    type: 'individual',
    deadline: '2025-12-31'
  },
  {
    id: 'g2',
    clientId: 'c1',
    name: 'Pay off vehicle',
    target: 210000,
    current: 85000,
    type: 'individual',
    deadline: '2026-06-30'
  },
  {
    id: 'g3',
    clientId: 'c2',
    name: 'Children education fund',
    target: 500000,
    current: 180000,
    type: 'shared',
    deadline: '2028-01-31',
    sharedWith: 'spouse'
  },
  {
    id: 'g4',
    clientId: 'c2',
    name: 'Retire at 60',
    target: 3000000,
    current: 1390000,
    type: 'shared',
    deadline: '2032-03-01',
    sharedWith: 'spouse'
  },
  {
    id: 'g5',
    clientId: 'c3',
    name: 'Debt-free by 2026',
    target: 155000,
    current: 60000,
    type: 'individual',
    deadline: '2026-06-30'
  }
];

/* ── Sample reminders ── */

const reminders = [
  {
    id: 'r1',
    clientId: 'c1',
    type: 'document',
    title: 'Payslip outstanding',
    description: 'Thandi has not submitted her latest payslip.',
    recipient: 'broker',
    triggerDate: '2024-11-01',
    recurring: false,
    status: 'active'
  },
  {
    id: 'r2',
    clientId: 'c2',
    type: 'review',
    title: 'Annual policy review due',
    description: 'James and Priya\'s annual review is scheduled for next month.',
    recipient: 'both',
    triggerDate: '2024-12-01',
    recurring: 'yearly',
    status: 'active'
  },
  {
    id: 'r3',
    clientId: 'c3',
    type: 'document',
    title: 'Proof of address outstanding',
    description: 'Sipho needs to provide proof of address.',
    recipient: 'client',
    triggerDate: '2024-11-15',
    recurring: false,
    status: 'active'
  },
  {
    id: 'r4',
    clientId: 'c1',
    type: 'renewal',
    title: 'Vehicle insurance renewal',
    description: 'Thandi\'s vehicle insurance renews on 1 December.',
    recipient: 'both',
    triggerDate: '2024-12-01',
    recurring: 'yearly',
    status: 'active'
  }
];

/* ── Sample claims ── */

const claims = [
  {
    id: 'cl1',
    clientId: 'c3',
    insurerId: 'santam',
    vehicle: 'VW Polo 2022',
    incidentDate: '2024-10-28',
    description: 'Rear-ended at a traffic light on William Nicol Drive. Rear bumper and boot lid damaged.',
    currentStep: 4,
    photos: [],
    createdAt: '2024-10-28T14:30:00Z'
  }
];

/* ── Brokers ── */

const brokers = [
  {
    id: 'b1',
    name: 'Lerato Khumalo',
    email: 'lerato@royalsquare.co.za',
    phone: '011 555 0100'
  }
];

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
  var saved = getSavedClaims();
  claim.id = 'cl' + Date.now();
  claim.createdAt = new Date().toISOString();
  claim.currentStep = 1;
  saved.push(claim);
  localStorage.setItem(FINFLOW_STORAGE_PREFIX + 'claims', JSON.stringify(saved));
  return claim;
}

function getSavedRequests() {
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

function getClientById(clientId) {
  return clients.find(function (c) { return c.id === clientId; }) || null;
}

function getInsurerById(insurerId) {
  return insurers.find(function (i) { return i.id === insurerId; }) || null;
}
