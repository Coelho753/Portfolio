const toggleBtn = document.getElementById("theme-toggle");
const html = document.documentElement;
const canvas = document.getElementById("canvas-raio");
const ctx = canvas.getContext("2d");

// Tema claro/escuro
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  html.setAttribute("data-theme", savedTheme);
  toggleBtn.textContent = savedTheme === "dark" ? "🌞 Modo Claro" : "🌙 Modo Escuro";
}

toggleBtn.addEventListener("click", () => {
  const isDark = html.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  toggleBtn.textContent = newTheme === "dark" ? "🌞 Modo Claro" : "🌙 Modo Escuro";
});

// Ajusta canvas ao tamanho da janela
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ⚡ Desenha o raio
function desenharRaio(x, y) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.shadowColor = "white";
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.moveTo(x, 0);

  let atualX = x;
  let atualY = 0;

  while (atualY < y) {
    const desvioX = (Math.random() - 0.5) * 40;
    const proximoX = atualX + desvioX;
    const proximoY = atualY + Math.random() * 20 + 10;

    ctx.lineTo(proximoX, proximoY);

    // Ramificações
    if (Math.random() < 0.2) {
      ctx.moveTo(proximoX, proximoY);
      ctx.lineTo(proximoX + desvioX * 0.5, proximoY + 30);
      ctx.moveTo(proximoX, proximoY);
    }

    atualX = proximoX;
    atualY = proximoY;
  }

  ctx.lineTo(atualX, y);
  ctx.stroke();

  setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 100);
}

// 💥 Partículas explosivas
function criarExplosao(x, y) {
  for (let i = 0; i < 25; i++) {
    const p = document.createElement("div");
    p.className = "particula";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 100;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    p.style.setProperty("--dx", `${dx}px`);
    p.style.setProperty("--dy", `${dy}px`);

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

// ⚡ Escolhe um card e atinge com raio
function raioEmCard() {
  const cards = document.querySelectorAll(".card");
  if (!cards.length) return;

  const index = Math.floor(Math.random() * cards.length);
  const card = cards[index];
  const rect = card.getBoundingClientRect();

  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  desenharRaio(x, y);
  criarExplosao(x, y);

  card.classList.add("atingido");
  setTimeout(() => card.classList.remove("atingido"), 850); // Corrigido tempo da animação
}

// ⏲️ Repetir
setInterval(raioEmCard, 3500);




// Revelar e ativar clique dos cards
// Revelar cards apenas ao rolar a página
function revelarCardsScroll() {
  const cards = document.querySelectorAll(".card");
  const alturaTela = window.innerHeight;

  cards.forEach(card => {
    const distanciaTop = card.getBoundingClientRect().top;
    if (distanciaTop < alturaTela - 50) {
      card.classList.add("revelado");
    }
  });
}

window.addEventListener("scroll", revelarCardsScroll);
window.addEventListener("DOMContentLoaded", revelarCardsScroll);

// Permitir abrir e fechar detalhes do card ao clicar
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", (event) => {
    // Evita que cliques em botões, inputs ou dentro da div "conteudo" fechem o card
    const ignorar = ["BUTTON", "INPUT", "TEXTAREA", "SELECT"];
    if (
      ignorar.includes(event.target.tagName) ||
      event.target.closest("#conteudo")
    ) {
      return; // Não faz nada
    }

    card.classList.toggle("mostrar");

    if (card.classList.contains("mostrar")) {
      card.classList.add("eletrizando");
      setTimeout(() => card.classList.remove("eletrizando"), 1400);
    }
  });
});






window.addEventListener("DOMContentLoaded", () => {
  const canvasMar = document.getElementById("marCanvas");
  const ctxMar = canvasMar.getContext("2d");

  function redimensionarMar() {
    canvasMar.width = window.innerWidth;
    canvasMar.height = window.innerHeight;
  }
  redimensionarMar();
  window.addEventListener("resize", redimensionarMar);

  let tempoMar = 0;

  function desenharMar() {
    ctxMar.clearRect(0, 0, canvasMar.width, canvasMar.height);

    const largura = canvasMar.width;
    const altura = canvasMar.height;
    const numOndas = 3;
    const cores = ["#004466", "#005580", "#006699"]; // cores ajustadas

    for (let j = 0; j < numOndas; j++) {
      ctxMar.beginPath();
      ctxMar.moveTo(0, altura);

      for (let x = 0; x <= largura; x++) {
        const y = Math.sin((x + tempoMar * (1 + j * 0.5)) * 0.008 + j) * (10 + j * 8) + altura * 0.6 + j * 15;
        ctxMar.lineTo(x, y);
      }

      ctxMar.lineTo(largura, altura);
      ctxMar.closePath();
      ctxMar.fillStyle = cores[j];
      ctxMar.fill();
    }

    tempoMar += 0.5;
    requestAnimationFrame(desenharMar);
  }



  const marCanvas = document.getElementById('marCanvas');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / docHeight, 1); // 0 (topo) → 1 (fundo)

    // Inverter o movimento: 100% (invisível) → 0% (tela cheia)
    const translateY = 100 - progress * 100;
    marCanvas.style.transform = `translateY(${translateY}%)`;
  });


  desenharMar();
});





const foto = document.querySelector('.foto-perfil');
const texto = document.querySelector('.texto-apresentacao');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Limite de rolagem onde a transição ocorre (ex: 150px)
  const limite = 150;
  const progress = Math.min(scrollY / limite, 1); // 0 → 1

  // Reduzir tamanho da foto

  const novoTamanho = 150 - progress * 80; // de 150px para 70px
  foto.style.width = `${novoTamanho}px`;
  foto.style.height = `${novoTamanho}px`;


  // Reduzir opacidade do texto
  texto.style.opacity = 1 - progress;
  texto.style.transform = `translateX(${progress * 40}px)`; // move um pouco
});


