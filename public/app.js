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
    if ($('#tableOfMCQs tbody tr input:checkbox:checked').length) {
      var q_ids = [];
      $('#tableOfMCQs tbody tr input:checkbox').each(function() {
        if (this.checked) {q_ids.push(this.value); }
      });
      addtotest(0, grade, q_ids);
    }
  });
} catch(e){}

try {const DelFromTestL = document.querySelector('.TestMCQs')
  DelFromTestL.addEventListener('submit', (e) => {
    e.preventDefault();
    var ref = window.location.href;
    var grade = (ref.substring(ref.length - 1, ref.length));
    if ($('#tableOfTestMCQs tbody tr input:checkbox:checked').length) {
      var q_ids = [];
      $('#tableOfTestMCQs tbody tr input:checkbox').each(function() {
        if (this.checked) {q_ids.push(this.value); }
      });
      delfromtest(0, grade, q_ids);
    }
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

function addtotest (i, grade, q_ids) {
  var q_id = q_ids[i];
  post('/addToTest', {q_id, grade}, loopadd(i, grade, q_ids))
};

function loopadd (i, grade, q_ids) {
  if (i+1==q_ids.length) {window.location.href='/superDash/testmcqlists.html?grade='+ grade;}
  else {addtotest(i+1, grade, q_ids); }
}

function delfromtest (i, grade, q_ids) {
  var q_id = q_ids[i];
  post('/delFromTest', {q_id, grade}, loopdel(i, grade, q_ids));
};

function loopdel (i, grade, q_ids) {
  if (i+1==q_ids.length) {window.location.href='/superDash/testmcqlists.html?grade='+ grade;}
  else {delfromtest(i+1, grade, q_ids); }
}

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
