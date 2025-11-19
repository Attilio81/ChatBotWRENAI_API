# 🤖 ChatBot con WREN AI API

> **Interfaccia conversazionale intelligente per interrogare database aziendali usando linguaggio naturale**

Un'applicazione web moderna che sfrutta **WREN AI** per tradurre domande in linguaggio naturale in query SQL, permettendo analisi dati semplici ed intuitive. Include supporto vocale, visualizzazioni grafiche e un'interfaccia responsive.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.2-yellow)
![WREN AI](https://img.shields.io/badge/WREN_AI-Powered-green)

## 🌟 Caratteristiche Principali

### 🧠 **Powered by WREN AI**
- **Natural Language to SQL**: Trasforma domande in italiano in query SQL ottimizzate
- **Context-Aware**: Mantiene il contesto della conversazione per domande di follow-up
- **Intelligent Responses**: Risposte elaborate e formattate da AI
- **Streaming Support**: Risposte in tempo reale con feedback progressivo

### 🎤 **Input Vocale**
- Riconoscimento vocale in italiano tramite Web Speech API
- Interfaccia hands-free con feedback visivo
- Pulsante microfono con animazione durante l'ascolto
- Compatibilità multi-browser (Chrome, Edge, Opera)

### 📊 **Visualizzazioni Dati**
- Grafici interattivi generati automaticamente con Vega-Lite
- Rendering markdown avanzato per risposte formattate
- Tabelle dati responsive e leggibili
- Supporto per domande analitiche complesse

### 📱 **Design Moderno**
- Interfaccia responsive ottimizzata per desktop, tablet e mobile
- Design pulito con effetti glassmorphism
- Animazioni fluide e transizioni
- Dark/light mode friendly

## 🚀 Quick Start

### Prerequisiti
- **Node.js** 18+ 
- **WREN AI Engine** in esecuzione (locale o remoto)
- Database configurato e connesso a WREN

### Installazione

```bash
# Clona il repository
git clone https://github.com/Attilio81/ChatBotWRENAI_API.git
cd ChatBotWRENAI_API

# Installa le dipendenze
npm install

# Avvia il development server
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Configurazione WREN AI

1. **Configura il proxy Vite** (già incluso in `vite.config.ts`):
```typescript
server: {
  proxy: {
    '/wren-api': {
      target: 'http://localhost:8080',  // URL WREN AI Engine
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/wren-api/, '')
    }
  }
}
```

2. **Avvia WREN AI Engine** con il tuo modello dati configurato

3. **Test della connessione**: Usa gli script di test inclusi
```bash
node test_wren_api.js      # Test API standard
node test_wren_stream.cjs  # Test streaming
```

## 🏗️ Architettura

### Frontend Stack
```
React 19.1.1 + TypeScript 5.6 + Vite 7.1.2
├── UI Framework: Material-UI (MUI)
├── Charting: Vega + Vega-Lite + Vega-Embed
├── Markdown: marked
└── Voice: Web Speech API
```

### Backend Integration
```
User Question → WREN AI Engine → SQL Generation → Database Query → AI Response → UI
```

### Componenti Principali

```
src/
├── components/
│   ├── AgentSelector.tsx      # Landing page selezione modalità
│   ├── ChatHeader.tsx         # Header con info sessione
│   ├── ChatMessages.tsx       # Visualizzazione conversazione
│   ├── ChatInput.tsx          # Input testo + microfono
│   ├── MessageBubble.tsx      # Rendering singoli messaggi
│   ├── ChartRenderer.tsx      # Grafici Vega-Lite
│   └── QuickQuestions.tsx     # Domande suggerite
├── services/
│   └── wren.ts                # Client API WREN AI
├── hooks/
│   ├── useChat.ts             # Logica gestione chat
│   └── useVoiceRecognition.ts # Web Speech API wrapper
└── types/
    ├── index.ts               # Type definitions
    └── speech.d.ts            # Web Speech API types
```

## 📋 Comandi Disponibili

```bash
npm run dev      # Avvia development server con hot reload
npm run build    # Build di produzione
npm run lint     # Verifica qualità codice con ESLint
npm run preview  # Preview build di produzione
```

## 💡 Esempi d'Uso

### Domande Analitiche Base
```
👤 "Mostrami i 10 articoli più costosi"
🤖 Genera e esegue: SELECT TOP 10 * FROM articoli ORDER BY prezzo DESC

👤 "Quanti prodotti abbiamo in giacenza?"
🤖 Conta articoli con giacenza > 0 e fornisce il totale

👤 "Trova tutti gli spettrofotometri"
🤖 Filtra per nome prodotto con LIKE '%spettrofotometro%'
```

### Domande con Follow-up
```
👤 "Mostrami le vendite di gennaio"
🤖 [Genera query per vendite gennaio]

👤 "E quelle di febbraio?"
🤖 [Usa il contesto per generare query simile per febbraio]

👤 "Confrontale"
🤖 [Genera query comparativa con entrambi i mesi]
```

### Visualizzazioni Grafiche
```
👤 "Crea un grafico delle vendite mensili"
🤖 Genera query + specifica Vega-Lite per bar chart

