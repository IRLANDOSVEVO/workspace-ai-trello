import { useState } from 'react';

function renderPrompt(data) {
  if (!data) return '';
  const jsonStr = JSON.stringify(data, null, 2);
  return `SYSTEM - WORKSPACE AI\nSei un Analista Operativo Esperto.\nDevi basare ogni risposta esclusivamente sul JSON della bacheca Trello fornito qui sotto.\n\nRegole:\n- Usa solo i dati presenti nel JSON.\n- Non inventare informazioni.\n- Non usare internet.\n- Non usare memoria esterna.\n- Se un dato non è presente, rispondi: Questo dato non è presente nel JSON fornito.\n\nCompiti:\n- Analisi operativa della bacheca.\n- Identificazione priorità, ritardi, criticità.\n- Generazione report, ODL, piani di lavoro.\n- Risposte professionali basate solo sul JSON.\n\nJSON DELLA BACHECA:\n\`\`\`json\n${jsonStr}\n\`\`\``;
}

export default function WorkspaceAIPage({ sessionData, sessionId, error }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  if (error) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', background: '#f5f7fa'
      }}>
        <div style={{ background: 'white', padding: '32px', borderRadius: '12px', textAlign: 'center', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#d32f2f' }}>Sessione Non Valida</h1>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{error}</p>
        </div>
      </div>
    );
  }

  const prompt = renderPrompt(sessionData);
  const boardName = sessionData?.board?.name || 'Bacheca';
  const listCount = sessionData?.lists?.length || 0;
  const cardCount = sessionData?.cards?.length || 0;
  const memberCount = sessionData?.members?.length || 0;

  const openCopilot = () => {
    setLoading(true);
    const encodedPrompt = encodeURIComponent(prompt);
    const copilotUrl = `https://copilot.com/?q=${encodedPrompt}`;
    window.open(copilotUrl, '_blank');
    setTimeout(() => setLoading(false), 500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => alert('Errore durante la copia'));
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif', color: '#1a1a1a'
    }}>
      <div style={{
        padding: '16px 24px', background: 'white', borderBottom: '1px solid #e0e0e0',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <div style={{ fontSize: '24px' }}>🤖</div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '2px' }}>Workspace AI</h1>
          <p style={{ fontSize: '12px', color: '#666' }}>Analisi operativa della bacheca Trello</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{
          width: '280px', background: 'white', borderRight: '1px solid #e0e0e0',
          padding: '16px', overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>Bacheca</div>
            <div style={{ fontSize: '13px', padding: '8px 12px', background: '#f5f7fa', borderRadius: '6px', color: '#666' }}>{boardName}</div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>Statistiche</div>
            <div style={{ fontSize: '13px', padding: '8px 12px', background: '#f5f7fa', borderRadius: '6px', color: '#666', marginBottom: '4px' }}>Liste: {listCount}</div>
            <div style={{ fontSize: '13px', padding: '8px 12px', background: '#f5f7fa', borderRadius: '6px', color: '#666', marginBottom: '4px' }}>Card: {cardCount}</div>
            <div style={{ fontSize: '13px', padding: '8px 12px', background: '#f5f7fa', borderRadius: '6px', color: '#666' }}>Membri: {memberCount}</div>
          </div>
          {sessionData?.labels && sessionData.labels.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>Etichette</div>
              {sessionData.labels.map(label => (
                <div key={label.id} style={{ fontSize: '13px', padding: '8px 12px', background: '#f5f7fa', borderRadius: '6px', color: '#666', marginBottom: '4px' }}>{label.name}</div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f5f7fa' }}>
            <div style={{ background: '#e3f2fd', borderLeft: '4px solid #0052cc', padding: '12px 16px', borderRadius: '4px', fontSize: '12px', marginBottom: '16px' }}>
              ✨ Il prompt verrà inviato automaticamente a Copilot.com quando clicchi il bottone.
            </div>
            <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', marginBottom: '16px', maxWidth: '900px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#0052cc' }}>📋 Prompt del Sistema</div>
              <div style={{
                fontSize: '11px', lineHeight: '1.6', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                maxHeight: '400px', overflowY: 'auto', background: '#f9fafb', padding: '12px', borderRadius: '4px',
                border: '1px solid #eee', fontFamily: 'Monaco, Courier New, monospace'
              }}>{prompt}</div>
            </div>
          </div>
          
          <div style={{
            padding: '16px 24px', background: 'white', borderTop: '1px solid #e0e0e0',
            display: 'flex', gap: '12px', justifyContent: 'center'
          }}>
            <button
              onClick={openCopilot}
              disabled={loading}
              style={{
                padding: '10px 24px', background: '#0052cc', color: 'white', border: 'none',
                borderRadius: '6px', fontSize: '14px', fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Apertura Copilot...' : 'Apri in Copilot'}
            </button>
            <button
              onClick={copyToClipboard}
              style={{
                padding: '10px 24px', background: copied ? '#4caf50' : '#f0f0f0',
                color: copied ? 'white' : '#1a1a1a', border: 'none', borderRadius: '6px',
                fontSize: '14px', fontWeight: '500', cursor: 'pointer'
              }}
            >
              {copied ? 'Copiato' : 'Copia Prompt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { session: sessionId } = context.params;
  try {
    const sessionsMap = global.sessionsMap || new Map();
    const sessionData = sessionsMap.get(sessionId);
    if (!sessionData) return { props: { error: 'Sessione non trovata o scaduta' } };
    if (sessionData.expiresAt < Date.now()) {
      sessionsMap.delete(sessionId);
      return { props: { error: 'Sessione scaduta. Esporta di nuovo la bacheca.' } };
    }
    return { props: { sessionData: sessionData.data, sessionId }, revalidate: 3600 };
  } catch (err) {
    return { props: { error: 'Errore durante il caricamento della sessione' } };
  }
}
