try{
  const createMCQ = document.querySelector('.createMCQ');
  createMCQ.addEventListener('submit', (e) => {
    e.preventDefault();
    const today = new Date();
    var q_year = today.getFullYear();
    const question = createMCQ.querySelector('.question').value;
    const option1 = createMCQ.querySelector('.option1').value;
    const option2 = createMCQ.querySelector('.option2').value;
    const option3 = createMCQ.querySelector('.option3').value;
    const option4 = createMCQ.querySelector('.option4').value;
    const corr_op = getRVBN('corr_op');
    const ops = new Set([option1, option2, option3, option4]);
    if (ops.size == 4) {
      post('/createMCQ', {q_year, question, option1, option2, option3, option4, corr_op });
      window.location.href='/manageMCQs.html';
    } else {
      console.log('Options are not distinct');
    }
  });
}catch(e){}

try{
  const deleteMCQ = document.querySelector('.deleteMCQ');
  deleteMCQ.addEventListener('submit', (e) => {
    e.preventDefault();
    const today = new Date();
    var q_year = today.getFullYear();
    var dd = document.getElementById('mcq_dd');
    var q_id = dd.options[dd.selectedIndex].value;
    post('/deleteMCQ', {q_year, q_id });
    window.location.href='/manageMCQs.html';
  });
}catch(e){}

try{
  const addGrader = document.querySelector('.addGrader');
  addGrader.addEventListener('submit', (e) => {
    e.preventDefault();
    const graderName = addGrader.querySelector('.graderName').value;
    const graderPW = addGrader.querySelector('.graderPW').value;
    post('/addGrader', {graderName, graderPW });
    window.location.href='/manageGraders.html';
  });
}catch(e){}

try{
  const removeGrader = document.querySelector('.removeGrader');
  removeGrader.addEventListener('submit', (e) => {
    e.preventDefault();
    var dd = document.getElementById('grader_dd');
    var g_id = dd.options[dd.selectedIndex].value;
    post('/removeGrader', {g_id });
    window.location.href='/manageGraders.html';
  });
}catch(e){}

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
