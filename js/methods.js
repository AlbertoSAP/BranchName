// session : {
// name: Meyling Arias
// nickname: mespinoza 
// }
const verifySession = () =>{
  const session = JSON.parse(localStorage.getItem('session'))
  if(!session){
    console.log('no hay session');
  window.location.assign('http://127.0.0.1:5500/login.html')
  }
}
verifySession()

function searchAndLoadData(validate = false) {
  let taskname = document.getElementById("taskname");
  let where = document.getElementById("where");
  let whatisit = document.getElementById("whatisit");
  let tasknumber = document.getElementById("tasknumber");
  let nameBranch = document.getElementById("nameBranch");
  let contentNameBranch = document.getElementById("contentNameBranch");

  return validate
    ? [taskname, where, whatisit, tasknumber]
    : { taskname, where, whatisit, tasknumber, nameBranch, contentNameBranch };
}

function generateBranchName(example = false) {
  const isValid = example ? true : validateEmpty();
  if (isValid) {
    let {
      taskname,
      where,
      whatisit,
      tasknumber,
      nameBranch,
      contentNameBranch,
    } = searchAndLoadData();
    const tasknameReplace = taskname.value.replace(/\s/g, "-");
    const result = `aacevedo/${where.value}/${whatisit.value}/${tasknameReplace}-WF-${tasknumber.value}`;
    nameBranch.innerHTML = result;
    result && (contentNameBranch.style.display = "block");
    return;
  } else {
    return alert2("Por favor llene todos los campos!", "error");
  }
}

function runExample() {
  let { taskname, where, whatisit, tasknumber } = searchAndLoadData();
  taskname.value =
    "Archived programs showing in community search on marketing site";
  where.value = "searchPublicCommunities";
  whatisit.value = "fix";
  tasknumber.value = "1208601";
  generateBranchName(true);
}

function resetForm() {
  let { taskname, where, whatisit, tasknumber, nameBranch, contentNameBranch } =
    searchAndLoadData();
  taskname.value = "";
  where.value = "";
  whatisit.value = "";
  tasknumber.value = 0;
  nameBranch.innerHTML = "";
  contentNameBranch.style.display = "none";
}

const validateEmpty = () => {
  const fields = searchAndLoadData(true);
  let numberValidated = 0;
  fields.forEach((field) => {
    numberValidated = field.name = "tasknumber"
      ? +field.value == 0 && numberValidated + 1
      : field.value === "" && numberValidated + 1;
  });
  return numberValidated > 0 ? false : true;
};

const alert2 = (text = "", type = "info") => {
  let colors = [
    {
      name: "info",
      colors: "linear-gradient(to right, #41d2c1, #43483b)",
    },
    {
      name: "error",
      colors: "linear-gradient(to right, #ad1437, #464b3f)",
    },
  ];
  Toastify({
    text: text,
    className: type,
    style: {
      background: colors.find((e) => e.name === type).colors,
    },
  }).showToast();
};
