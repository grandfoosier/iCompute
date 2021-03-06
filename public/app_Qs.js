try {const addMCQ = document.querySelector('.addMCQ');
  addMCQ.addEventListener('submit', (e) => {
    e.preventDefault();
    const today = new Date();
    var q_year = today.getFullYear();
    const question = addMCQ.querySelector('.question').value;
    const option1 = addMCQ.querySelector('.option1').value;
    const option2 = addMCQ.querySelector('.option2').value;
    const option3 = addMCQ.querySelector('.option3').value;
    const option4 = addMCQ.querySelector('.option4').value;
    const corr_op = getRVBN('corr_op');
    const ops = new Set([option1, option2, option3, option4]);
    if (ops.size == 4) {
      post('/addMCQ', {q_year, question, option1, option2, option3, option4, corr_op });
      window.location.href='/superDash/manageMCQs/';
    } else {
      console.log('Options are not distinct');
    }
  });
} catch(e){}

try {const editMCQ = document.querySelector('.editMCQ');
  editMCQ.addEventListener('submit', (e) => {
    e.preventDefault();
    const q_id = editMCQ.querySelector('.q_id').value;
    const o_id = editMCQ.querySelector('.o_id').value;
    const q_year = editMCQ.querySelector('.q_year').value;
    const question = editMCQ.querySelector('.question').value;
    const option1 = editMCQ.querySelector('.option1').value;
    const option2 = editMCQ.querySelector('.option2').value;
    const option3 = editMCQ.querySelector('.option3').value;
    const option4 = editMCQ.querySelector('.option4').value;
    const corr_op = getRVBN('corr_op');
    const ops = new Set([option1, option2, option3, option4]);
    if (ops.size == 4) {
      post('/editMCQ', {q_id, o_id, q_year, question, option1, option2, option3, option4, corr_op });
      window.location.href='/superDash/manageMCQs/';
    } else {
      console.log('Options are not distinct');
    }
  });
} catch(e){}

try {const editScratch = document.querySelector('.editScratch');
  editScratch.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('app');
    const q_id = editScratch.querySelector('.q_id').value;
    const q_year = editScratch.querySelector('.q_year').value;
    const question = editScratch.querySelector('.question').value;
    post('/editBorC', {q_id, q_year, question });
    window.location.href='/superDash/manageScratch/';
  });
} catch(e){}

try {const editSA = document.querySelector('.editSA');
  editSA.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('app');
    const q_id = editSA.querySelector('.q_id').value;
    const q_year = editSA.querySelector('.q_year').value;
    const question = editSA.querySelector('.question').value;
    post('/editBorC', {q_id, q_year, question });
    window.location.href='/superDash/manageSAs/';
  });
} catch(e){}

////////////////////////////////////////////////////////////////////////////////

function getRVBN(rName) {
  var radioButtons = document.getElementsByName(rName);
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) return radioButtons[i].value;
  }
  return '';
}

function post(path, data) {
  return fetch(path, {
    method  : 'POST',
    headers : {'Accept'       : 'application/json',
               'Content-Type' : 'application/json'},
    body    : JSON.stringify(data)
  });
}

function get(path) {
  return fetch(path, {
    method  : 'GET',
    headers : {'Accept'       : 'application/json'}
  });
}
