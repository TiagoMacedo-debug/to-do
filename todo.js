const input = document.getElementById("novaTarefa");
const pendentes = document.getElementById("pendentes");
const concluidas = document.getElementById("concluidas");
const tabPendentes = document.getElementById("tab-pendentes");
const tabConcluidas = document.getElementById("tab-concluidas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvar() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function renderizar() {
  pendentes.innerHTML = '<p id="msg-pendentes" class="empty-message">Nenhuma tarefa pendente</p>';
  concluidas.innerHTML = '<p id="msg-concluidas" class="empty-message">Nenhuma tarefa concluída</p>';

  tarefas.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "task-item" + (t.feita ? " completed" : "");

    const span = document.createElement("span");
    span.textContent = t.texto;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const btnConcluir = document.createElement("button");
    btnConcluir.innerHTML = t.feita ? '<i class="bi bi-arrow-counterclockwise"></i>' : '<i class="bi bi-check2-square"></i>';
    btnConcluir.onclick = () => {
      tarefas[i].feita = !tarefas[i].feita;
      salvar();
      renderizar();
    };

    const btnExcluir = document.createElement("button");
    btnExcluir.innerHTML = '<i class="bi bi-trash-fill"></i>';
    btnExcluir.onclick = () => {
      tarefas.splice(i, 1);
      salvar();
      renderizar();
    };

    actions.appendChild(btnConcluir);
    actions.appendChild(btnExcluir);
    div.appendChild(span);
    div.appendChild(actions);

    (t.feita ? concluidas : pendentes).appendChild(div);
  });

  // Mostrar ou ocultar mensagens de lista vazia
  document.getElementById("msg-pendentes").style.display = pendentes.children.length === 1 ? "block" : "none";
  document.getElementById("msg-concluidas").style.display = concluidas.children.length === 1 ? "block" : "none";
}

function adicionarTarefa() {
  const texto = input.value.trim();
  if (texto !== "") {
    const estaNaAbaConcluida = tabConcluidas.classList.contains("active");
    tarefas.push({ texto, feita: estaNaAbaConcluida });
    input.value = "";
    salvar();
    renderizar();
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") adicionarTarefa();
});

tabPendentes.addEventListener("click", () => {
  tabPendentes.classList.add("active");
  tabConcluidas.classList.remove("active");
  pendentes.classList.add("active");
  concluidas.classList.remove("active");
});

tabConcluidas.addEventListener("click", () => {
  tabConcluidas.classList.add("active");
  tabPendentes.classList.remove("active");
  concluidas.classList.add("active");
  pendentes.classList.remove("active");
});

// Suporte a swipe (mobile)
let startX = 0;
document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
      if (diff > 0) {
      tabConcluidas.click();
      } else {
      tabPendentes.click();
      }
  }
});

function switchList(type) {
  const pending = document.getElementById('pending-tasks');
  const completed = document.getElementById('completed-tasks');

  pending.classList.remove('active');
  completed.classList.remove('active');

  setTimeout(() => {
    if (type === 'pending') {
      pending.classList.add('active');
    } else {
      completed.classList.add('active');
    }
  }, 50);
}

renderizar();