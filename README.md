# 🤖 ChatBot Agenti EGM

> **Sistema di ChatBot Multi-Agente per operazioni aziendali EGM**

Un'interfaccia web moderna e intuitiva che permette di interagire con diversi agenti specializzati attraverso chat testuali e input vocali, integrata con automazioni N8N.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.2-yellow)
![License](https://img.shields.io/badge/License-Private-red)

## 🌟 Caratteristiche Principali

### 🎯 **Multi-Agente**
- **Agente Magazziniere** 📦 - Gestione inventario e movimentazioni
- **Consultazione Ordini Clienti** 🛒 - Ricerca e visualizzazione ordini
- **Agente Preventivi** 📋 - Lettura e consultazione dei preventivi aziendali
- Landing page per selezione agente con design moderno

### 🎤 **Input Vocale**
- Riconoscimento vocale in italiano (Web Speech API)
- Interfaccia hands-free con feedback visivo
- Pulsante microfono con animazione pulsante durante l'ascolto
- Gestione errori e compatibilità browser

### 🔄 **Gestione Ambiente & Sessioni**
- Modalità Test e Produzione con toggle dinamico
- Routing automatico dei webhook per ogni agente
- Reset automatico della chat quando si cambia agente
- Session ID univoco per ogni conversazione
- Possibilità di tornare alla selezione agenti

### 📱 **Design Responsive**
- Ottimizzato per desktop, tablet e mobile
- Design moderno con gradienti e effetti glassmorphism
- Interfaccia utente intuitiva e accessibile
- Animazioni fluide e feedback visivo

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+
- N8N installato e configurato
- Database SQL Server accessibile

### Installazione
```bash
# Clone e installa dipendenze
npm install

# Avvia development server
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Configurazione N8N
1. Importa il workflow `Magazziniere (1).json` in N8N
2. Configura le credenziali database SQL Server
3. Imposta le API key Anthropic per i modelli Claude
4. Attiva il workflow

## 🏗️ Architettura

### Frontend (React + TypeScript)
- **Framework**: React 19.1.1 + Vite + TypeScript
- **Styling**: CSS modules responsive
- **Features**: Markdown rendering, gestione stato, error handling

### Backend (N8N Workflow)
```
Webhook → AI Agent 1 (SQL) → SQL Database → Code Formatter → AI Agent 2 (Response) → Output
```

### Dual AI Agent System
- **Agent 1**: Generatore query SQL (Claude Haiku 3.5)
- **Agent 2**: Generatore risposte naturali (Claude Sonnet 3.7)

## 📋 Comandi Disponibili

```bash
npm run dev      # Development server
npm run build    # Build production
npm run lint     # Run ESLint
npm run preview  # Preview build
```

## 🗃️ Database Schema

Il sistema interroga le tabelle:
- `artico`: Anagrafica articoli
- `artprox`: Giacenze disponibili
- `listini`: Prezzi e validità

## 💡 Esempi d'Uso

```
👤 "Mostrami i 10 articoli più costosi"
🤖 Genera SQL con TOP 10 ORDER BY prezzo DESC

👤 "Articoli con giacenza sotto i 5 pezzi"
🤖 Aggiunge WHERE giacenza < 5

👤 "Cerca spettrofotometro"
🤖 Applica filtro LIKE su descrizione
```

## 🔧 Configurazione

### Webhook Endpoints

| Agente | Ambiente | Endpoint |
|--------|----------|----------|
| **Magazziniere** | Test | `http://localhost:5678/webhook-test/chatbot` |
| **Magazziniere** | Produzione | `http://localhost:5678/webhook/chatbot` |
| **Ordini Clienti** | Test | `http://localhost:5678/webhook-test/chatbotimpegni` |
| **Ordini Clienti** | Produzione | `http://localhost:5678/webhook/chatbotimpegni` |
| **Preventivi** | Test | `http://localhost:5678/webhook-test/preventivi` |
| **Preventivi** | Produzione | `http://localhost:5678/webhook/preventivi` |

### AI Models
- **SQL Generator**: Claude Haiku 3.5 (velocità)
- **Response Generator**: Claude Sonnet 3.7 (qualità)

## 🎮 Guida Utilizzo

### 1. **Selezione Agente**
- All'avvio viene mostrata la landing page con gli agenti disponibili
- Scegli l'agente più adatto alle tue esigenze:
  - **Magazziniere** 📦: Per gestione inventario e giacenze
  - **Ordini Clienti** 🛒: Per consultazione e ricerca ordini
  - **Preventivi** 📋: Per lettura e consultazione preventivi aziendali
- La chat si azzera automaticamente ad ogni cambio di agente

### 2. **Interazione Chat**
- **Testo**: Digita il messaggio e premi Invio o clicca 📤
- **Voce**: Clicca il pulsante 🎤 e inizia a parlare in italiano
- **Ambiente**: Usa il toggle per cambiare tra Test e Produzione
- **Cambio Agente**: Clicca "← Cambia Agente" nell'header

### 3. **Input Vocale**
1. Clicca il pulsante microfono 🎤 (diventa rosso e pulsa)
2. Concedi i permessi per il microfono se richiesto
3. Parla chiaramente in italiano
4. Il testo apparirà automaticamente nella textarea
5. Clicca di nuovo per fermare la registrazione
6. Invia il messaggio normalmente

### 4. **Compatibilità Browser per Input Vocale**
- ✅ **Chrome/Chromium** (consigliato)
- ✅ **Microsoft Edge**
- ✅ **Opera**
- ❌ **Firefox** (supporto limitato)
- ❌ **Safari** (non supportato)

## 🚀 Roadmap Multi-Agente

Il progetto è progettato per espandersi con una flotta di agenti specializzati:

- ✅ **Magazziniere**: Gestione inventario (IMPLEMENTATO)
- ✅ **Consultazione Ordini Clienti**: Ricerca ordini (IMPLEMENTATO)
- ✅ **Preventivi**: Lettura e consultazione preventivi (IMPLEMENTATO)
- 🔲 **Agente Vendite**: CRM e pipeline commerciale
- 🔲 **Agente Contabilità**: Bilanci e reportistica
- 🔲 **Agente Produzione**: Pianificazione e controllo
- 🔲 **Agente HR**: Gestione risorse umane

## 🛠️ Sviluppo

### Stack Tecnologico
- **Frontend**: React + TypeScript + Vite
- **Backend**: N8N + Claude AI
- **Database**: Microsoft SQL Server
- **Markdown**: marked library

### Struttura Progetto
```
src/
├── components/           # Componenti React
│   ├── AgentSelector/   # Selezione agenti con landing page
│   ├── ChatHeader/      # Header con info agente selezionato
│   ├── ChatMessages/    # Visualizzazione conversazioni
│   └── ChatInput/       # Input testo + riconoscimento vocale
├── hooks/               # Custom hooks
│   ├── useChat.ts       # Gestione stato chat e agenti
│   └── useVoiceRecognition.ts # Web Speech API
├── types/               # TypeScript definitions
│   ├── index.ts         # Message, ChatResponse, Agent interfaces
│   └── speech.d.ts      # Web Speech API type definitions
├── styles/              # CSS files per styling
└── assets/              # Static resources
```

### Aggiungere Nuovi Agenti

Per aggiungere un nuovo agente al sistema:

1. **Modifica `AgentSelector.tsx`**: Aggiungi il nuovo agente all'array `AVAILABLE_AGENTS`:
```typescript
{
  id: 'nuovo-agente',
  name: 'Nome Agente',
  description: 'Descrizione dell\'agente e sue competenze',
  icon: '🎯',
  testWebhook: 'http://localhost:5678/webhook-test/nuovo-agente',
  prodWebhook: 'http://localhost:5678/webhook/nuovo-agente'
}
```

2. **Configura N8N**: Crea i workflow corrispondenti in N8N
3. **Test**: Verifica che gli endpoint webhook siano attivi

## 📄 Documentazione

Per documentazione completa, consultare i file di progetto:
- Documentazione tecnica dettagliata
- Guide non tecniche per stakeholder
- Workflow N8N configurati

## 🤝 Contributi

Progetto pilota per dimostrare le capacità di AI conversazionale nell'enterprise.

---

## 🐛 Troubleshooting

### Problemi Comuni

**🔴 Agente non risponde**
- ✅ Verifica che N8N sia in esecuzione su `localhost:5678`
- ✅ Controlla che il webhook dell'agente sia configurato e attivo
- ✅ Verifica la console del browser (F12) per errori di rete
- ✅ Prova a cambiare tra modalità Test/Produzione

**🎤 Input vocale non funziona**
- ✅ Usa Chrome, Edge o Opera (evita Firefox/Safari)
- ✅ Verifica permessi microfono nel browser
- ✅ Assicurati di essere su HTTPS o localhost
- ✅ Controlla che il microfono funzioni in altre app

**🎨 Problemi di visualizzazione**
- ✅ Riavvia il server di sviluppo (`npm run dev`)
- ✅ Svuota cache browser (Ctrl+F5)
- ✅ Verifica che i file CSS esistano nella cartella components
- ✅ Controlla errori nella console (F12 → Console)

**💬 Chat non si resetta**
- ✅ Il reset automatico avviene quando si cambia agente
- ✅ Usa il pulsante "← Cambia Agente" nell'header
- ✅ Ricarica la pagina se persistono problemi

### Debug e Logs
- **Console Browser**: F12 → Console (errori JavaScript)
- **Network Tab**: F12 → Network (problemi comunicazione)
- **N8N Logs**: Controlla i log dei workflow in N8N
- **Session ID**: Ogni conversazione ha un ID univoco nell'header

---

**Versione**: 2.0.0
**Ultimo aggiornamento**: Gennaio 2025
**Caratteristiche**: Multi-Agent, Voice Input, Responsive Design