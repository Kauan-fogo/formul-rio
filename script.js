const vagasIniciais = [
  {
    id: '1',
    titulo: 'Estágio em Desenvolvimento Web Front-End',
    empresa: 'TechVision Solutions',
    area: 'Tecnologia',
    modalidade: 'Remoto',
    bolsa: '1800',
    cidade: 'São Paulo - SP',
    requisitos: 'Conhecimentos em HTML5, CSS3, JavaScript. Vontade de aprender React/Vue.',
    contato: 'carreiras@techvision.com.br',
    dataCriacao: new Date().toLocaleDateString('pt-BR')
  },
  {
    id: '2',
    titulo: 'Estágio em Marketing Digital e Mídias',
    empresa: 'Agência LeadPro',
    area: 'Marketing',
    modalidade: 'Híbrido',
    bolsa: '1400',
    cidade: 'Rio de Janeiro - RJ',
    requisitos: 'Criação de conteúdos para redes sociais, noções de Canva/Photoshop e Google Analytics.',
    contato: 'https://leadpro.com/vagas',
    dataCriacao: new Date().toLocaleDateString('pt-BR')
  },
  {
    id: '3',
    titulo: 'Estágio em UI/UX Design',
    empresa: 'Creative Studio',
    area: 'Design',
    modalidade: 'Remoto',
    bolsa: '1600',
    cidade: 'Curitiba - PR',
    requisitos: 'Prototipação em Figma, boas práticas de acessibilidade e design responsivo.',
    contato: 'design@creativestudio.io',
    dataCriacao: new Date().toLocaleDateString('pt-BR')
  }
];

// GERENCIAMENTO DE ESTADO
let vagas = [];

// ELEMENTOS DOM
const formVaga = document.getElementById('formVaga');
const tabelaVagasBody = document.getElementById('tabelaVagasBody');
const emptyState = document.getElementById('emptyState');
const searchBox = document.getElementById('searchBox');
const filterArea = document.getElementById('filterArea');
const filterModalidade = document.getElementById('filterModalidade');

const statTotalVagas = document.getElementById('statTotalVagas');
const statEmpresas = document.getElementById('statEmpresas');

// ELEMENTOS DO MODAL
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitulo = document.getElementById('modalTitulo');
const modalEmpresa = document.getElementById('modalEmpresa');
const modalArea = document.getElementById('modalArea');
const modalModalidade = document.getElementById('modalModalidade');
const modalBolsa = document.getElementById('modalBolsa');
const modalCidade = document.getElementById('modalCidade');
const modalData = document.getElementById('modalData');
const modalRequisitos = document.getElementById('modalRequisitos');
const modalBtnCandidatar = document.getElementById('modalBtnCandidatar');

// INICIALIZAÇÃO DA APLICAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  carregarVagas();
  configurarEventos();
});

// CARREGAR E SALVAR DADOS (LOCALSTORAGE)
function carregarVagas() {
  const vagasSalvas = localStorage.getItem('estagiohub_vagas');
  if (vagasSalvas) {
    vagas = JSON.parse(vagasSalvas);
  } else {
    vagas = [...vagasIniciais];
    salvarVagas();
  }
  renderizarVagas();
  atualizarEstatisticas();
}

function salvarVagas() {
  localStorage.setItem('estagiohub_vagas', JSON.stringify(vagas));
}

