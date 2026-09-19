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

/* ── Sign in ── */

// Checks the demo credentials in data.js. There is no real authentication.
signinForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('signin-username').value;
  const password = document.getElementById('signin-password').value;
  const account = findAccount(username, password);

  if (!account) {
    signinNote.textContent = 'We do not recognise that username and password. Check them and try again.';
    return;
  }

  setSession(account.role, account.name, account.id);
  window.location.href = dashboardForRole[account.role];
});

/* ── Create account ── */

// Creating an account is still visual only, because nothing here has a backend
signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  signupNote.textContent =
    'Sign up is part of the demo and does not create a real account. Sign in with one of the demo usernames instead.';
});

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
