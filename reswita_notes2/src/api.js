const apiBaseURL = 'https://notes-api.dicoding.dev/v2';

export async function fetchNotes() {
    try {
        const response = await fetch(`${apiBaseURL}/notes`);
        const result = await response.json();
        if (result.status === 'success') {
            return result.data;
        }
    } catch (error) {
        console.error('Gagal mengambil catatan:', error);
    }
    return [];
}