// RENDERIZAR TABELA DE VAGAS
function renderizarVagas() {
  const termoBusca = searchBox.value.toLowerCase();
  const areaSelecionada = filterArea.value;
  const modalidadeSelecionada = filterModalidade.value;

  // Filtragem
  const vagasFiltradas = vagas.filter(vaga => {
    const atendeBusca = vaga.titulo.toLowerCase().includes(termoBusca) ||
                        vaga.empresa.toLowerCase().includes(termoBusca) ||
                        vaga.requisitos.toLowerCase().includes(termoBusca);

    const atendeArea = areaSelecionada === 'todos' || vaga.area === areaSelecionada;
    const atendeModalidade = modalidadeSelecionada === 'todos' || vaga.modalidade === modalidadeSelecionada;

    return atendeBusca && atendeArea && atendeModalidade;
  });

  tabelaVagasBody.innerHTML = '';

  if (vagasFiltradas.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';

    vagasFiltradas.forEach(vaga => {
      const tr = document.createElement('tr');
      
      const bolsaFormatada = Number(vaga.bolsa).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const modalidadeClass = vaga.modalidade.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      tr.innerHTML = `
        <td><strong>${vaga.titulo}</strong></td>
        <td>${vaga.empresa}</td>
        <td><span class="tag-area">${vaga.area}</span></td>
        <td><span class="tag-modalidade ${modalidadeClass}">${vaga.modalidade}</span></td>
        <td><strong>${bolsaFormatada}</strong></td>
        <td>${vaga.cidade}</td>
        <td class="actions-cell">
          <button class="btn btn-sm btn-info" onclick="abrirModal('${vaga.id}')" title="Ver Detalhes">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deletarVaga('${vaga.id}')" title="Remover Vaga">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      tabelaVagasBody.appendChild(tr);
    });
  }
}

// CADASTRO DE NOVA VAGA
formVaga.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const empresa = document.getElementById('empresa').value.trim();
  const area = document.getElementById('area').value;
  const modalidade = document.getElementById('modalidade').value;
  const bolsa = document.getElementById('bolsa').value;
  const cidade = document.getElementById('cidade').value.trim();
  const requisitos = document.getElementById('requisitos').value.trim();
  const contato = document.getElementById('contato').value.trim();

  // Validação simples
  if (!titulo || !empresa || !area || !modalidade || !bolsa || !cidade || !requisitos || !contato) {
    mostrarToast('Por favor, preencha todos os campos obrigatórios!');
    return;
  }

  const novaVaga = {
    id: Date.now().toString(),
    titulo,
    empresa,
    area,
    modalidade,
    bolsa,
    cidade,
    requisitos,
    contato,
    dataCriacao: new Date().toLocaleDateString('pt-BR')
  };

  vagas.unshift(novaVaga);
  salvarVagas();
  renderizarVagas();
  atualizarEstatisticas();

  formVaga.reset();
  mostrarToast('Vaga de estágio cadastrada com sucesso!');
  
  // Rolar suavemente para a tabela de vagas
  document.getElementById('vagas').scrollIntoView({ behavior: 'smooth' });
});

// DELETAR VAGA
function deletarVaga(id) {
  if (confirm('Tem certeza que deseja remover esta vaga de estágio?')) {
    vagas = vagas.filter(vaga => vaga.id !== id);
    salvarVagas();
    renderizarVagas();
    atualizarEstatisticas();
    mostrarToast('Vaga removida com sucesso!');
  }
}

// ABRIR E FECHAR MODAL
function abrirModal(id) {
  const vaga = vagas.find(v => v.id === id);
  if (!vaga) return;

  modalTitulo.textContent = vaga.titulo;
  modalEmpresa.innerHTML = `<i class="fa-solid fa-building"></i> ${vaga.empresa}`;
  modalArea.textContent = vaga.area;
  modalModalidade.textContent = vaga.modalidade;
  modalBolsa.textContent = Number(vaga.bolsa).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  modalCidade.textContent = vaga.cidade;
  modalData.textContent = vaga.dataCriacao;
  modalRequisitos.textContent = vaga.requisitos;

  // Tratar o botão de candidatura (E-mail ou URL)
  if (vaga.contato.startsWith('http://') || vaga.contato.startsWith('https://')) {
    modalBtnCandidatar.href = vaga.contato;
  } else {
    modalBtnCandidatar.href = `mailto:${vaga.contato}?subject=Candidatura para Vaga: ${encodeURIComponent(vaga.titulo)}`;
  }

  modalOverlay.classList.add('active');
}

function fecharModal() {
  modalOverlay.classList.remove('active');
}

// EVENTOS DE FILTROS E BUSCA
function configurarEventos() {
  searchBox.addEventListener('input', renderizarVagas);
  filterArea.addEventListener('change', renderizarVagas);
  filterModalidade.addEventListener('change', renderizarVagas);

  modalClose.addEventListener('click', fecharModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) fecharModal();
  });
}

// ATUALIZAR ESTATÍSTICAS
function atualizarEstatisticas() {
  statTotalVagas.textContent = vagas.length;
  
  // Total de empresas únicas
  const empresasUnicas = new Set(vagas.map(v => v.empresa.toLowerCase()));
  statEmpresas.textContent = empresasUnicas.size;
}

// MOSTRAR TOAST DE NOTIFICAÇÃO
function mostrarToast(mensagem) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  toastMsg.textContent = mensagem;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}