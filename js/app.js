/* ==========================================================
   TechFlow Dashboard | app.js
   Checkpoint 5 de FrontEnd Design (FIAP)

   JavaScript puro responsável por:
   1. Alterar o tema (Light, Dark e System) e salvar no localStorage
   2. Abrir e fechar a Sidebar no celular
   3. Abrir e fechar o dropdown do usuário
   4. Abrir e fechar o modal de novo projeto
   5. Validar o formulário com estados de erro e sucesso
   6. Adicionar o projeto cadastrado na grade (sem banco de dados)
   ========================================================== */


/* ----------------------------------------------------------
   1. TEMA
   ---------------------------------------------------------- */

const CHAVE_TEMA = 'techflow-tema';
const botoesTema = document.querySelectorAll('[data-tema]');

// Media query que diz se o sistema operacional está no modo escuro
const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

function lerTemaSalvo() {
  try {
    return localStorage.getItem(CHAVE_TEMA) || 'system';
  } catch (erro) {
    return 'system'; // se o navegador bloquear o localStorage, usamos o padrão
  }
}

function salvarTema(tema) {
  try {
    localStorage.setItem(CHAVE_TEMA, tema);
  } catch (erro) {
    // sem localStorage o tema funciona, só não fica salvo
  }
}

function aplicarTema(tema) {
  // No modo System quem decide é a preferência do sistema operacional
  const usarEscuro = tema === 'dark' || (tema === 'system' && sistemaEscuro.matches);

  // O Tailwind usa a classe "dark" no <html> para ativar as variantes dark:
  document.documentElement.classList.toggle('dark', usarEscuro);

  // Marca qual botão está ativo (o visual vem das classes aria-pressed: no HTML)
  botoesTema.forEach(function (botao) {
    botao.setAttribute('aria-pressed', botao.dataset.tema === tema ? 'true' : 'false');
  });
}

botoesTema.forEach(function (botao) {
  botao.addEventListener('click', function () {
    const tema = botao.dataset.tema;
    salvarTema(tema);
    aplicarTema(tema);
  });
});

// Se o usuário estiver no modo System e mudar o tema do computador, a página acompanha
sistemaEscuro.addEventListener('change', function () {
  if (lerTemaSalvo() === 'system') {
    aplicarTema('system');
  }
});

aplicarTema(lerTemaSalvo());


/* ----------------------------------------------------------
   2. SIDEBAR (menu mobile)
   ---------------------------------------------------------- */

const sidebar = document.getElementById('sidebar');
const overlaySidebar = document.getElementById('overlay-sidebar');
const botaoAbrirSidebar = document.getElementById('abrir-sidebar');
const botaoFecharSidebar = document.getElementById('fechar-sidebar');

function sidebarEstaAberta() {
  return !sidebar.classList.contains('-translate-x-full');
}

function abrirSidebar() {
  sidebar.classList.remove('-translate-x-full');
  overlaySidebar.classList.remove('invisible', 'opacity-0');
  botaoAbrirSidebar.setAttribute('aria-expanded', 'true');
  document.body.classList.add('overflow-hidden'); // impede rolar a página por trás
}

function fecharSidebar() {
  sidebar.classList.add('-translate-x-full');
  overlaySidebar.classList.add('invisible', 'opacity-0');
  botaoAbrirSidebar.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('overflow-hidden');
}

botaoAbrirSidebar.addEventListener('click', abrirSidebar);
botaoFecharSidebar.addEventListener('click', fecharSidebar);
overlaySidebar.addEventListener('click', fecharSidebar);

// Ao clicar em um link do menu no celular, a sidebar fecha
document.querySelectorAll('[data-link-sidebar]').forEach(function (link) {
  link.addEventListener('click', function () {
    if (window.innerWidth < 1024) fecharSidebar();
  });
});

// Se a tela crescer até o tamanho desktop (lg), a sidebar volta ao estado normal
window.addEventListener('resize', function () {
  if (window.innerWidth >= 1024 && sidebarEstaAberta()) {
    fecharSidebar();
  }
});


/* ----------------------------------------------------------
   3. DROPDOWN DO USUÁRIO
   ---------------------------------------------------------- */

const botaoUsuario = document.getElementById('botao-usuario');
const menuUsuario = document.getElementById('menu-usuario');

function dropdownEstaAberto() {
  return botaoUsuario.getAttribute('aria-expanded') === 'true';
}

