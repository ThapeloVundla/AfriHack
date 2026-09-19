/* ── Client dashboard ── */

(function () {
  'use strict';

  /* ── Session ── */
  var session = requireRole('client');
  if (!session) return;

  var clientId = session.id || 'c1';
  var client = getClientById(clientId);
  if (!client) {
    clearSession();
    window.location.href = 'portal.html';
    return;
  }

  /* ── Format helpers ── */
  function formatCurrency(amount) {
    return 'R ' + amount.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function totalValue(items) {
    return items.reduce(function (sum, item) { return sum + item.value; }, 0);
  }

  /* ── Navigation ── */
  var tabButtons = document.querySelectorAll('.tab-btn');
  var bellButton = document.querySelector('.header-bell');
  var screens = document.querySelectorAll('.screen');

  function showTab(tabName) {
    tabButtons.forEach(function (btn) {
      btn.setAttribute('aria-selected', btn.dataset.tab === tabName ? 'true' : 'false');
    });
    screens.forEach(function (screen) {
      screen.classList.toggle('active', screen.id === 'screen-' + tabName);
    });
    // Reset sub-views when switching tabs
    if (tabName === 'claims') resetClaimsView();
    if (tabName === 'requests') resetRequestsView();
    window.scrollTo(0, 0);
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showTab(this.dataset.tab);
    });
  });

  if (bellButton) {
    bellButton.addEventListener('click', function () {
      showTab('notifications');
    });
  }

  /* ── Header ── */
  document.getElementById('headerUser').textContent = client.name.split(' ')[0];

  /* ── Home screen ── */
  function renderHome() {
    document.getElementById('homeName').textContent = client.name;

    var assets = totalValue(client.assets);
    var liabilities = totalValue(client.liabilities);
    var netWorth = assets - liabilities;

    var nwEl = document.getElementById('homeNetWorth');
    nwEl.textContent = formatCurrency(netWorth);
    nwEl.classList.add(netWorth >= 0 ? 'positive' : 'negative');

    document.getElementById('homeAssets').textContent = formatCurrency(assets);
    document.getElementById('homeLiabilities').textContent = formatCurrency(liabilities);

    // Bar chart
    var maxVal = Math.max(assets, liabilities);
    var chartEl = document.getElementById('homeChart');
    chartEl.innerHTML =
      '<div class="bar-row">' +
        '<span class="bar-label">Assets</span>' +
        '<div class="bar-track"><div class="bar-fill assets" style="width:' + (assets / maxVal * 100) + '%"></div></div>' +
        '<span class="bar-value">' + formatCurrency(assets) + '</span>' +
      '</div>' +
      '<div class="bar-row">' +
        '<span class="bar-label">Liabilities</span>' +
        '<div class="bar-track"><div class="bar-fill liabilities" style="width:' + (liabilities / maxVal * 100) + '%"></div></div>' +
        '<span class="bar-value">' + formatCurrency(liabilities) + '</span>' +
      '</div>';

    // Outstanding documents
    var docsEl = document.getElementById('homeDocuments');
    var outstanding = client.documents.filter(function (d) { return d.status === 'outstanding'; });
    if (outstanding.length === 0) {
      docsEl.innerHTML = '<div class="empty-state"><p>All documents received. Nothing outstanding.</p></div>';
    } else {
      docsEl.innerHTML = outstanding.map(function (doc) {
        return '<div class="document-item">' +
          '<span class="document-name">' + doc.name + '</span>' +
          '<span class="document-status outstanding">Outstanding</span>' +
        '</div>';
      }).join('');
    }

    // Bell badge
    var clientReminders = reminders.filter(function (r) {
      return r.clientId === clientId && (r.recipient === 'client' || r.recipient === 'both');
    });
    var badge = document.getElementById('bellBadge');
    if (clientReminders.length > 0 && badge) {
      badge.hidden = false;
    }
  }

  /* ── Goals screen ── */
  function renderGoals() {
    var clientGoals = goals.filter(function (g) { return g.clientId === clientId; });
    var listEl = document.getElementById('goalsList');

    if (clientGoals.length === 0) {
      listEl.innerHTML = '<div class="empty-state"><p>No goals set yet. Ask your adviser to add one.</p></div>';
      return;
    }

    listEl.innerHTML = clientGoals.map(function (goal) {
      var pct = Math.round((goal.current / goal.target) * 100);
      var badge = goal.type === 'shared'
        ? '<span class="goal-badge shared">Shared with spouse</span>'
        : '<span class="goal-badge individual">Individual</span>';

      return '<div class="goal-card">' +
        '<div class="goal-header">' +
          '<span class="goal-name">' + goal.name + '</span>' +
          badge +
        '</div>' +
        '<div class="goal-amounts">' +
          '<span><span class="goal-amount-current">' + formatCurrency(goal.current) + '</span> saved</span>' +
          '<span>Target: ' + formatCurrency(goal.target) + '</span>' +
        '</div>' +
        '<div class="goal-progress-track"><div class="goal-progress-fill" style="width:' + Math.min(pct, 100) + '%"></div></div>' +
        '<div class="goal-footer">' +
          '<span class="goal-percentage">' + pct + '%</span>' +
          '<span class="goal-deadline">By ' + formatDate(goal.deadline) + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ── Claims screen ── */
  var claimsListView = document.getElementById('claimsListView');
  var claimsReportView = document.getElementById('claimsReportView');
  var claimsRegisterView = document.getElementById('claimsRegisterView');
  var claimsTrackerView = document.getElementById('claimsTrackerView');
  var claimsSuccessView = document.getElementById('claimsSuccessView');

  function resetClaimsView() {
    claimsListView.hidden = false;
    claimsReportView.hidden = true;
    claimsRegisterView.hidden = true;
    claimsTrackerView.hidden = true;
    claimsSuccessView.hidden = true;
  }

  function renderClaimsList() {
    var allClaims = getClaimsForClient(clientId);
    var listEl = document.getElementById('claimsList');

    if (allClaims.length === 0) {
      listEl.innerHTML = '<div class="empty-state"><p>No claims yet. Report an accident or register a motor claim to get started.</p></div>';
      return;
    }

    listEl.innerHTML = allClaims.map(function (claim) {
      var insurer = getInsurerById(claim.insurerId);
      var stepInfo = claimSteps.find(function (s) { return s.id === claim.currentStep; });
      return '<div class="claim-card" data-claim-id="' + claim.id + '">' +
        '<div class="claim-card-header">' +
          '<span class="claim-card-vehicle">' + claim.vehicle + '</span>' +
          '<span class="claim-card-step">Step ' + claim.currentStep + ' of 10</span>' +
        '</div>' +
        '<div class="claim-card-insurer">' + (insurer ? insurer.name : 'Unknown insurer') + '</div>' +
        '<div class="claim-card-date">Reported ' + formatDate(claim.incidentDate || claim.createdAt) + '</div>' +
      '</div>';
    }).join('');

    // Click handler to open tracker
    listEl.querySelectorAll('.claim-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var claimId = this.dataset.claimId;
        openClaimTracker(claimId);
      });
    });
  }

  // Report an accident
  document.getElementById('btnReportAccident').addEventListener('click', function () {
    claimsListView.hidden = true;
    claimsReportView.hidden = false;
  });

  document.getElementById('backFromReport').addEventListener('click', function () {
    resetClaimsView();
  });

  document.getElementById('btnContinueToClaim').addEventListener('click', function () {
    claimsReportView.hidden = true;
    claimsRegisterView.hidden = false;
    populateInsurerPicker();
  });

  // Scene checklist
  function renderSceneChecklist() {
    var listEl = document.getElementById('sceneChecklist');
    listEl.innerHTML = sceneChecklist.map(function (item, i) {
      return '<li class="checklist-item">' +
        '<input type="checkbox" id="scene_' + i + '">' +
        '<label for="scene_' + i + '">' + item + '</label>' +
      '</li>';
    }).join('');
  }

  // Register a motor claim
  document.getElementById('btnRegisterClaim').addEventListener('click', function () {
    claimsListView.hidden = true;
    claimsRegisterView.hidden = false;
    populateInsurerPicker();
  });

  document.getElementById('backFromRegister').addEventListener('click', function () {
    resetClaimsView();
  });

  function populateInsurerPicker() {
    var select = document.getElementById('claimInsurer');
    if (select.options.length > 1) return; // already populated
    insurers.forEach(function (ins) {
      var opt = document.createElement('option');
      opt.value = ins.id;
      opt.textContent = ins.name;
      select.appendChild(opt);
    });
  }

  // Police notified toggle
  document.querySelectorAll('input[name="policeNotified"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      document.getElementById('caseNumberGroup').hidden = this.value !== 'yes';
    });
  });

  // Photo upload handling
  function setupPhotoUpload(areaId, inputId, previewsId, multiple) {
    var area = document.getElementById(areaId);
    var input = document.getElementById(inputId);
    var previews = document.getElementById(previewsId);

    area.addEventListener('click', function () { input.click(); });

    input.addEventListener('change', function () {
      var files = Array.from(this.files);
      files.forEach(function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var div = document.createElement('div');
          div.className = 'photo-preview';
          div.innerHTML = '<img src="' + e.target.result + '" alt="Uploaded photo">' +
            '<button type="button" class="photo-preview-remove" aria-label="Remove photo">&times;</button>';
          div.querySelector('.photo-preview-remove').addEventListener('click', function () {
            div.remove();
          });
          previews.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
      input.value = '';
    });
  }

  setupPhotoUpload('photoUploadArea', 'photoInput', 'photoPreviews', true);
  setupPhotoUpload('licenceUploadArea', 'licenceInput', 'licencePreviews', false);
  setupPhotoUpload('sketchUploadArea', 'sketchInput', 'sketchPreviews', false);

  // Claim form submission
  document.getElementById('claimForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var claim = {
      clientId: clientId,
      insurerId: document.getElementById('claimInsurer').value,
      vehicle: client.assets.find(function (a) { return a.name.toLowerCase().indexOf('vehicle') !== -1; }) ? client.assets.find(function (a) { return a.name.toLowerCase().indexOf('vehicle') !== -1; }).name : 'Vehicle',
      incidentDate: document.getElementById('claimDate').value,
      description: document.getElementById('claimDescription').value,
      policeNotified: document.querySelector('input[name="policeNotified"]:checked').value,
      caseNumber: document.getElementById('caseNumber').value,
      driverName: document.getElementById('driverName').value,
      vehicleUse: document.querySelector('input[name="vehicleUse"]:checked').value,
      photos: []
    };

    saveClaim(claim);

    claimsRegisterView.hidden = true;
    claimsSuccessView.hidden = false;
  });

  document.getElementById('btnBackToClaims').addEventListener('click', function () {
    resetClaimsView();
    renderClaimsList();
  });

  // Claim tracker
  function openClaimTracker(claimId) {
    var allClaims = getClaimsForClient(clientId);
    var claim = allClaims.find(function (c) { return c.id === claimId; });
    if (!claim) return;

    var insurer = getInsurerById(claim.insurerId);
    document.getElementById('trackerTitle').textContent = 'Claim tracker - ' + claim.vehicle;
    document.getElementById('trackerSubtitle').textContent = insurer ? 'Submitted to ' + insurer.name : '';

    var trackerEl = document.getElementById('claimTracker');
    trackerEl.innerHTML = claimSteps.map(function (step) {
      var status = step.id < claim.currentStep ? 'completed'
        : step.id === claim.currentStep ? 'active' : '';

      var marker = status === 'completed'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<span>' + step.id + '</span>';

      return '<div class="tracker-step ' + status + '">' +
        '<div class="tracker-marker">' + marker + '</div>' +
        '<div class="tracker-body">' +
          '<div class="tracker-label">' + step.label + '</div>' +
          '<div class="tracker-description">' + step.description + '</div>' +
          '<span class="tracker-turn ' + step.turn + '">' + step.turn.charAt(0).toUpperCase() + step.turn.slice(1) + '\'s turn</span>' +
        '</div>' +
      '</div>';
    }).join('');

    claimsListView.hidden = true;
    claimsTrackerView.hidden = false;
  }

  document.getElementById('backFromTracker').addEventListener('click', function () {
    resetClaimsView();
  });

  /* ── Requests screen ── */
  var requestsListView = document.getElementById('requestsListView');
  var requestFormView = document.getElementById('requestFormView');
  var requestsSuccessView = document.getElementById('requestsSuccessView');

  function resetRequestsView() {
    requestsListView.hidden = false;
    requestFormView.hidden = true;
    requestsSuccessView.hidden = true;
  }

  function renderRequestTypes() {
    var grid = document.getElementById('requestsGrid');
    var icons = {
      'change-address': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      'change-bank': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      'policy-document': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
      'border-letter': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      'irp5-request': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>',
      'consultation': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    };

    grid.innerHTML = requestTypes.map(function (rt) {
      return '<div class="request-type-card" data-request-id="' + rt.id + '">' +
        '<div class="request-type-icon">' + (icons[rt.id] || '') + '</div>' +
        '<div class="request-type-info">' +
          '<h3>' + rt.name + '</h3>' +
          '<p>' + rt.description + '</p>' +
        '</div>' +
      '</div>';
    }).join('');

    grid.querySelectorAll('.request-type-card').forEach(function (card) {
      card.addEventListener('click', function () {
        openRequestForm(this.dataset.requestId);
      });
    });
  }

  function openRequestForm(requestId) {
    var rt = requestTypes.find(function (r) { return r.id === requestId; });
    if (!rt) return;

    document.getElementById('requestFormTitle').textContent = rt.name;
    document.getElementById('requestFormDesc').textContent = rt.description;

    var form = document.getElementById('requestForm');
    form.innerHTML = '';

    rt.fields.forEach(function (field) {
      var group = document.createElement('div');
      group.className = 'form-group';

      var label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = field.label;
      if (field.required) label.textContent += ' *';
      group.appendChild(label);

      var input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.className = 'form-textarea';
        input.rows = 3;
      } else if (field.type === 'select') {
        input = document.createElement('select');
        input.className = 'form-select';
        var defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Choose an option';
        input.appendChild(defaultOpt);
        field.options.forEach(function (opt) {
          var o = document.createElement('option');
          o.value = opt;
          o.textContent = opt;
          input.appendChild(o);
        });
      } else if (field.type === 'file') {
        input = document.createElement('input');
        input.type = 'file';
        input.className = 'form-input';
        input.accept = 'image/*,.pdf';
      } else {
        input = document.createElement('input');
        input.type = field.type;
        input.className = 'form-input';
      }

      input.name = field.name;
      input.id = 'req_' + field.name;
      if (field.required) input.required = true;
      if (field.placeholder) input.placeholder = field.placeholder;
      group.appendChild(input);

      form.appendChild(group);
    });

    var submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-primary';
    submitBtn.style.width = '100%';
    submitBtn.textContent = 'Submit request';
    form.appendChild(submitBtn);

    requestsListView.hidden = true;
    requestFormView.hidden = false;
  }

  document.getElementById('backFromRequest').addEventListener('click', function () {
    resetRequestsView();
  });

  document.getElementById('requestForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var formData = {};
    var inputs = this.querySelectorAll('input, textarea, select');
    inputs.forEach(function (input) {
      if (input.name) {
        formData[input.name] = input.value;
      }
    });

    var titleEl = document.getElementById('requestFormTitle');
    saveRequest({
      clientId: clientId,
      type: titleEl.textContent,
      data: formData
    });

    document.getElementById('requestSuccessMsg').textContent =
      'Your "' + titleEl.textContent + '" request has been submitted. Your adviser will process it and get back to you.';

    requestFormView.hidden = true;
    requestsSuccessView.hidden = false;
  });

  document.getElementById('btnBackToRequests').addEventListener('click', function () {
    resetRequestsView();
  });

  /* ── Notifications screen ── */
  function renderNotifications() {
    var clientReminders = reminders.filter(function (r) {
      return r.clientId === clientId && (r.recipient === 'client' || r.recipient === 'both');
    });
    var listEl = document.getElementById('notificationsList');

    // Outstanding documents as notifications
    var outstandingDocs = client.documents.filter(function (d) { return d.status === 'outstanding'; });
    var docNotifications = outstandingDocs.map(function (doc) {
      return {
        type: 'document',
        title: 'Document outstanding: ' + doc.name,
        description: 'Please upload this document as soon as possible.',
        date: new Date().toISOString()
      };
    });

    var allNotifications = docNotifications.concat(clientReminders.map(function (r) {
      return {
        type: r.type,
        title: r.title,
        description: r.description,
        date: r.triggerDate
      };
    }));

    if (allNotifications.length === 0) {
      listEl.innerHTML = '<div class="empty-state"><p>No notifications right now. You are all caught up.</p></div>';
      return;
    }

    var typeIcons = {
      'document': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
      'review': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      'renewal': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>'
    };

    listEl.innerHTML = allNotifications.map(function (n) {
      return '<div class="notification-item">' +
        '<div class="notification-icon">' + (typeIcons[n.type] || typeIcons['document']) + '</div>' +
        '<div class="notification-body">' +
          '<span class="notification-type ' + n.type + '">' + n.type + '</span>' +
          '<div class="notification-title">' + n.title + '</div>' +
          '<div class="notification-desc">' + n.description + '</div>' +
          '<div class="notification-date">' + formatDate(n.date) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ── Init ── */
  renderHome();
  renderGoals();
  renderClaimsList();
  renderSceneChecklist();
  renderRequestTypes();
  renderNotifications();

})();
