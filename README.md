# Workspace AI - Trello Power-Up

Sistema completo per esportare una bacheca Trello e analizzarla con GitHub Copilot.

## Setup Rapido

### 1. Clona il Repository

git clone https://github.com/IRLANDOSVEVO/workspace-ai-trello.git
cd workspace-ai-trello

### 2. Installa Dipendenze

npm install

### 3. Deploy su Vercel

npm install -g vercel
vercel

## Come Usare

1. Apri una bacheca Trello
2. Clicca il Power-Up Workspace AI
3. Clicca il bottone Apri in Workspace AI
4. Autorizza l accesso (popup OAuth Trello)
5. Si apre la pagina Workspace AI con il prompt precompilato
6. Clicca Apri in Copilot per continuare
7. Incolla il prompt nella chat di Copilot

## Sicurezza

- HTTPS automatico su Vercel
- Sessioni temporanee (24 ore)
- Nessun dato sensibile nel frontend
- Cache in memoria temporanea
- OAuth Trello per autenticazione

## License

MIT
