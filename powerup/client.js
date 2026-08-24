(function() {
  const BACKEND_URL = 'https://workspace-ai-trello.vercel.app';
  const statusEl = document.getElementById('status');
  const errorEl = document.getElementById('error');
  const exportBtn = document.getElementById('exportBtn');
  
  function setStatus(message) {
    statusEl.textContent = message;
    errorEl.innerHTML = '';
  }
  
  function showError(message) {
    errorEl.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
    statusEl.textContent = '';
    exportBtn.classList.remove('loading');
    exportBtn.disabled = false;
  }
  
  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
  
  async function getTrelloToken() {
    return new Promise((resolve, reject) => {
      Trello.authorize({
        type: 'popup',
        name: 'Workspace AI',
        scope: { read: 'allow', write: 'allow' },
        expiration: '30days',
        success: () => {
          const token = Trello.token();
          if (token) resolve(token);
          else reject(new Error('Token non disponibile'));
        },
        error: () => reject(new Error('Autorizzazione fallita'))
      });
    });
  }
  
  async function exportBoard() {
    try {
      exportBtn.classList.add('loading');
      exportBtn.disabled = true;
      setStatus('Autenticazione...');
      const token = await getTrelloToken();
      setStatus('Recupero dati bacheca...');
      const boardId = Trello.board().id;
      if (!boardId) throw new Error('Impossibile recuperare l ID della bacheca');
      setStatus('Inoltro al backend...');
      const response = await fetch(`${BACKEND_URL}/api/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId: boardId, userToken: token })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Errore: ${response.status}`);
      }
      const { sessionUrl } = await response.json();
      setStatus('Apertura Workspace AI...');
      window.open(sessionUrl, '_blank');
      setTimeout(() => {
        exportBtn.classList.remove('loading');
        exportBtn.disabled = false;
        setStatus('Completato');
      }, 1500);
    } catch (err) {
      console.error('Export error:', err);
      showError(err.message || 'Errore durante l esportazione');
    }
  }
  
  exportBtn.addEventListener('click', exportBoard);
  Trello.ready(() => { setStatus('Pronto'); });
})();
