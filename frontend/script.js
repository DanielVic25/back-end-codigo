const API = 'http://localhost:5000/api/notes';
const form = document.getElementById('note-form');
const notesList = document.getElementById('notes');

async function fetchNotes(){
  const res = await fetch(API);
  const notes = await res.json();
  render(notes);
}

function render(notes){
  notesList.innerHTML = '';
  notes.forEach(n => {
    const li = document.createElement('li');
    const left = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = n.title;
    const content = document.createElement('p');
    content.textContent = n.content || '';
    left.appendChild(title);
    left.appendChild(content);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.onclick = () => editNote(n);
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Excluir';
    delBtn.onclick = () => deleteNote(n._id);

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    notesList.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  if(!title) return alert('Título obrigatório');
  await fetch(API, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ title, content })
  });
  form.reset();
  fetchNotes();
});

async function deleteNote(id){
  if(!confirm('Excluir nota?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  fetchNotes();
}

async function editNote(n){
  const newTitle = prompt('Novo título', n.title);
  if(newTitle === null) return;
  const newContent = prompt('Novo conteúdo', n.content);
  await fetch(`${API}/${n._id}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ title: newTitle, content: newContent })
  });
  fetchNotes();
}

// inicializa
fetchNotes();
