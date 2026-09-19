/* ── Broker dashboard ── */
/* Shared with the insurer, who sees only the claims registered with them */

(function () {
  'use strict';

  /* ── Session ── */
  var session = requireAnyRole(['broker', 'insurer']);
  if (!session) return;

  var isInsurer = session.role === 'insurer';

  var account = isInsurer
    ? getInsurerById(session.id)
    : getBrokerById(session.id);

  if (!account) {
    clearSession();
    window.location.href = 'portal.html';
    return;
  }

  document.getElementById('brokerName').textContent = account.name;
  document.getElementById('headerRole').textContent = roleLabels[session.role];

  // Puts the sample claims into localStorage before any screen reads them
  getAllClaims();

  /* ── Format helpers ── */
  function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ── What each role may see ── */
  var tabsByRole = {
    broker: ['clients', 'claims', 'reminders', 'notifications', 'providers'],
    insurer: ['claims']
  };
  var allowedTabs = tabsByRole[session.role];

  var navButtons = document.querySelectorAll('.nav-btn');
  var screens = document.querySelectorAll('.screen');

  navButtons.forEach(function (btn) {
    btn.hidden = allowedTabs.indexOf(btn.dataset.tab) === -1;
  });

  /* ── Navigation ── */
  function showTab(tabName) {
    navButtons.forEach(function (btn) {
      btn.setAttribute('aria-selected', btn.dataset.tab === tabName ? 'true' : 'false');
    });
    screens.forEach(function (screen) {
      screen.classList.toggle('active', screen.id === 'screen-' + tabName);
    });
    window.scrollTo(0, 0);
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showTab(this.dataset.tab);
    });
  });

  /* ── Demo clock ── */
  var demoDateValue = document.getElementById('demoDateValue');
  var alertCount = document.getElementById('alertCount');
  var skipAhead = document.getElementById('btnSkipAhead');
  var resetClock = document.getElementById('btnResetClock');

  // Reminders this broker should see, once the demo date has reached them
  function dueReminders() {
    var demoDate = getDemoDate();
    return reminders.filter(function (r) {
      var forBroker = r.recipient === 'broker' || r.recipient === 'both';
      return forBroker && r.status === 'active' && isDue(r.triggerDate, demoDate);
    });
  }

  function renderClock() {
    // Reminders belong to the brokerage, so an insurer has no clock to move
    if (isInsurer) return;

    demoDateValue.textContent = formatDate(getDemoDate());

    var count = dueReminders().length;
    alertCount.textContent = String(count);
    alertCount.hidden = count === 0;
  }

  skipAhead.addEventListener('click', function () {
    advanceDemoDate(30);
    renderClock();
  });

  resetClock.addEventListener('click', function () {
    resetDemoDate();
    renderClock();
  });

  /* ── Insurer view ── */
  function applyInsurerView() {
    document.title = account.name + ' claims - Fin Flow';
    document.querySelector('.demo-clock').hidden = true;
    skipAhead.hidden = true;
    resetClock.hidden = true;

    var handled = getClientsForInsurer(account.id).length;
    document.querySelector('#screen-claims .screen-subtitle').textContent =
      handled === 1
        ? 'Claims registered with ' + account.name + ', for the one client you handle.'
        : 'Claims registered with ' + account.name + ', across the ' + handled + ' clients you handle.';
  }

  if (isInsurer) applyInsurerView();

  /* ── Sign out ── */
  document.getElementById('btnSignOut').addEventListener('click', function () {
    clearSession();
    window.location.href = 'portal.html';
  });

  // The demo runs as two windows on one laptop, so pick up the other one's writes
  window.addEventListener('storage', function () {
    renderClock();
  });

  showTab(allowedTabs[0]);
  renderClock();

})();
