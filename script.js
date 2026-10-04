let notes = JSON.parse(localStorage.getItem('quicknotes_data')) || [];

const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');
const noteCount = document.querySelector('#note-count');
const notesList = document.querySelector('#notes-list');
const clearAllBtn = document.querySelector('#clear-all-btn');

function saveNotes() {
  localStorage.setItem('quicknotes_data', JSON.stringify(notes));
}

function updateCount(displayedCount) {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (displayedCount === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${displayedCount} notes.`;
  }
}

function render() {
  const query = searchInput.value.toLowerCase().trim();
  notesList.innerHTML = '';

  const filteredNotes = notes.filter(note => 
    note.text.toLowerCase().includes(query)
  );

  updateCount(filteredNotes.length);

  if (filteredNotes.length === 0 && notes.length > 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'no-notes';
    emptyLi.textContent = 'No notes match your search.';
    notesList.appendChild(emptyLi);
    return;
  }

  filteredNotes.forEach(note => {
    const li = document.createElement('li');
    li.className = `note-card category-${note.category.toLowerCase()}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';

    const textP = document.createElement('p');
    textP.textContent = note.text; // XSS Prevention

    const metaSpan = document.createElement('span');
    metaSpan.className = 'note-meta';
    metaSpan.textContent = `[${note.category}] - ${note.createdAt}`;

    contentDiv.appendChild(textP);
    contentDiv.appendChild(metaSpan);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteNote(note.id);

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
  });
}

function addNote(e) {
  e.preventDefault();
  const text = noteInput.value.trim();

  if (text === '') {
    errorMessage.textContent = 'Please type a note first.';
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = 'Notes must be 200 characters or fewer.';
    return;
  }

  errorMessage.textContent = '';

  const newNote = {
    id: Date.now(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };

  notes.unshift(newNote);
  saveNotes();
  render();
  noteInput.value = '';
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  render();
}

if (clearAllBtn) {
  clearAllBtn.addEventListener('click', () => {
    if (notes.length === 0) return;
    if (confirm("Delete all notes?")) {
      notes = [];
      saveNotes();
      render();
    }
  });
}

noteForm.addEventListener('submit', addNote);
searchInput.addEventListener('input', render);

// Initial render call
render();