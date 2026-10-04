// Query Selectors
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// Main State: Array of note objects
let notes = [];

/**
 * Task 5 — Persistence: Load notes from localStorage
 */
function loadNotes() {
  const storedNotes = localStorage.getItem("quicknotes_data");
  if (storedNotes) {
    try {
      notes = JSON.parse(storedNotes);
    } catch (e) {
      notes = [];
    }
  }
}

/**
 * Task 5 — Persistence: Save notes array to localStorage
 */
function saveNotes() {
  localStorage.setItem("quicknotes_data", JSON.stringify(notes));
}

/**
 * Task 4 — Update Count Paragraph
 */
function updateCountMessage(count) {
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

/**
 * Task 3 & 5 — Render Function (Safely creates DOM elements using textContent)
 */
function render() {
  notesList.textContent = ""; // Clear list container safely
  const query = searchInput.value.trim().toLowerCase();

  // Task 5 — Filter notes by search keyword
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(query)
  );

  updateCountMessage(filteredNotes.length);

  // Task 5 — Show empty search result message if query yields no match
  if (filteredNotes.length === 0 && query !== "") {
    const emptyLi = document.createElement("li");
    emptyLi.textContent = "No notes match your search.";
    emptyLi.style.color = "#64748b";
    emptyLi.style.fontStyle = "italic";
    notesList.appendChild(emptyLi);
    return;
  }

  // Render Note Cards
  filteredNotes.forEach((note) => {
    const li = document.createElement("li");
    // Task 2 — Category CSS class binding (category-personal, category-work, category-study)
    const categoryClass = `category-${note.category.toLowerCase()}`;
    li.className = `note-card ${categoryClass}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "note-content";

    const textP = document.createElement("p");
    textP.className = "note-text";
    textP.textContent = note.text; // Prevents XSS

    const metaDiv = document.createElement("div");
    metaDiv.className = "note-meta";

    const badgeSpan = document.createElement("span");
    badgeSpan.className = "category-badge";
    badgeSpan.textContent = note.category;

    const timeSpan = document.createElement("span");
    timeSpan.textContent = note.createdAt;

    metaDiv.appendChild(badgeSpan);
    metaDiv.appendChild(timeSpan);

    contentDiv.appendChild(textP);
    contentDiv.appendChild(metaDiv);

    // Task 4 — Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
  });

  // Optional Bonus: Render "Clear All" button if notes exist
  if (notes.length > 0) {
    const clearAllBtn = document.createElement("button");
    clearAllBtn.textContent = "Clear All Notes";
    clearAllBtn.className = "clear-all-btn";
    clearAllBtn.addEventListener("click", clearAllNotes);
    notesList.appendChild(clearAllBtn);
  }
}

/**
 * Task 3 & 4 — Add Note with Validation
 */
function addNote(event) {
  event.preventDefault(); // Stop page refresh
  errorMessage.textContent = ""; // Reset error display

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Task 4 — Validation Checks
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Task 3 — Create Note Object
  const newNote = {
    id: Date.now().toString(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  notes.unshift(newNote); // Prepend to notes array
  saveNotes();
  render();

  noteInput.value = ""; // Clear input field
  noteInput.focus();
}

/**
 * Task 4 — Delete single note
 */
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

/**
 * Bonus (+5 points) — Clear All Notes with confirmation
 */
function clearAllNotes() {
  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    render();
  }
}

// Event Listeners
noteForm.addEventListener("submit", addNote);
searchInput.addEventListener("input", render);

// Page Initialization
loadNotes();
render();