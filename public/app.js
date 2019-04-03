try {const ChooseGrade = document.querySelector('.SelectDBPage')
  ChooseGrade.addEventListener('submit', (e) => {
    e.preventDefault();
    var dd = document.getElementById('grade');
    var grade = dd.options[dd.selectedIndex].value;
    get('/testmcq.html', {grade});
  });
} catch(e){}

try {const AddToTestL = document.querySelector('.AllMCQs')
  AddToTestL.addEventListener('submit', (e) => {
    e.preventDefault();
    var ref = window.location.href;
    var grade = (ref.substring(ref.length - 1, ref.length));
    $('#tableOfMCQs tbody tr input:checkbox').each(function() {
      if (this.checked) {
        q_id = this.value;
        post('/addToTest', {q_id, grade});
      }
      window.location.href='/superDash/testmcqlists.html?grade='+ grade;
    });
  });
} catch(e){}

try {const DelFromTestL = document.querySelector('.TestMCQs')
  DelFromTestL.addEventListener('submit', (e) => {
    e.preventDefault();
    var ref = window.location.href;
    var grade = (ref.substring(ref.length - 1, ref.length));
    $('#tableOfTestMCQs tbody tr input:checkbox').each(function() {
      if (this.checked) {
        q_id = this.value;
        console.log(q_id);
        post('/delFromTest', {q_id, grade});
      }
      window.location.href='/superDash/testmcqlists.html?grade='+ grade;
    });
  });
} catch(e){}

////////////////////////////////////////////////////////////////////////////////

try {const validateGrader = document.querySelector('.validateGrader');
  validateGrader.addEventListener('submit', (e) => {
    e.preventDefault();
    const graderName = validateGrader.querySelector('.graderName').value;
    const graderPW = validateGrader.querySelector('.graderPW').value;
    post('/validateGrader', {graderName, graderPW });

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
