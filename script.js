let ordensDeServico = [];
let colunaSelecionada = "";
const btnAbrirModal = document.querySelectorAll(".btn-add");
const btnAdicionarCard = document.getElementById("btn-adicionar");
const btnFecharModal = document.querySelector(".btn-close");

const formCriarOs = document.getElementById("form-os");
const modal = document.getElementById("modal");

btnFecharModal.addEventListener("click", () => {
  modal.close();
});
btnAbrirModal.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    colunaSelecionada = e.currentTarget.dataset.coluna;
    modal.showModal();
  });
});

formCriarOs.addEventListener("submit", (e) => {
  e.preventDefault();
  const dadoTitulo = document.getElementById("titulo").value;
  const dadoDescricao = document.getElementById("descricao").value;
  const dadoPrioridade = document.getElementById("prioridade").value;
  const dataHoje = new Date().toLocaleDateString("pt-BR");
  const novaOrdem = {
    id: Date.now(),
    titulo: dadoTitulo,
    descricao: dadoDescricao,
    status: colunaSelecionada,
    prioridade: dadoPrioridade,
    dataEntrada: dataHoje,
  };
  ordensDeServico.push(novaOrdem);
  renderizarCards(ordensDeServico);
  salvarDados();
  formCriarOs.reset();
  modal.close();
});

const nomesDosStatus = {
  fila: "Fila de Triagem",
  bancada: "Em Bancada",
  "aguardando-peca": "Aguardando Peça",
  concluido: "Concluído",
};

const renderizarCards = (array) => {
  document.getElementById("fila").innerHTML = "";
  document.getElementById("bancada").innerHTML = "";
  document.getElementById("aguardando-peca").innerHTML = "";
  document.getElementById("concluido").innerHTML = "";

  array.forEach((ordem) => {
    const prioridadeFormatada =
      ordem.prioridade.charAt(0).toUpperCase() + ordem.prioridade.slice(1);

    const cardHTML = `
      <li class="card" id="${ordem.id}" draggable="true">
        <div class="card-header">
        <div class="card-header-actions">
        <p class="card-status">${nomesDosStatus[ordem.status]}</p>
        <button class="btn-excluir"><img src="icons/trash.svg" alt="Excluir ordem de serviço" /></button>
        </div>
          <h3 class="card-title">${ordem.titulo}</h3>
        </div>
        <p class="card-description">${ordem.descricao}</p>
        <div class="card-footer">
          <div class="card-info">
            <img class="card-icon" src="icons/flag.svg" alt="Data de entrada" />
            <p class="date card-date">${ordem.dataEntrada}</p>
          </div>
          <p class="card-priority">Prioridade: ${prioridadeFormatada}</p>
        </div>
      </li>
    `;

    const colunaDestino = document.getElementById(ordem.status);

    if (colunaDestino) {
      colunaDestino.insertAdjacentHTML("beforeend", cardHTML);
    } else {
      console.error(
        `Erro: Coluna com ID '${ordem.status}' não encontrada no HTML.`,
      );
    }
  });
  const cards = document.querySelectorAll(".card");
  const btnDeletarCard = document.querySelectorAll(".btn-excluir");
  cards.forEach((card) => {
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  });
  btnDeletarCard.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idExcluir = e.target.closest(".card").id;
      ordensDeServico = ordensDeServico.filter(
        (ordem) => ordem.id !== Number(idExcluir),
      );
      renderizarCards(ordensDeServico);
      salvarDados();
    });
  });
};

const colunas = document.querySelectorAll(".kanban-column");

colunas.forEach((coluna) => {
  coluna.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  coluna.addEventListener("drop", (e) => {
    e.preventDefault();
    const idCard = e.dataTransfer.getData("text/plain");
    const novoStatus = e.target.closest(".cards").id;
    const buscarId = ordensDeServico.find(
      (ordem) => ordem.id === Number(idCard),
    );
    if (buscarId) {
      buscarId.status = novoStatus;
      renderizarCards(ordensDeServico);
    }
    salvarDados();
  });
});

const salvarDados = () => {
  localStorage.setItem("ordensDeServico", JSON.stringify(ordensDeServico));
};

const carregarDados = () => {
  return JSON.parse(localStorage.getItem("ordensDeServico"));
};

if (localStorage.getItem("ordensDeServico")) {
  ordensDeServico = carregarDados();
}
renderizarCards(ordensDeServico);