let funcionarios = JSON.parse(localStorage.getItem("funcionarios")) || [];
let idGlobal = parseInt(localStorage.getItem("ultimoId")) || 5279235;

function mostrarCadastro() {
  document.getElementById("conteudo").innerHTML = `
    <h2>Cadastrar Funcionário</h2>
    <input id="nome" placeholder="Nome"><br>
    <input id="setor" placeholder="Setor"><br>
    <input id="salario" placeholder="Salário"><br>
    <button onclick="cadastrarFuncionario()">Salvar</button>
  `;
}

function cadastrarFuncionario() {
  const nome = document.getElementById("nome").value;
  const setor = document.getElementById("setor").value;
  const salario = document.getElementById("salario").value;

  if (!nome || !setor || !salario) return alert("Preencha todos os campos!");

  const funcionario = {
    id: idGlobal++,
    nome,
    setor,
    salario
  };

  funcionarios.push(funcionario);
  localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
  localStorage.setItem("ultimoId", idGlobal);

  alert(`Funcionário ${nome} cadastrado com sucesso!`);
  mostrarCadastro();
}

function mostrarConsulta() {
  document.getElementById("conteudo").innerHTML = `
    <h2>Consultar Funcionário</h2>
    <button onclick="consultarTodos()">Todos</button>
    <button onclick="consultaId()">Por ID</button>
    <button onclick="consultaSetor()">Por Setor</button>
    <div id="resultado"></div>
  `;
}

function consultarTodos() {
  const res = funcionarios.map(f => `
    <p>ID: ${f.id}<br>Nome: ${f.nome}<br>Setor: ${f.setor}<br>Salário: R$${f.salario}</p><hr>
  `).join('');
  document.getElementById("resultado").innerHTML = res || 'Nenhum funcionário cadastrado.';
}

function consultaId() {
  const id = parseInt(prompt("Digite o ID do funcionário:"));
  if (isNaN(id)) return alert("ID inválido.");

  const func = funcionarios.find(f => f.id === id);
  document.getElementById("resultado").innerHTML = func
    ? `<p>ID: ${func.id}<br>Nome: ${func.nome}<br>Setor: ${func.setor}<br>Salário: R$${func.salario}</p>`
    : "Funcionário não encontrado.";
}

function consultaSetor() {
  const setor = prompt("Digite o setor:");
  const encontrados = funcionarios.filter(f => f.setor.toLowerCase() === setor.toLowerCase());
  const res = encontrados.map(f => `
    <p>ID: ${f.id}<br>Nome: ${f.nome}<br>Setor: ${f.setor}<br>Salário: R$${f.salario}</p><hr>
  `).join('');
  document.getElementById("resultado").innerHTML = res || 'Nenhum funcionário encontrado para esse setor.';
}

function mostrarRemocao() {
  document.getElementById("conteudo").innerHTML = `
    <h2>Remover Funcionário</h2>
    <input id="idRemover" placeholder="ID do Funcionário"><br>
    <button onclick="removerFuncionario()">Remover</button>
  `;
}

function removerFuncionario() {
  const id = parseInt(document.getElementById("idRemover").value);
  const index = funcionarios.findIndex(f => f.id === id);
  if (index !== -1) {
    funcionarios.splice(index, 1);
    localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
    alert("Funcionário removido com sucesso.");
  } else {
    alert("ID não encontrado.");
  }
  mostrarRemocao();
}

// Impedir que o clique nos botões feche o card
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card .detalhes").forEach(detalhe => {
    detalhe.addEventListener("click", e => e.stopPropagation());
  });
});

// Mostrar e animar cards ao clicar (mantido)
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", (event) => {
    const ignorar = ["BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL"];
    if (
      ignorar.includes(event.target.tagName) ||
      event.target.closest("#conteudo") ||
      event.target.closest(".detalhes")
    ) {
      event.stopPropagation();
      return;
    }

    card.classList.toggle("mostrar");
    if (card.classList.contains("mostrar")) {
      card.classList.add("eletrizando");
      setTimeout(() => card.classList.remove("eletrizando"), 1400);
    }
  });
});



window.addEventListener("DOMContentLoaded", () => {
  // Digitação letra por letra com <span>
  const destino = document.getElementById("typing-text");
  const texto = "PlayStation";

  if (destino) {
    destino.innerHTML = ""; // limpa

    texto.split("").forEach((letra, i) => {
      const span = document.createElement("span");
      span.textContent = letra;
      span.style.animationDelay = `${i * 0.2}s`;
      destino.appendChild(span);
    });
  }

  // Partículas PlayStation
  const canvasPS = document.getElementById("ps-particulas");
  if (canvasPS) {
    const ctxPS = canvasPS.getContext("2d");
    let w, h;
    let particulas = [];

    function criarParticula() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: Math.random() * 0.5 + 0.2
      };
    }

    function initCanvas() {
      w = canvasPS.width = window.innerWidth;
      h = canvasPS.height = document.querySelector(".playstation-showcase").offsetHeight;
      particulas = Array.from({ length: 60 }, () => criarParticula());
    }

    function desenhar() {
      ctxPS.clearRect(0, 0, w, h);
      ctxPS.fillStyle = '#00f7ff';
      particulas.forEach(p => {
        ctxPS.beginPath();
        ctxPS.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctxPS.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.y > h || p.x < 0 || p.x > w) Object.assign(p, criarParticula(), { y: 0 });
      });
      requestAnimationFrame(desenhar);
    }

    window.addEventListener("resize", initCanvas);
    initCanvas();
    desenhar();
  }
});
