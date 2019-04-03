try {const editSuper = document.querySelector('.editSuper');
  editSuper.addEventListener('submit', (e) => {
    e.preventDefault();
    const superName = editSuper.querySelector('.superName').value;
    post('/editSuper', {superName});
    window.location.href='/superDash/';
  });
} catch(e){}

try {const resetPwSuper = document.querySelector('.resetPwSuper');
  resetPwSuper.addEventListener('submit', (e) => {
    e.preventDefault();
    const superPW = resetPwSuper.querySelector('.superPW').value;
    post('/resetPwSuper', {superPW});
    window.location.href='/superDash/';
  });
} catch(e){}

try {const addGrader = document.querySelector('.addGrader');
  addGrader.addEventListener('submit', (e) => {
    e.preventDefault();
    const graderName = addGrader.querySelector('.graderName').value;
    const graderPW = addGrader.querySelector('.graderPW').value;
    post('/addGrader', {graderName, graderPW })
    window.location.href='/superDash/manageGraders/';
  });
} catch(e){}

try {const editGrader = document.querySelector('.editGrader');
  editGrader.addEventListener('submit', (e) => {
    e.preventDefault();
    const graderName = editGrader.querySelector('.graderName').value;
    const g_id = editGrader.querySelector('.g_id').value;
    post('/editGrader', {g_id, graderName});
    window.location.href='/superDash/manageGraders/';
  });
} catch(e){}

try {const resetPwGrader = document.querySelector('.resetPwGrader');
  resetPwGrader.addEventListener('submit', (e) => {
    e.preventDefault();
    var dd = document.getElementById('grader_dd');
    var g_id = dd.options[dd.selectedIndex].value;
    const graderPW = resetPwGrader.querySelector('.graderPW').value;
    post('/resetPwGrader', {g_id, graderPW });
    window.location.href='/superDash/manageGraders/';
  });
} catch(e){}

try {const addTeam = document.querySelector('.addTeam');
  addTeam.addEventListener('submit', (e) => {
    e.preventDefault();
    const today = new Date();
    const t_year = today.getFullYear();
    const school = addTeam.querySelector('.teamSchool').value;
    const grade = getRVBN('teamGrade_op');
    const teamPW = addTeam.querySelector('.teamPW').value;
    post('/addTeam', {t_year, school, grade, teamPW });
    window.location.href='/superDash/manageTeams/';
  });
} catch(e){}

try {const editTeam = document.querySelector('.editTeam');
  editTeam.addEventListener('submit', (e) => {
    e.preventDefault();
    const t_id = editTeam.querySelector('.t_id').value;
    const teamYear = editTeam.querySelector('.teamYear').value;
    const teamSchool = editTeam.querySelector('.teamSchool').value;
    const teamGrade = getRVBN('teamGrade_op');
    post('/editTeam', {t_id, teamYear, teamSchool, teamGrade });
    window.location.href='/superDash/manageTeams/';
  });
} catch(e){}

try {const resetPwTeam = document.querySelector('.resetPwTeam');
  resetPwTeam.addEventListener('submit', (e) => {
    e.preventDefault();
    var dd = document.getElementById('team_dd');
    var t_id = dd.options[dd.selectedIndex].value;
    const teamPW = resetPwTeam.querySelector('.teamPW').value;
    post('/resetPwTeam', {t_id, teamPW });
    window.location.href='/superDash/manageTeams/';
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
