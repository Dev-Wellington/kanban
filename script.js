const ordensDeServico = [
  {
    id: 1,
    titulo: "Formatação e Backup",
    descricao:
      "Realizar backup da pasta Documentos e formatar com Windows 11. Instalar pacote Office básico.",
    status: "fila",
    prioridade: "alta",
    dataEntrada: "2026-06-05",
  },
  {
    id: 2,
    titulo: "Limpeza Preventiva e Pasta Térmica",
    descricao:
      "Desmontagem completa, remoção de poeira, limpeza de contatos das memórias e troca da pasta térmica do processador e placa de vídeo.",
    status: "bancada",
    prioridade: "media",
    dataEntrada: "2026-06-06",
  },
  {
    id: 3,
    titulo: "Montagem de PC Gamer",
    descricao:
      "Montagem de setup completo com instalação de water cooler e cable management. Instalação de sistema operacional limpo e atualização de BIOS.",
    status: "fila",
    prioridade: "baixa",
    dataEntrada: "2026-06-07",
  },
  {
    id: 4,
    titulo: "Instalação de SSD e Otimização",
    descricao:
      "Substituição do HD mecânico por um SSD NVMe de 1TB. Clonagem do sistema operacional, verificação de integridade e otimização do boot.",
    status: "aguardando-peca",
    prioridade: "alta",
    dataEntrada: "2026-06-04",
  },
  {
    id: 5,
    titulo: "Diagnóstico e Reparo de Hardware",
    descricao:
      "Máquina liga mas não dá vídeo (bipa 3 vezes). Realizar teste nos módulos de memória RAM, fonte de alimentação e slots da placa-mãe.",
    status: "concluido",
    prioridade: "alta",
    dataEntrada: "2026-06-02",
  },
];

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
          <p class="card-status">${nomesDosStatus[ordem.status]}</p>
          <h3 class="card-title">${ordem.titulo}</h3>
        </div>
        <p class="card-description">${ordem.descricao}</p>
        <div class="card-footer">
          <div class="card-info">
            <img class="card-icon" src="flag.svg" alt="Data de entrada" />
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
  cards.forEach((card) => {
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData('text/plain', e.target.id)
      console.log( e.target.id)
    });
  });
};

const colunas = document.querySelectorAll(".kanban-column")

colunas.forEach((coluna)=>{
    coluna.addEventListener("dragover", (e)=>{
        e.preventDefault()
    })
    coluna.addEventListener("drop", (e)=>{
        const idCard = e.dataTransfer.getData('text/plain')
        const novoStatus = event.target.closest('.cards').id
        const buscarId = ordensDeServico.find(ordem => ordem.id === Number(idCard))
        if (buscarId){
            buscarId.status = novoStatus
            renderizarCards(ordensDeServico)
        }
    })
})


renderizarCards(ordensDeServico);
