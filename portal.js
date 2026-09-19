/* ── Portal ── */

const signinPanel = document.getElementById('signin-panel');
const signupPanel = document.getElementById('signup-panel');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const signinNote = document.getElementById('signin-note');
const signupNote = document.getElementById('signup-note');

/* ── Switching between the two panels ── */

function showPanel(name) {
  const toSignup = name === 'signup';

  signinPanel.hidden = toSignup;
  signupPanel.hidden = !toSignup;

  signinNote.textContent = '';
  signupNote.textContent = '';

  const panel = toSignup ? signupPanel : signinPanel;
  panel.querySelector('input').focus();
}

document.getElementById('show-signup').addEventListener('click', () => showPanel('signup'));
document.getElementById('show-signin').addEventListener('click', () => showPanel('signin'));

/* ── Show and hide password ── */

document.querySelectorAll('.password-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const input = document.getElementById(toggle.dataset.toggleFor);
    const showing = input.type === 'text';

    input.type = showing ? 'password' : 'text';
    toggle.setAttribute('aria-pressed', String(!showing));
    toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    toggle.querySelector('.icon-eye').hidden = !showing;
    toggle.querySelector('.icon-eye-off').hidden = showing;

    input.focus();
  });
});

/* ── Forms ── */

// Both forms are visual only, so a valid submit explains where to go instead
function explainDemoForm(note) {
  return (event) => {
    event.preventDefault();
    note.textContent =
      'This form is part of the demo and does not sign anyone in yet. Use the demo pipeline buttons below to open a dashboard.';
  };
}

signinForm.addEventListener('submit', explainDemoForm(signinNote));
signupForm.addEventListener('submit', explainDemoForm(signupNote));

/* ── Demo pipeline ── */

const demoAccounts = {
  client: { person: clients[0], page: 'dashboard-client.html' },
  broker: { person: brokers[0], page: 'dashboard-broker.html' }
};

document.querySelectorAll('[data-demo-role]').forEach((button) => {
  button.addEventListener('click', () => {
    const role = button.dataset.demoRole;
    const account = demoAccounts[role];

    setSession(role, account.person.name, account.person.id);
    window.location.href = account.page;
  });
});
