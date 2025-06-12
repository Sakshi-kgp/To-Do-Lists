const input = document.getElementById('input');
const addbtn = document.getElementById('Addbtn');
const item = document.getElementById('item');
let editval = null;
const rect1 = document.querySelector('.rect1');

// Add or edit goal
function addgoals() {
  const inputValue = input.value.trim();
  if (!inputValue) {
    alert("Please enter your goal...");
    return;
  }

  let goals = JSON.parse(localStorage.getItem("goals")) || [];

  if (addbtn.value === "Edit") {
    // edit the goals in both page and in local storage
    const li = editval.target.parentElement;
    const p = li.querySelector('p');
    const oldText = p.textContent;
    const idx = goals.findIndex(g => g.input === oldText);
    if (idx !== -1) {
      goals[idx].input = inputValue;
      localStorage.setItem("goals", JSON.stringify(goals));
      p.textContent = inputValue;
      addbtn.value = "Add";
      input.value = "";
    }
    return;
  }

  // crate <li> <p> </p><input type="chekcbox"><button>edit</button><button>remove</button><li>
  const li = document.createElement('li');
  const p = document.createElement('p');
  p.textContent = inputValue;
  li.appendChild(p);

  const check = document.createElement('input');
  check.type = 'checkbox';
  check.classList.add('complete');

  // When checkbox changes, toggle strike and update localStorage
  check.addEventListener('change', () => {
    p.style.textDecoration = check.checked ? 'line-through' : 'none';
    let saved = JSON.parse(localStorage.getItem('goals')) || [];
    const ix = saved.findIndex(g => g.input === inputValue);
    if (ix !== -1) {
      saved[ix].done = check.checked;
      localStorage.setItem('goals', JSON.stringify(saved));
    }
  });

  li.appendChild(check);

  const editBtn = document.createElement('button');
  editBtn.textContent = "Edit";
  editBtn.classList.add('btn', 'edit');

  const removeBtn = document.createElement('button');
  removeBtn.textContent = "Remove";
  removeBtn.classList.add('btn', 'remove');

  li.appendChild(editBtn);
  li.appendChild(removeBtn);
  item.appendChild(li);

  // Save new goal
  goals.push({ input: inputValue, done: false });
  localStorage.setItem("goals", JSON.stringify(goals));

  input.value = "";
}

////function to remove or edit goal
function deletegoals(e) {
  if (e.target.textContent === "Remove") {
    const li = e.target.parentElement;
    deletelocal(li);
    item.removeChild(li);
  }
  if (e.target.textContent === "Edit") {
    const li = e.target.parentElement;
    const p = li.querySelector('p');
    input.value = p.textContent;
    input.focus();
    addbtn.value = "Edit";
    editval = e;
  }
}

// Load all goals when page is loaded
function getgoals() {
  const goals = JSON.parse(localStorage.getItem("goals")) || [];
  goals.forEach(todo => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    p.textContent = todo.input;
    li.appendChild(p);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.classList.add('complete');
    check.checked = !!todo.done;

    if (check.checked) {
      p.style.textDecoration = 'line-through';
    }

    check.addEventListener('change', () => {
      p.style.textDecoration = check.checked ? 'line-through' : 'none';
      let saved = JSON.parse(localStorage.getItem('goals')) || [];
      const ix = saved.findIndex(g => g.input === todo.input);
      if (ix !== -1) {
        saved[ix].done = check.checked;
        localStorage.setItem('goals', JSON.stringify(saved));
      }
    });

    li.appendChild(check);

    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.classList.add('btn', 'edit');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = "Remove";
    removeBtn.classList.add('btn', 'remove');

    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    item.appendChild(li);
  });
}

// Remove goal from localStorage
function deletelocal(li) {
  let goals = JSON.parse(localStorage.getItem("goals")) || [];
  const text = li.querySelector('p').textContent;
  const idx = goals.findIndex(g => g.input === text);
  if (idx !== -1) {
    goals.splice(idx, 1);
    localStorage.setItem("goals", JSON.stringify(goals));
  }
}

// Dark/light mode
const toggle = document.querySelector('#toggle');
const isdark = JSON.parse(localStorage.getItem("darkmode"));
if (isdark) {
  toggle.checked = true;
  document.body.classList.add('dark');
  item.classList.add('ul_color');
  rect1.classList.add('color');
}

toggle.addEventListener('change', () => {
  if (toggle.checked) {
    document.body.classList.add('dark');
    item.classList.add('ul_color');
    rect1.classList.add('color');
    localStorage.setItem("darkmode", true);
  } else {
    document.body.classList.remove('dark');
    item.classList.remove('ul_color');
    rect1.classList.remove('color');
    localStorage.setItem("darkmode", false);
  }
});
//eventlistener for adding goals,delete goals,get goals...
addbtn.addEventListener('click', addgoals);
item.addEventListener('click', deletegoals);
document.addEventListener('DOMContentLoaded', getgoals);

    //for add taks using enter key
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addgoals();
});
