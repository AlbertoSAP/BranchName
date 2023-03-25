const urlApi = "https://namebranch-66f26-default-rtdb.firebaseio.com";
let headers = {
  "Contenet-Type": "application/json",
};

// save Session

const saveSession = (sessionInformation) => {
  localStorage.setItem("session", JSON.stringify(sessionInformation));
};

// decode User

const pipeUser = (data) => {
  const users = [];
  Object.keys(data).map((key) => {
    users.push(data[key]);
  });
  return users;
};

// where I am
const whereIAm = () => {
  const IAmIn = window.location.pathname;
  return IAmIn === register ? true : false;
};

// => Login
function searchAndLoadDataLogin(validate = false) {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  return validate ? [email, password] : { email, password };
}

function searchAndLoadDataRegister(validate = false) {
  let name = document.getElementById("name");
  let lastName = document.getElementById("lastName");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirmPassword");

  return validate
    ? [name, lastName, email, password, confirmPassword]
    : { name, lastName, email, password, confirmPassword };
}
const validateEmpty = () => {
  const fields = whereIAm()
    ? searchAndLoadDataRegister(true) ?? []
    : searchAndLoadDataLogin(true) ?? [];
  let numberValidated = 0;
  fields.forEach((field) => {
    field.value === "" && numberValidated + 1;
  });
  return numberValidated === fields.length ? true : false;
};

const validatePassword = (password, confirmPassword) => {
  if (password === confirmPassword) {
    return { isvalid: true, message: "" };
  }
  return { isvalid: false, message: "Passwords do not match." };
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

// Register
const register = async () => {
  let { name, lastName, email, password, confirmPassword } =
    searchAndLoadDataRegister();
  if (!validateEmpty()) {
    const { isvalid, message } = validatePassword(
      password.value,
      confirmPassword.value
    );
    if (isvalid) {
      var firstCharacterOfTheLastName = name.value.charAt(0).toLowerCase();
      let nickname = `${firstCharacterOfTheLastName}${lastName.value.toLowerCase()}`;
      const loginInfomation = {
        nickname: nickname,
        name: name.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      };
      try {
        await registerPost(loginInfomation);
        alert2("Has been successfully registered!", "info");
        window.location.assign("../login.html");
      } catch (error) {
        alert2("Error trying to register, please try again.!", "error");
      }
    }
    alert2(message, "error");
  }
  alert2("Please verify that the fields are filled in.!", "error");
};

// Login
const login = async () => {
  console.log("login");
  let { email, password } = searchAndLoadDataLogin();
  if (!validateEmpty()) {
    try {
      const data = await getUsers();
      const users = pipeUser(data.data);
      const userInfomation = users.find((user) => user.email === email.value);

      if (!!userInfomation) {
        if (userInfomation.password === password.value) {
          alert2("successfully!", "info");
          saveSession({
            email: userInfomation.email,
            nickname: userInfomation.nickname,
            name: `${userInfomation.name} ${userInfomation.lastName}`,
          });
          window.location.assign("../index.html");
        } else {
          alert2("Incorrect password or email, please check.", "error");
        }
      } else {
        alert2("No account with your credentials was found.", "error");
      }
    } catch (error) {
      alert2(error, "error");
    }
  }
};

//   register post
const registerPost = async (RegisterInfomation) => {
  console.log("post");
  try {
    await axios.post(`${urlApi}/Users.json`, RegisterInfomation, headers);
  } catch (error) {
    return error;
  }
};

// getAllUser
const getUsers = async () => {
  let result;
  try {
    result = await axios.get(`${urlApi}/Users.json`);
  } catch (error) {
    return error;
  }
  return result;
};

function resetForm() {
  let { name, lastName, email, password, confirmPassword } =
    searchAndLoadDataRegister();
  name.value = "";
  lastName.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
}
