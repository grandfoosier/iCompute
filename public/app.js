try{
  const addMCQ = document.querySelector('.addMCQ');
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
      window.location.href='/manageMCQs/';
    } else {
      console.log('Options are not distinct');
    }
  });
}catch(e){}

try{
  const editMCQ = document.querySelector('.editMCQ');
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
      window.location.href='/manageMCQs/';
    } else {
      console.log('Options are not distinct');
    }
  });
}catch(e){}

try{
  const ChooseGrade = document.querySelector('.SelectDBPage')
  ChooseGrade.addEventListener('submit', (e) => {
    e.preventDefault();
    var dd = document.getElementById('grade');
    var grade = dd.options[dd.selectedIndex].value;
    get('/testmcq.html', {grade});
  });
}catch(e){}

try{
  const AddToTest = document.querySelector('.AllMCQ')
  AddToTest.addEventListener('submit', (e) => {
    e.preventDefault();
    var ref = window.location.href;
    var grade = (ref.substring(ref.length - 1, ref.length));
    var dd = document.getElementById('mcq_dd');
    var q_id = dd.options[dd.selectedIndex].value;
    post('/addToTest', {q_id, grade});
    window.location.href='/testmcq.html?grade='+ grade;
  });
}catch(e){}

try{
  const DelFromTest = document.querySelector('.TestMCQ')
  DelFromTest.addEventListener('submit', (e) => {
    e.preventDefault();
    var ref = window.location.href;
    var grade = (ref.substring(ref.length - 1, ref.length));
    var dd = document.getElementById('test_dd');
    var q_id = dd.options[dd.selectedIndex].value;
    post('/delFromTest', {q_id, grade});
    window.location.href='/testmcq.html?grade='+ grade
  });
}catch(e){}

try{
  const addGrader = document.querySelector('.addGrader');
  addGrader.addEventListener('submit', (e) => {
    e.preventDefault();
    const graderName = addGrader.querySelector('.graderName').value;
    const graderPW = addGrader.querySelector('.graderPW').value;
    post('/addGrader', {graderName, graderPW });
    window.location.href='/manageGraders/';
  });
}catch(e){}

try{
  const editGrader = document.querySelector('.editGrader');
  editGrader.addEventListener('submit', (e) => {
    e.preventDefault();
    const graderName = editGrader.querySelector('.graderName').value;
    const g_id = editGrader.querySelector('.g_id').value;
    post('/editGrader', {g_id, graderName});
    window.location.href='/manageGraders/';
  });
}catch(e){}

try{
  const resetPwGrader = document.querySelector('.resetPwGrader');
  resetPwGrader.addEventListener('submit', (e) => {
    e.preventDefault();
    var dd = document.getElementById('grader_dd');
    var g_id = dd.options[dd.selectedIndex].value;
    const graderPW = resetPwGrader.querySelector('.graderPW').value;
    post('/resetPwGrader', {g_id, graderPW });
    window.location.href='/manageGraders/';
  });
}catch(e){}

try{
  const addTeam = document.querySelector('.addTeam');
  addTeam.addEventListener('submit', (e) => {
    e.preventDefault();
    const today = new Date();
    const t_year = today.getFullYear();
    const school = addTeam.querySelector('.teamSchool').value;
    const grade = getRVBN('teamGrade_op');
    const teamPW = addTeam.querySelector('.teamPW').value;
    post('/addTeam', {t_year, school, grade, teamPW });
    window.location.href='/manageTeams/';
  });
}catch(e){}

try{
  const editTeam = document.querySelector('.editTeam');
  editTeam.addEventListener('submit', (e) => {
    e.preventDefault();
    const t_id = editTeam.querySelector('.t_id').value;
    const teamYear = editTeam.querySelector('.teamYear').value;
    const teamSchool = editTeam.querySelector('.teamSchool').value;
    const teamGrade = getRVBN('teamGrade_op');
    post('/editTeam', {t_id, teamYear, teamSchool, teamGrade });
    window.location.href='/manageTeams/';
  });
}catch(e){}

try{
  const resetPwTeam = document.querySelector('.resetPwTeam');
  resetPwTeam.addEventListener('submit', (e) => {
    e.preventDefault();
    var dd = document.getElementById('team_dd');
    var t_id = dd.options[dd.selectedIndex].value;
    const teamPW = resetPwTeam.querySelector('.teamPW').value;
    post('/resetPwTeam', {t_id, teamPW });
    window.location.href='/manageTeams/';
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
