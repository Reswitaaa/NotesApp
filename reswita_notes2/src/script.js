const apiBaseURL = 'https://notes-api.dicoding.dev/v2';

// Komponen loading indicator
// Komponen loading indicator
class LoadingIndicator extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="loading-indicator">
                <p>Loading...</p>
            </div>
        `;
        this.style.display = 'none'; // Secara default disembunyikan
    }

    show() {
        this.style.display = 'block';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('loading-indicator', LoadingIndicator);

// Menambahkan loading indicator ke DOM
const loadingIndicator = document.createElement('loading-indicator');
document.body.appendChild(loadingIndicator);

// Fungsi untuk menampilkan daftar catatan dari API
async function fetchNotes() {
    loadingIndicator.show(); // Tampilkan loading indicator
    try {
        const response = await fetch(`${apiBaseURL}/notes`);
        const result = await response.json();
        if (result.status === 'success') {
            return result.data;
        }
    } catch (error) {
        console.error('Gagal mengambil catatan:', error);
    } finally {
        loadingIndicator.hide(); // Sembunyikan loading indicator setelah request selesai
    }
    return [];
}

// Fungsi untuk menambahkan catatan baru ke API
async function addNoteToAPI(title, body) {
    try {
        const response = await fetch(`${apiBaseURL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body })
        });
        const result = await response.json();
        if (result.status === 'success') {
            return result.data;
        }
    } catch (error) {
        console.error('Gagal menambahkan catatan:', error);
    }
}

// Fungsi untuk menghapus catatan dari API
async function deleteNoteFromAPI(noteId) {
    try {
        const response = await fetch(`${apiBaseURL}/notes/${noteId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.status === 'success') {
            console.log('Catatan berhasil dihapus');
        }
    } catch (error) {
        console.error('Gagal menghapus catatan:', error);
    }
}

// Komponen bar aplikasi
class AppBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <img src="layouting/assets/logo.jpeg" alt="Logo" class="app-logo">
                <h1>Aplikasi Catatan</h1>
            </header>
        `;
    }
}

// Komponen input catatan baru
class NoteInput extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <section class="form-section">
                <h2>Tambah Catatan</h2>
                <form id="note-form">
                    <input type="text" id="title" placeholder="Judul" required>
                    <textarea id="body" placeholder="Isi catatan" required></textarea>
                    <button type="submit">Tambah Catatan</button>
                </form>
                <div id="validation-message" class="validation-message"></div>
            </section>
        `;

        const titleInput = this.querySelector('#title');
        const bodyInput = this.querySelector('#body');
        const validationMessage = this.querySelector('#validation-message');

        titleInput.addEventListener('input', () => {
            if (titleInput.value.trim().length < 3) {
                validationMessage.textContent = 'Judul harus memiliki minimal 3 karakter.';
                validationMessage.classList.add('error');
            } else {
                validationMessage.textContent = '';
            }
        });

        bodyInput.addEventListener('input', () => {
            if (bodyInput.value.trim().length < 10) {
                validationMessage.textContent = 'Isi catatan harus memiliki minimal 10 karakter.';
                validationMessage.classList.add('error');
            } else {
                validationMessage.textContent = '';
            }
        });

        this.querySelector('form').addEventListener('submit', async (event) => {
            event.preventDefault(); 
            const title = titleInput.value;
            const body = bodyInput.value;

            // Menambahkan catatan ke API
            const newNote = await addNoteToAPI(title, body);
            if (newNote) {
                displayNotes();
                this.querySelector('#note-form').reset();
                validationMessage.textContent = ''; 
            }
        });
    }
}

// Komponen item catatan
class NoteItem extends HTMLElement {
    constructor(note) {
        super();
        this.note = note;
    }

    connectedCallback() {
        this.setAttribute('data-note-id', this.note.id); 

        this.innerHTML = `
            <div class="note">
                <h3>${this.note.title}</h3>
                <p>${this.note.body}</p>
                <small>Dibuat pada: ${new Date(this.note.createdAt).toLocaleString()}</small>
                <button class="delete-btn">Hapus</button>
            </div>
        `;

        this.querySelector('.delete-btn').addEventListener('click', async () => {
            await deleteNoteFromAPI(this.note.id);
            displayNotes(); 
        });
    }
}

customElements.define('app-bar', AppBar);
customElements.define('note-input', NoteInput);
customElements.define('note-item', NoteItem);

// Fungsi untuk menampilkan catatan
async function displayNotes() {
    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = ''; 

    const notesData = await fetchNotes(); 
    notesData.forEach(note => {
        const noteElement = document.createElement('note-item');
        noteElement.note = note;
        notesContainer.appendChild(noteElement);
    });
}

// Menampilkan catatan saat halaman pertama kali dimuat
displayNotes();
