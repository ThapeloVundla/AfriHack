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

function setSession(role, name) {
  localStorage.setItem(
    FINFLOW_STORAGE_PREFIX + 'session',
    JSON.stringify({ role, name, loginTime: new Date().toISOString() })
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
