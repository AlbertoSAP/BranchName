import {
  pipeGetInfoFirebase,
  headers,
  urlApi,
  getLocalInfomation,
  alert2,
} from "./utility.js";

const sesion = getLocalInfomation();

function rotateIconContinuously(icon) {
  let angle = 0;
  function rotate() {
    angle = (angle + 5) % 360; // cambia 5 → velocidad
    icon.style.transform = `rotate(${angle}deg)`;
    requestAnimationFrame(rotate);
  }
  rotate();
}

const branchsInfo = async () => {
  let result;
  try {
    result = await axios.get(`${urlApi}/BranchInfo.json`);
  } catch (error) {
    return error;
  }
  return result;
};

window["copyNameBranchRow"] = function (branch, index) {
  const icon = document.getElementById(`copy-icon${index}`);
  console.log({ branch, index });

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

window["deleteNameBranchRow"] = async function (branch, index, key) {
  const icon = document.getElementById(`delete-icon${index}`);
  console.log({ branch, index });

  icon.className = "bi bi-arrow-clockwise pointer";
  rotateIconContinuously(icon);

  try {
    await axios.delete(`${urlApi}/BranchInfo/${key}.json`);
    alert2(`🗑️ ¡Listo! elimidado.`, "info");
    await generateBodyTable();
  } catch (error) {
    icon.className = "bi bi-trash pointer mt-1";
    alert2("❌ Error al elimiar.", "error");
  }
};

const generateBodyTable = async () => {
  const data = await branchsInfo();
  const info = pipeGetInfoFirebase(data.data);

  let branchListBody = document.getElementById("branchListBody");

  const branchs = [];
  for (const item of info) {
    if (item[sesion.nickname]) {
      branchs.push({ branch: item[sesion.nickname].nameBranch, key: item.key });
    }
  }

  const rows = branchs.map(({ branch, key }, index) => {
    return `
    <tr>
      <th scope="row">${index + 1}</th>
      <td>${branch}</td>
      <td> 
          <div class="d-flex justify-content-center"> 
            <i id='delete-icon${index + 1}' 
            onclick="deleteNameBranchRow('${branch}','${index + 1}','${key}')"
            role="button"
            class="bi bi-trash pointer mt-1">
            </i>
          </div>
      </td>
      <td> 
          <div class="d-flex justify-content-center"> 
            <i id='copy-icon${index + 1}' 
            onclick="copyNameBranchRow('${branch}','${index + 1}')"
            role="button"
            class="bi bi-clipboard pointer mt-1">
            </i>
          </div>
      </td>
   </tr>
   
  `;
  });

  branchListBody.innerHTML = rows.join("");
};

if (!!sesion) {
  generateBodyTable();
}
