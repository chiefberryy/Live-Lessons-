/* =========================================================
   Henry Ofordum Chidera — Portfolio
   Vanilla JS — no frameworks, no external libraries
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  setFooterYear();
  initMobileNav();
  initHeroTyping();
  initPlanner();
  initContactForm();
});

/* ---------------------------------------------------------
   Footer year
   --------------------------------------------------------- */
function setFooterYear() {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------------------------------------------------------
   Mobile navigation toggle
   --------------------------------------------------------- */
function initMobileNav() {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   Hero terminal "typing" effect (index.html only)
   --------------------------------------------------------- */
function initHeroTyping() {
  var target = document.getElementById('typed-msg');
  if (!target) return;

  var fullMessage = "Hey, welcome! My name is Henry Ofordum Chidera, and I'm excited to have you here. Thank you for taking the time to learn more about me.";
  var i = 0;
  var speed = 18;

  function typeNext() {
    if (i <= fullMessage.length) {
      target.textContent = fullMessage.slice(0, i);
      i++;
      setTimeout(typeNext, speed);
    }
  }
  typeNext();
}

/* ---------------------------------------------------------
   Academic Planner — array + event listeners + DOM manipulation
   --------------------------------------------------------- */
function initPlanner() {
  var form = document.getElementById('taskForm');
  var input = document.getElementById('taskInput');
  var list = document.getElementById('taskList');
  var emptyState = document.getElementById('emptyState');
  var statTotal = document.getElementById('statTotal');
  var statDone = document.getElementById('statDone');
  var statPending = document.getElementById('statPending');

  if (!form || !input || !list) return; // not on planner.html

  // In-memory task store: array of { id, text, completed }
  var tasks = [];
  var nextId = 1;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var value = input.value.trim();
    if (value === '') {
      input.focus();
      return;
    }
    tasks.push({ id: nextId++, text: value, completed: false });
    input.value = '';
    input.focus();
    render();
  });

  function toggleTask(id) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (task) {
      task.completed = !task.completed;
      render();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    render();
  }

  function render() {
    list.innerHTML = '';

    if (tasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }

    tasks.forEach(function (task) {
      var li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' done' : '');
      li.setAttribute('data-id', task.id);

      var check = document.createElement('span');
      check.className = 'task-check';
      check.textContent = task.completed ? '✓' : '';

      var text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = task.text;

      var deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'task-remove';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // don't trigger the toggle on the row
        deleteTask(task.id);
      });

      li.addEventListener('click', function () {
        toggleTask(task.id);
      });

      li.appendChild(check);
      li.appendChild(text);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });

    var doneCount = tasks.filter(function (t) { return t.completed; }).length;
    statTotal.textContent = tasks.length;
    statDone.textContent = doneCount;
    statPending.textContent = tasks.length - doneCount;
  }

  render(); // initial paint (empty state)
}

/* ---------------------------------------------------------
   Contact form validation
   --------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return; // not on contact.html

  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var phoneInput = document.getElementById('phone');
  var messageInput = document.getElementById('message');
  var status = document.getElementById('formStatus');

  var errName = document.getElementById('err-name');
  var errEmail = document.getElementById('err-email');
  var errPhone = document.getElementById('err-phone');
  var errMessage = document.getElementById('err-message');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var phone = phoneInput.value.trim();
    var message = messageInput.value.trim();

    var isValid = true;
    clearErrors();

    // a) empty field checks
    if (name === '') {
      showError(nameInput, errName, 'Please enter your name.');
      isValid = false;
    }
    if (email === '') {
      showError(emailInput, errEmail, 'Please enter your email address.');
      isValid = false;
    }
    if (phone === '') {
      showError(phoneInput, errPhone, 'Please enter your phone number.');
      isValid = false;
    }
    if (message === '') {
      showError(messageInput, errMessage, 'Please enter a message.');
      isValid = false;
    }

    // b) email format check — requires "@" and a domain with a dot
    if (email !== '') {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError(emailInput, errEmail, 'Enter a valid email address (e.g. name@example.com).');
        isValid = false;
      }
    }

    // c) phone must contain digits only (optional leading +)
    if (phone !== '') {
      var phonePattern = /^\+?[0-9]+$/;
      if (!phonePattern.test(phone)) {
        showError(phoneInput, errPhone, 'Phone number must contain digits only.');
        isValid = false;
      }
    }

    if (!isValid) {
      showStatus('Please fix the highlighted fields before submitting.', 'error');
      return;
    }

    // Simulated successful submission (no backend attached)
    showStatus('Message sent — thank you, ' + name + '! I will get back to you soon.', 'success');
    form.reset();
  });

  function showError(inputEl, errorEl, message) {
    inputEl.classList.add('invalid');
    errorEl.textContent = message;
  }

  function clearErrors() {
    [nameInput, emailInput, phoneInput, messageInput].forEach(function (el) {
      el.classList.remove('invalid');
    });
    [errName, errEmail, errPhone, errMessage].forEach(function (el) {
      el.textContent = '';
    });
    status.classList.remove('show', 'success', 'error');
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.classList.add('show', type);
  }
}
