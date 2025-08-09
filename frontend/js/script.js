const API_URL = "https://localhost:7021";
const form = document.getElementById("form");
const id = document.getElementById("id");
const nome = document.getElementById("nome");
const btnListar = document.getElementById("btnListar");
const lista = document.getElementById("lista");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({id: Number(id.value),nome: nome.value.trim(),}),
    });

    if (!res.ok) {
    const err = await res.text();
    alert(`Erro: ${err}`);
    return;
    }

    id.value = "";
    nome.value = "";
    listar();
});

btnListar.addEventListener("click", listar);

async function deletar(id) {
    const res = await fetch(`${API_URL}/users/${id}`,{method: 'DELETE'});
    listar();
}

async function listar() {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();

    lista.innerHTML = "";
    users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `#${user.id} - ${user.nome}`;
    lista.appendChild(li);
    const btnDelete = `<button onclick="deletar(${user.id})">X</button>`;
    li.innerHTML += btnDelete;
    });
}