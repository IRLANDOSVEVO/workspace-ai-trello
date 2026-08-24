export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: '#f5f7fa'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Workspace AI</h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>Trello Power-Up per analisi operativa con IA</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center', maxWidth: '500px', lineHeight: '1.6', color: '#666', fontSize: '14px' }}>
        <p>✓ Power-Up installato e configurato</p>
        <p>Apri una bacheca Trello e clicca il bottone Workspace AI</p>
        <p>Autorizza l accesso e inizia l analisi</p>
      </div>
    </div>
  );
}