function abrirDropdown() {
  menuUsuario.classList.remove('invisible', 'opacity-0', 'scale-95');
  botaoUsuario.setAttribute('aria-expanded', 'true');
}

function fecharDropdown() {
  menuUsuario.classList.add('invisible', 'opacity-0', 'scale-95');
  botaoUsuario.setAttribute('aria-expanded', 'false');
}

botaoUsuario.addEventListener('click', function (evento) {
  evento.stopPropagation(); // evita que o clique chegue no document e feche na hora
  if (dropdownEstaAberto()) {
    fecharDropdown();
  } else {
    abrirDropdown();
  }
});

// Clicar fora do menu fecha o dropdown
document.addEventListener('click', function (evento) {
  if (dropdownEstaAberto() && !menuUsuario.contains(evento.target)) {
    fecharDropdown();
  }
});


/* ----------------------------------------------------------
   4. MODAL DE NOVO PROJETO
   ---------------------------------------------------------- */

const modal = document.getElementById('modal');
const overlayModal = document.getElementById('modal-overlay');
const painelModal = document.getElementById('modal-painel');
const botaoNovoProjeto = document.getElementById('botao-novo-projeto');

function modalEstaAberto() {
  return !modal.classList.contains('invisible');
}

function abrirModal() {
  modal.classList.remove('invisible');
  // Espera o navegador desenhar o modal para a transição de entrada funcionar
  requestAnimationFrame(function () {
    overlayModal.classList.remove('opacity-0');
    painelModal.classList.remove('opacity-0', 'translate-y-8');
  });
  document.body.classList.add('overflow-hidden');
  setTimeout(function () {
    document.getElementById('nome').focus();
  }, 200);
}

function fecharModal() {
  overlayModal.classList.add('opacity-0');
  painelModal.classList.add('opacity-0', 'translate-y-8');
  document.body.classList.remove('overflow-hidden');
  // Esconde de vez só depois que a animação de saída (300ms) termina
  setTimeout(function () {
    modal.classList.add('invisible');
    limparFormulario();
  }, 300);
  botaoNovoProjeto.focus({ preventScroll: true });
}

botaoNovoProjeto.addEventListener('click', abrirModal);
overlayModal.addEventListener('click', fecharModal);
document.querySelectorAll('[data-fechar-modal]').forEach(function (botao) {
  botao.addEventListener('click', fecharModal);
});

// Tecla Esc fecha o que estiver aberto
document.addEventListener('keydown', function (evento) {
  if (evento.key !== 'Escape') return;

  if (modalEstaAberto()) {
    fecharModal();
  } else if (dropdownEstaAberto()) {
    fecharDropdown();
    botaoUsuario.focus();
  } else if (sidebarEstaAberta() && window.innerWidth < 1024) {
    fecharSidebar();
  }
});


/* ----------------------------------------------------------
   5. VALIDAÇÃO DO FORMULÁRIO
   ---------------------------------------------------------- */

const form = document.getElementById('form-projeto');
const campoPrazo = document.getElementById('prazo');
const campoDescricao = document.getElementById('descricao');
const contadorDescricao = document.getElementById('contador-descricao');
const alertaErro = document.getElementById('alerta-erro');
const alertaSucesso = document.getElementById('alerta-sucesso');
const botaoSalvar = document.getElementById('botao-salvar');
const textoSalvar = document.getElementById('texto-salvar');
const iconeCarregando = document.getElementById('icone-carregando');

// Data de hoje no formato aaaa-mm-dd (o mesmo usado pelo input type="date")
function hojeISO() {
  const hoje = new Date();
  hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
  return hoje.toISOString().slice(0, 10);
}

// O calendário não deixa escolher datas passadas
campoPrazo.min = hojeISO();

// Cada regra recebe o valor do campo e devolve a mensagem de erro (ou '' se estiver certo)
const regras = {
  nome: function (valor) {
    if (valor.trim() === '') return 'Informe o nome do projeto.';
    if (valor.trim().length < 3) return 'O nome precisa ter pelo menos 3 caracteres.';
    return '';
  },
  responsavel: function (valor) {
    if (valor.trim() === '') return 'Informe quem é o responsável.';
    if (valor.trim().length < 3) return 'Digite o nome completo do responsável.';
    return '';
  },
  categoria: function (valor) {
    if (valor === '') return 'Selecione uma categoria.';
    return '';
  },
  prazo: function (valor) {
    if (valor === '') return 'Informe o prazo de entrega.';
    if (valor < hojeISO()) return 'O prazo não pode ser uma data que já passou.';
    return '';
  },
  prioridade: function (valor) {
    if (valor === '') return 'Escolha a prioridade do projeto.';
    return '';
  },
  descricao: function (valor) {
    if (valor.trim().length < 10) return 'Descreva o projeto com pelo menos 10 caracteres.';
    return '';
  }
};

