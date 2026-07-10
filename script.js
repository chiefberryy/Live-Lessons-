document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     Mobile navigation toggle
     ========================================================= */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('open')) return;
      if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* =========================================================
     Footer year
     ========================================================= */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     Academic planner (planner.html)
     ========================================================= */
  var taskForm = document.getElementById('taskForm');
  if (taskForm) {
    var STORAGE_KEY = 'academicPlannerTasks';
    var taskInput = document.getElementById('taskInput');
    var taskList = document.getElementById('taskList');
    var emptyState = document.getElementById('emptyState');
    var statTotal = document.getElementById('statTotal');
    var statDone = document.getElementById('statDone');
    var statPending = document.getElementById('statPending');

    function loadTasks() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        return [];
      }
    }

    function saveTasks(tasks) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
      catch (err) { /* storage unavailable — fail silently */ }
    }

    var tasks = loadTasks();

    function render() {
      taskList.innerHTML = '';

      if (tasks.length === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
        tasks.forEach(function (task) {
          var li = document.createElement('li');
          li.className = 'task-item' + (task.done ? ' done' : '');
          li.setAttribute('data-id', task.id);

          var check = document.createElement('span');
          check.className = 'task-check';
          check.textContent = task.done ? '✓' : '';

          var text = document.createElement('span');
          text.className = 'task-text';
          text.textContent = task.text;

          var remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'task-remove';
          remove.textContent = 'Delete';
          remove.setAttribute('aria-label', 'Delete task: ' + task.text);

          li.appendChild(check);
          li.appendChild(text);
          li.appendChild(remove);
          taskList.appendChild(li);

          li.addEventListener('click', function (e) {
            if (e.target === remove) return;
            task.done = !task.done;
            saveTasks(tasks);
            render();
          });

          remove.addEventListener('click', function (e) {
            e.stopPropagation();
            tasks = tasks.filter(function (t) { return t.id !== task.id; });
            saveTasks(tasks);
            render();
          });
        });
      }

      var doneCount = tasks.filter(function (t) { return t.done; }).length;
      statTotal.textContent = tasks.length;
      statDone.textContent = doneCount;
      statPending.textContent = tasks.length - doneCount;
    }

    taskForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = taskInput.value.trim();
      if (!text) return;
      tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), text: text, done: false });
      saveTasks(tasks);
      taskInput.value = '';
      taskInput.focus();
      render();
    });

    render();
  }

  /* =========================================================
     Contact form (contact.html)
     ========================================================= */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var phoneInput = document.getElementById('phone');
    var messageInput = document.getElementById('message');
    var formStatus = document.getElementById('formStatus');

    function setError(input, errorId, message) {
      var errorEl = document.getElementById(errorId);
      if (message) {
        input.classList.add('invalid');
        if (errorEl) errorEl.textContent = message;
      } else {
        input.classList.remove('invalid');
        if (errorEl) errorEl.textContent = '';
      }
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isValidPhone(value) {
      return value === '' || /^[0-9+()\-\s]{7,}$/.test(value);
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var phone = phoneInput.value.trim();
      var message = messageInput.value.trim();
      var valid = true;

      if (!name) { setError(nameInput, 'err-name', 'Please enter your name.'); valid = false; }
      else { setError(nameInput, 'err-name', ''); }

      if (!email || !isValidEmail(email)) { setError(emailInput, 'err-email', 'Please enter a valid email address.'); valid = false; }
      else { setError(emailInput, 'err-email', ''); }

      if (!isValidPhone(phone)) { setError(phoneInput, 'err-phone', 'Digits only, please.'); valid = false; }
      else { setError(phoneInput, 'err-phone', ''); }

      if (!message) { setError(messageInput, 'err-message', 'Let me know a bit about your project.'); valid = false; }
      else { setError(messageInput, 'err-message', ''); }

      formStatus.classList.remove('show', 'success', 'error');

      if (!valid) {
        formStatus.textContent = 'Please fix the highlighted fields and try again.';
        formStatus.classList.add('show', 'error');
        return;
      }

      var subject = encodeURIComponent('Project inquiry from ' + name);
      var body = encodeURIComponent(
        message + '\n\n— ' + name + '\n' + email + (phone ? '\n' + phone : '')
      );
      window.location.href = 'mailto:h.ofordum5202@miva.edu.ng?subject=' + subject + '&body=' + body;

      formStatus.textContent = 'Opening your email app to send this message…';
      formStatus.classList.add('show', 'success');
      contactForm.reset();
    });
  }

});