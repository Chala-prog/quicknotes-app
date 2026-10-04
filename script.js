// DOM Selection using querySelector
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllBtn = document.querySelector("#clear-all-btn");

// State Initialization from localStorage
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Save to LocalStorage helper
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Update Note Count Message
function updateCount(count) {
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// Main Render Function
function render() {
  notesList.innerHTML = "";
  const query = searchInput.value.trim().toLowerCase();
  
  const filteredNotes = notes.filter(note => 
    note.text.toLowerCase().includes(query)
  );

  updateCount(notes.length);

  // Toggle Clear All button visibility
  if (notes.length > 0) {
    clearAllBtn.style.display = "inline-block";
  } else {
    clearAllBtn.style.display = "none";
  }

  if (filteredNotes.length === 0 && notes.length > 0) {
    const emptyMsg = document.createElement("li");
    emptyMsg.textContent = "No notes match your search.";
    emptyMsg.style.textAlign = "center";
    emptyMsg.style.color = "#777";
    notesList.appendChild(emptyMsg);
    return;
  }

  filteredNotes.forEach(note => {
    const li = document.createElement("li");
    li.className = `note-card category-${note.category.toLowerCase()}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "note-content";

    const textP = document.createElement("p");
    textP.textContent = note.text; // Safe text handling preventing XSS

    const metaDiv = document.createElement("div");
    metaDiv.className = "note-meta";

    const badge = document.createElement("span");
    badge.className = "category-badge";
    badge.textContent = note.category;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = note.createdAt;

    metaDiv.appendChild(badge);
    metaDiv.appendChild(dateSpan);

    contentDiv.appendChild(textP);
    contentDiv.appendChild(metaDiv);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
  });
}

// Add Note Event Handler
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = noteInput.value.trim();

  // Validation
  if (!text) {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";

  const newNote = {
    id: Date.now(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };

  notes.push(newNote);
  saveNotes();
  noteInput.value = "";
  render();
});

// Delete Note Helper
function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  render();
}

// Realtime Search Event Handler
searchInput.addEventListener("input", render);

// Optional Bonus: Clear All Notes
clearAllBtn.addEventListener("click", () => {
  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    render();
  }
});

// Initial Render on Load
render();
