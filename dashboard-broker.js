/* ── Broker dashboard ── */

(function () {
  'use strict';

  /* ── Session ── */
  var session = requireRole('broker');
  if (!session) return;

  var broker = getBrokerById(session.id) || brokers[0];
  if (!broker) {
    clearSession();
    window.location.href = 'portal.html';
    return;
  }

  document.getElementById('brokerName').textContent = broker.name;

  // Puts the sample claims into localStorage before any screen reads them
  getAllClaims();

  /* ── Format helpers ── */
  function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ── Navigation ── */
  var navButtons = document.querySelectorAll('.nav-btn');
  var screens = document.querySelectorAll('.screen');

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

  // Reminders this broker should see, once the demo date has reached them
  function dueReminders() {
    var demoDate = getDemoDate();
    return reminders.filter(function (r) {
      var forBroker = r.recipient === 'broker' || r.recipient === 'both';
      return forBroker && r.status === 'active' && isDue(r.triggerDate, demoDate);
    });
  }

  function renderClock() {
    demoDateValue.textContent = formatDate(getDemoDate());

    var count = dueReminders().length;
    alertCount.textContent = String(count);
    alertCount.hidden = count === 0;
  }

  document.getElementById('btnSkipAhead').addEventListener('click', function () {
    advanceDemoDate(30);
    renderClock();
  });

  document.getElementById('btnResetClock').addEventListener('click', function () {
    resetDemoDate();
    renderClock();
  });

  /* ── Sign out ── */
  document.getElementById('btnSignOut').addEventListener('click', function () {
    clearSession();
    window.location.href = 'portal.html';
  });

  // The demo runs as two windows on one laptop, so pick up the other one's writes
  window.addEventListener('storage', function () {
    renderClock();
  });

  renderClock();

})();