const mensagensDeSucesso = {
  nome: 'Nome válido.',
  responsavel: 'Responsável definido.',
  categoria: 'Categoria selecionada.',
  prazo: 'Prazo dentro do esperado.',
  prioridade: 'Prioridade definida.',
  descricao: 'Descrição completa.'
};

function pegarValor(nomeCampo) {
  if (nomeCampo === 'prioridade') {
    const marcado = form.querySelector('input[name="prioridade"]:checked');
    return marcado ? marcado.value : '';
  }
  return form.elements[nomeCampo].value;
}

// Mostra o estado visual (erro ou ok) usando o atributo data-estado.
// As cores ficam no HTML com as variantes data-[estado=erro]: e data-[estado=ok]: do Tailwind.
function mostrarEstado(nomeCampo, mensagemErro) {
  const bloco = form.querySelector('[data-campo="' + nomeCampo + '"]');
  const entrada = bloco.querySelector('[data-entrada]');
  const mensagem = bloco.querySelector('[data-mensagem]');
  const estado = mensagemErro ? 'erro' : 'ok';

  bloco.dataset.estado = estado;
  mensagem.dataset.estado = estado;
  mensagem.textContent = mensagemErro || mensagensDeSucesso[nomeCampo];

  if (entrada) {
    entrada.dataset.estado = estado;
    entrada.setAttribute('aria-invalid', mensagemErro ? 'true' : 'false');
  }
}

function validarCampo(nomeCampo) {
  const mensagemErro = regras[nomeCampo](pegarValor(nomeCampo));
  mostrarEstado(nomeCampo, mensagemErro);

  // Se não sobrou nenhum campo com erro, o alerta vermelho do topo some
  if (!form.querySelector('[data-campo][data-estado="erro"]')) {
    esconderAlerta(alertaErro);
  }
  return mensagemErro === '';
}

// Valida quando o usuário sai do campo e, depois disso, enquanto ele corrige
Object.keys(regras).forEach(function (nomeCampo) {
  if (nomeCampo === 'prioridade') return; // os radios são tratados logo abaixo

  const entrada = form.elements[nomeCampo];

  entrada.addEventListener('blur', function () {
    validarCampo(nomeCampo);
  });

  entrada.addEventListener('input', function () {
    // só revalida em tempo real se o campo já foi verificado antes
    if (entrada.dataset.estado) validarCampo(nomeCampo);
  });

  entrada.addEventListener('change', function () {
    validarCampo(nomeCampo);
  });
});

form.querySelectorAll('input[name="prioridade"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    validarCampo('prioridade');
  });
});

// Contador de caracteres da descrição
campoDescricao.addEventListener('input', function () {
  contadorDescricao.textContent = campoDescricao.value.length + '/300';
});

function mostrarAlerta(alerta) {
  alerta.classList.remove('hidden');
  alerta.classList.add('flex');
}

function esconderAlerta(alerta) {
  alerta.classList.add('hidden');
  alerta.classList.remove('flex');
}

function definirCarregando(carregando) {
  botaoSalvar.disabled = carregando; // estado disabled: do Tailwind
  iconeCarregando.classList.toggle('hidden', !carregando);
  textoSalvar.textContent = carregando ? 'Salvando...' : 'Salvar projeto';
}

function limparFormulario() {
  form.reset();
  form.querySelectorAll('[data-estado]').forEach(function (elemento) {
    delete elemento.dataset.estado;
    elemento.removeAttribute('aria-invalid');
  });
  form.querySelectorAll('[data-mensagem]').forEach(function (mensagem) {
    mensagem.textContent = '';
  });
  contadorDescricao.textContent = '0/300';
  esconderAlerta(alertaErro);
  esconderAlerta(alertaSucesso);
  definirCarregando(false);
}

