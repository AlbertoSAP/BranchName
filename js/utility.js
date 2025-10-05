export const urlApi = "https://namebranch-66f26-default-rtdb.firebaseio.com";
export const headers = {
  "Contenet-Type": "application/json",
};

export const pipeGetInfoFirebase = (data) => {
  const firebaseInfo = [];
  Object.keys(data).map((key) => {
    firebaseInfo.push(data[key]);
  });
  return firebaseInfo;
};

export const getLocalInfomation = () =>
  JSON.parse(localStorage.getItem("session"));

export const alert2 = (text = "", type = "info") => {
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
