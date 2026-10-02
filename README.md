# QuickNotes App

QuickNotes is a lightweight, responsive single-page web application that allows users to create, search, categorize, and manage short notes directly inside their browser without requiring a backend server or external dependencies.

## Features
- **Categorized Notes**: Assign categories (Personal, Work, Study) with distinct visual color borders.
- **Input Validation**: Enforces non-empty entries and a strict 200-character limit with dynamic error messages.
- **Realtime Search**: Instantly filters the notes list as you type in the search bar.
- **Data Persistence**: Automatically stores and restores notes across page reloads using browser `localStorage`.
- **Responsive Design**: Stacks controls cleanly on narrow screens using CSS Flexbox and media queries.

## How to Run Locally
1. Clone the repository:
   ```bash
   git clone [https://github.com/Chala-prog/quicknotes-app.git](https://github.com/Chala-prog/quicknotes-app.git)

   
### What I Learned 
	The Render Pattern: Decoupling application data (notes array state) from DOM rendering ensures predictable, bug-free UI updates whenever data changes.
	XSS Prevention: Safely inserting user-generated text using textContent instead of innerHTML eliminates Cross-Site Scripting vulnerabilities.
	State Synchronization & Persistence: Serializing JavaScript objects with JSON.stringify and JSON.parse enables client-side data storage across sessions using localStorage.