👤 "Mostra la distribuzione dei prezzi"
🤖 Crea istogramma interattivo con Vega
```

## 🎮 Guida Utilizzo

### 1. **Avvio Applicazione**
All'apertura vedrai la landing page con:
- Info sul progetto e WREN AI
- Accesso diretto alla chat
- (Opzionale) Selezione di modalità o agenti se implementati

### 2. **Interazione Chat**

**Testo**:
- Digita la domanda nella textarea
- Premi `Invio` o clicca l'icona 📤
- Attendi la risposta con streaming progressivo

**Voce**:
1. Clicca il pulsante 🎤 (diventa rosso)
2. Concedi permessi microfono se richiesto
3. Parla chiaramente in italiano
4. Il testo viene trascritto automaticamente
5. Clicca di nuovo per fermare o invia direttamente

### 3. **Domande Rapide**
- Usa i suggerimenti precompilati per iniziare
- Personalizza le domande nel componente `QuickQuestions.tsx`
- Perfette per onboarding nuovi utenti

### 4. **Visualizzazioni**
- I grafici appaiono automaticamente quando pertinenti
- Interattivi: hover, zoom, pan
- Esportabili come immagine

### 5. **Gestione Sessione**
- Ogni conversazione ha un Thread ID univoco
- Il contesto viene mantenuto per follow-up
- Ricarica la pagina per iniziare una nuova sessione

## 🔧 Configurazione Avanzata

### WREN AI Endpoints

Il servizio `wren.ts` espone questi metodi:

```typescript
// Domanda singola
await wrenService.ask(question, threadId?)

// Lista modelli disponibili
await wrenService.getModels()

// Genera grafico Vega-Lite
await wrenService.generateVegaChart(question, sql)

// Streaming response (async generator)
for await (const chunk of wrenService.askStream(question, threadId)) {
  console.log(chunk.delta);
}
```

### Personalizzazione

**Modifica colori e stili**: Edita i file `.css` in `src/components/`

**Aggiungi nuove domande rapide**: In `QuickQuestions.tsx`
```typescript
const questions = [
  "La tua domanda personalizzata qui",
  // ...
];
```

**Cambia comportamento WREN**: In `src/services/wren.ts`
```typescript
constructor(baseUrl: string = '/wren-api') {
  this.baseUrl = baseUrl; // Cambia endpoint
}
```

## 🛠️ Stack Tecnologico Completo

| Layer | Tecnologia | Versione | Scopo |
|-------|-----------|----------|-------|
| **Frontend** | React | 19.1.1 | UI Framework |
| | TypeScript | 5.6 | Type Safety |
| | Vite | 7.1.2 | Build Tool |
| **UI Components** | Material-UI | 7.3.2 | Component Library |
| | Emotion | 11.14.0 | CSS-in-JS |
| **Data Viz** | Vega | 6.2.0 | Grammar of Graphics |
| | Vega-Lite | 6.4.1 | High-level Viz |
| | Vega-Embed | 7.1.0 | React Integration |
| **Text** | marked | 16.3.0 | Markdown Parser |
| **AI Backend** | WREN AI | - | NL2SQL Engine |
| **Voice** | Web Speech API | Native | Voice Recognition |

## 🚀 Deployment

### Build Production

```bash
npm run build
```

Genera la cartella `dist/` pronta per il deploy.

### Deploy su Vercel/Netlify

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

⚠️ **Importante**: Configura le variabili d'ambiente per puntare a WREN AI in produzione.

### Docker (Opzionale)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🐛 Troubleshooting

### Problemi Comuni

**🔴 WREN AI non risponde**
- ✅ Verifica che WREN AI Engine sia in esecuzione
- ✅ Controlla l'URL nel proxy Vite (`vite.config.ts`)
- ✅ Testa con `node test_wren_api.js`
- ✅ Controlla i log del browser (F12 → Network)

**🎤 Input vocale non funziona**
- ✅ Usa Chrome, Edge o Opera (Firefox/Safari hanno supporto limitato)
- ✅ Verifica permessi microfono nelle impostazioni browser
- ✅ Assicurati di essere su HTTPS o localhost
- ✅ Controlla che il microfono funzioni in altre app

**📊 Grafici non si visualizzano**
- ✅ Verifica che Vega-Embed sia installato: `npm list vega-embed`
- ✅ Controlla errori console per specifica Vega non valida
- ✅ Assicurati che WREN restituisca una specifica Vega-Lite valida

**⚡ Performance lente**
- ✅ Abilita streaming per risposte più rapide (già implementato)
- ✅ Ottimizza le query WREN lato database
- ✅ Usa build di produzione (`npm run build`)

### Debug Avanzato

**Console Browser**: 
```javascript
// F12 → Console
// Abilita verbose logging
localStorage.setItem('debug', 'wren:*');
```

**Network Inspection**:
- F12 → Network → Filtra per `/wren-api`
- Controlla payload request/response
- Verifica timing e status codes

## 📄 Documentazione Aggiuntiva

- **WREN AI**: [Documentazione ufficiale](https://github.com/Canner/WrenAI)
- **Vega-Lite**: [Specifica e esempi](https://vega.github.io/vega-lite/)
- **Web Speech API**: [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 🤝 Contributi

Progetto aperto a miglioramenti! Per contribuire:

1. Fork del repository
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📝 License

Questo progetto è privato e proprietario di EGM.

---

**Versione**: 3.0.0  
**Ultimo aggiornamento**: Novembre 2025  
**Caratteristiche**: WREN AI Integration, Voice Input, Vega Charts, Streaming Responses
