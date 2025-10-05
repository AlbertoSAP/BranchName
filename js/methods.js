const urlApi = "https://namebranch-66f26-default-rtdb.firebaseio.com";
let headers = {
  "Contenet-Type": "application/json",
};

const getLocalInfomation = () => JSON.parse(localStorage.getItem("session"));

const verifySession = () => {
  const session = getLocalInfomation();
  if (!session) {
    console.log("no hay session");
    window.location.assign("login.html");
  } else {
    let perfilName = document.getElementById("namePerfil");
    console.log(session);
    perfilName.innerHTML = `Hi ${session.name}!`;
  }
};
verifySession();

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

function copyNameBranch() {
  const contentNameBranch = document.getElementById("nameBranch");
  const icon = document.getElementById("copy-icon");

  icon.className = "bi bi-check-lg pointer";

  navigator.clipboard
    .writeText(contentNameBranch.textContent)
    .then(() => {
      alert2(`✅ ¡Listo! Copiado al portapapeles.`, "info");
      setTimeout(() => {
        icon.className = "bi bi-clipboard pointer";
      }, 1000);
    })
    .catch((err) => {
      alert2("❌ Error al copiar.", "error");
    });
}

async function generateBranchName(example = false) {
  const { nickname } = getLocalInfomation();
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
    const result = `${nickname}/${where.value}/${whatisit.value}/${tasknameReplace}-WF-${tasknumber.value}`;
    nameBranch.innerHTML = result;
    result && (contentNameBranch.style.display = "block");
    !example &&
      result &&
      (await saveBranchInfo({
        taskname,
        where,
        whatisit,
        tasknumber,
        result: result ?? "",
      }));
    return;
  } else {
    return alert2("Por favor llene todos los campos!", "error");
  }
}

async function runExample() {
  let { taskname, where, whatisit, tasknumber } = searchAndLoadData();
  taskname.value =
    "Archived programs showing in community search on marketing site";
  where.value = "Community";
  whatisit.value = "fix";
  tasknumber.value = "1208601";
  await generateBranchName(true);
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

const logout = () => {
  localStorage.clear();
  window.location.reload();
};

const saveBranchInfo = async ({
  taskname,
  where,
  whatisit,
  tasknumber,
  result: branch,
}) => {
  const { nickname } = getLocalInfomation();
  try {
    const result = await axios.post(
      `${urlApi}/BranchInfo.json`,
      {
        [nickname]: {
          taskname: taskname.value,
          where: where.value,
          whatisit: whatisit.value,
          tasknumber: tasknumber.value,
          nameBranch: branch,
        },
      },
      headers
    );
    console.log("[save]", result);
  } catch (error) {
    console.log("[error]", error);
    return error;
  }
};