form.addEventListener('submit', function (evento) {
  evento.preventDefault(); // não recarrega a página

  // Valida todos os campos (sem parar no primeiro erro, para mostrar todos de uma vez)
  let formularioValido = true;
  Object.keys(regras).forEach(function (nomeCampo) {
    if (!validarCampo(nomeCampo)) formularioValido = false;
  });

  if (!formularioValido) {
    esconderAlerta(alertaSucesso);
    mostrarAlerta(alertaErro);
    const primeiroErro = form.querySelector('[data-estado="erro"] input, [data-estado="erro"] select, [data-estado="erro"] textarea');
    if (primeiroErro) primeiroErro.focus();
    return;
  }

  esconderAlerta(alertaErro);
  definirCarregando(true);

  const projeto = {
    nome: pegarValor('nome').trim(),
    responsavel: pegarValor('responsavel').trim(),
    categoria: pegarValor('categoria'),
    prazo: pegarValor('prazo'),
    prioridade: pegarValor('prioridade'),
    descricao: pegarValor('descricao').trim()
  };

  // Simula o tempo de resposta de um servidor
  setTimeout(function () {
    mostrarAlerta(alertaSucesso);
    adicionarProjeto(projeto);

    setTimeout(function () {
      fecharModal();
      mostrarToast('Projeto "' + projeto.nome + '" adicionado!');
    }, 900);
  }, 800);
});


/* ----------------------------------------------------------
   6. ADICIONAR O PROJETO NA GRADE
   ---------------------------------------------------------- */

const gradeProjetos = document.getElementById('grade-projetos');
const contadorAtivos = document.getElementById('contador-ativos');

const coresCategoria = {
  Web: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  Mobile: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  Backend: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
  Infraestrutura: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  Design: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
  Dados: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300'
};

const coresPrioridade = {
  Baixa: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'Média': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Alta: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'
};

// Evita que o texto digitado seja interpretado como HTML
function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// aaaa-mm-dd vira dd/mm/aaaa
function formatarData(dataISO) {
  return dataISO.split('-').reverse().join('/');
}

function adicionarProjeto(projeto) {
  const card = document.createElement('article');
  card.className = 'group flex flex-col justify-between rounded-2xl border border-violet-400 bg-white p-5 shadow-sm ring-4 ring-violet-500/20 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 dark:border-violet-500/60 dark:bg-slate-900 dark:hover:border-violet-500/50';

  card.innerHTML =
    '<div>' +
      '<div class="flex flex-wrap items-center gap-2">' +
        '<span class="rounded-full px-2.5 py-0.5 text-xs font-semibold ' + coresCategoria[projeto.categoria] + '">' + escaparHTML(projeto.categoria) + '</span>' +
        '<span class="rounded-full px-2.5 py-0.5 text-xs font-semibold ' + coresPrioridade[projeto.prioridade] + '">' + escaparHTML(projeto.prioridade) + '</span>' +
        '<span class="rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-semibold text-white">Novo</span>' +
      '</div>' +
      '<h3 class="mt-3 font-bold text-slate-900 transition-colors duration-200 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">' + escaparHTML(projeto.nome) + '</h3>' +
      '<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">' + escaparHTML(projeto.descricao) + '</p>' +
    '</div>' +
    '<div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">' +
      '<span>' + escaparHTML(projeto.responsavel) + '</span>' +
      '<span>' + formatarData(projeto.prazo) + '</span>' +
    '</div>';

  gradeProjetos.appendChild(card);

  // Atualiza o indicador de projetos ativos
  contadorAtivos.textContent = Number(contadorAtivos.textContent) + 1;

  // Depois de alguns segundos, o destaque do card novo some
  setTimeout(function () {
    card.classList.remove('border-violet-400', 'ring-4', 'ring-violet-500/20', 'dark:border-violet-500/60');
    card.classList.add('border-slate-200', 'dark:border-slate-800');
  }, 4000);

  setTimeout(function () {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1300);
}


/* ----------------------------------------------------------
   TOAST (aviso rápido no canto da tela)
   ---------------------------------------------------------- */

const toast = document.getElementById('toast');
const toastTexto = document.getElementById('toast-texto');
let temporizadorToast;

function mostrarToast(texto) {
  toastTexto.textContent = texto;
  toast.classList.remove('opacity-0', 'translate-y-6');
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(function () {
    toast.classList.add('opacity-0', 'translate-y-6');
  }, 3500);
}


/* ----------------------------------------------------------
   Ano atual no rodapé
   ---------------------------------------------------------- */

document.getElementById('ano-atual').textContent = new Date().getFullYear();
