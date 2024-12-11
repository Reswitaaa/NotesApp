import './script.js'; // Memastikan script.js diimpor
import './style.css';
import { fetchNotes } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchNotes().then((notes) => {
        console.log('Catatan dari API:', notes);
    });
});
