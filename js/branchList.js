import {
  pipeGetInfoFirebase,
  headers,
  urlApi,
  getLocalInfomation,
  alert2,
} from "./utility.js";

const sesion = getLocalInfomation();

const branchsInfo = async () => {
  let result;
  try {
    result = await axios.get(`${urlApi}/BranchInfo.json`);
  } catch (error) {
    return error;
  }
  return result;
};

window["copyNameBranchRow"] = function (branch) {
  const icon = document.getElementById("copy-icon");
  icon.className = "bi bi-check-lg pointer";

  navigator.clipboard
    .writeText(branch)
    .then(() => {
      alert2(`✅ ¡Listo! Copiado al portapapeles.`, "info");
      setTimeout(() => {
        icon.className = "bi bi-clipboard pointer";
      }, 1000);
    })
    .catch((err) => {
      alert2("❌ Error al copiar.", "error");
    });
};

const generateBodyTable = async () => {
  const data = await branchsInfo();
  const info = pipeGetInfoFirebase(data.data);

  let branchListBody = document.getElementById("branchListBody");

  const branchs = [];
  for (const item of info) {
    if (item[sesion.nickname]) {
      branchs.push(item[sesion.nickname].nameBranch);
    }
  }

  const rows = branchs.map((branch, index) => {
    return `
    <tr>
      <th scope="row">${index + 1}</th>
      <td>${branch}</td>
      <td> 
          <div class="d-flex justify-content-center"> 
            <i id="copy-icon" onclick="copyNameBranchRow('${branch}')"
            role="button"
            class="bi bi-clipboard pointer mt-1">
            </i>
          </div>
      </td>
   </tr>
  `;
  });

  console.log(rows);

  branchListBody.innerHTML = rows.join("");
};

if (!!sesion) {
  generateBodyTable();
}
