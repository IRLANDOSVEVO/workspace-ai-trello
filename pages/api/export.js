let sessionsMap = new Map();

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { ...options, timeout: 10000 });
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function callTrelloAPI(endpoint, token) {
  const apiKey = process.env.TRELLO_API_KEY || '27f43e89b627b954c7f2da7eee870b22';
  const url = `https://api.trello.com/1${endpoint}?token=${token}&key=${apiKey}`;
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`Trello API error: ${response.status}`);
  return response.json();
}

async function exportBoardData(boardId, userToken) {
  try {
    const [board, lists, members] = await Promise.all([
      callTrelloAPI(`/boards/${boardId}`, userToken),
      callTrelloAPI(`/boards/${boardId}/lists`, userToken),
      callTrelloAPI(`/boards/${boardId}/members`, userToken)
    ]);
    const cards = await callTrelloAPI(`/boards/${boardId}/cards`, userToken);
    const labels = await callTrelloAPI(`/boards/${boardId}/labels`, userToken);
    const cardsEnhanced = await Promise.all(
      cards.map(async (card) => {
        try {
          const [checklists, attachments] = await Promise.all([
            callTrelloAPI(`/cards/${card.id}/checklists`, userToken),
            callTrelloAPI(`/cards/${card.id}/attachments`, userToken)
          ]);
          return { ...card, checklists, attachments };
        } catch (err) {
          return { ...card, checklists: [], attachments: [] };
        }
      })
    );
    const boardData = {
      meta: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'Workspace AI Power-Up',
        version: '1.0'
      },
      board: {
        id: board.id,
        name: board.name,
        description: board.desc || '',
        url: board.url,
        closed: board.closed,
        created: board.dateLastActivity
      },
      members: members.map(m => ({
        id: m.id,
        name: m.fullName || m.username,
        email: m.email || '',
        username: m.username
      })),
      labels: labels.map(l => ({ id: l.id, name: l.name, color: l.color })),
      lists: lists.map(list => ({
        id: list.id,
        name: list.name,
        closed: list.closed,
        position: list.pos
      })),
      cards: cardsEnhanced.map(card => ({
        id: card.id,
        name: card.name,
        description: card.desc || '',
        listId: card.idList,
        members: card.idMembers || [],
        labels: card.idLabels || [],
        due: card.due || null,
        dueComplete: card.dueComplete || false,
        position: card.pos,
        url: card.url,
        checklists: (card.checklists || []).map(c => ({
          id: c.id,
          name: c.name,
          items: (c.checkItems || []).map(item => ({
            id: item.id,
            name: item.name,
            state: item.state
          }))
        })),
        attachments: (card.attachments || []).map(a => ({
          id: a.id,
          name: a.name,
          url: a.url,
          type: a.mimeType
        }))
      }))
    };
    return boardData;
  } catch (error) {
    console.error('Export board error:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { boardId, userToken } = req.body;
    if (!boardId || !userToken) return res.status(400).json({ error: 'boardId e userToken sono obbligatori' });
    
    const boardData = await exportBoardData(boardId, userToken);
    const sessionId = generateSessionId();
    
    sessionsMap.set(sessionId, {
      data: boardData,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });
    
    if (Math.random() < 0.01) {
      const now = Date.now();
      for (const [id, session] of sessionsMap.entries()) {
        if (session.expiresAt < now) sessionsMap.delete(id);
      }
    }
    
    const vercelUrl = process.env.VERCEL_URL || 'localhost:3000';
    const protocol = process.env.VERCEL_ENV === 'production' ? 'https' : 'http';
    const sessionUrl = `${protocol}://${vercelUrl}/view/${sessionId}`;
    
    return res.status(200).json({ sessionUrl, sessionId, boardName: boardData.board.name });
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: error.message || 'Errore durante l esportazione' });
  }
}

if (typeof global !== 'undefined') {
  global.sessionsMap = global.sessionsMap || sessionsMap;
}
