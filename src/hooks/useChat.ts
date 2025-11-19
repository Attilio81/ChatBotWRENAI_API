import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message, Agent, ChatResponse } from '../types';
import { wrenService } from '../services/wren';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  // Ref to store threadId to persist across renders without causing re-renders
  const threadIdRef = useRef<string>(uuidv4());
  const [sessionId] = useState(() =>
    `session_${Date.now()}_${Math.random().toString(36).slice(2)} `
  );

  const resetChat = () => {
    setMessages([]);
    setInputText('');
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim() || !selectedAgent) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (selectedAgent.type === 'wren') {
        // WREN AI Logic with Streaming and Charts
        try {
          let botMessageId = Date.now() + 1;
          let currentText = '';
          let generatedSql = '';
          let reasoning = '';
          let queryData: any[] = [];

          // Initial empty message
          const botMessage: Message = {
            id: botMessageId,
            text: '🤔 Sto analizzando la tua domanda...',
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);

          // CHECK MEMORY FIRST
          let foundInMemory = false;
          try {
            const memory = await wrenService.getSqlPairs();
            if (memory.data) {
              const savedPair = memory.data.find((p: any) =>
                p.question.trim().toLowerCase() === messageText.trim().toLowerCase()
              );

              if (savedPair && savedPair.sql) {
                console.log('🧠 Found in memory:', savedPair);
                foundInMemory = true;
                generatedSql = savedPair.sql;

                setMessages(prev => prev.map(msg =>
                  msg.id === botMessageId ? {
                    ...msg,
                    text: '🧠 Recuperato dalla memoria...',
                    sql: generatedSql
                  } : msg
                ));
              }
            }
          } catch (memError) {
            console.warn('⚠️ Failed to check memory:', memError);
          }

          if (!foundInMemory) {
            await wrenService.streamAsk(messageText, async (data) => {
              console.log('🔔 WREN Stream Data Received:', data);
              const dataAny = data as any;

              // Handle STATE messages - extract reasoning
              if (dataAny.type === 'state' && dataAny.data) {
                const stateData = dataAny.data;

                // Build reasoning text
                if (stateData.state === 'sql_generation_searching' && stateData.rephrasedQuestion) {
                  reasoning = `**Domanda rielaborata:** ${stateData.rephrasedQuestion}\n\n`;
                }

                if (stateData.intentReasoning) {
                  reasoning += `**Analisi:** ${stateData.intentReasoning}\n\n`;
                }

                if (stateData.sqlGenerationReasoning) {
                  reasoning += `**Processo di generazione SQL:**\n${stateData.sqlGenerationReasoning}\n\n`;
                }

                // Update with progress message only
                if (reasoning && !currentText) {
                  setMessages(prev => prev.map(msg =>
                    msg.id === botMessageId ? {
                      ...msg,
                      text: '⏳ Generando la risposta...',
                      reasoning
                    } : msg
                  ));
                }
              }

              // Handle SQL in STATE messages
              if (dataAny.type === 'state' && dataAny.data?.state === 'sql_generation_success' && dataAny.data.sql) {
                generatedSql = dataAny.data.sql;
                setMessages(prev => prev.map(msg =>
                  msg.id === botMessageId ? {
                    ...msg,
                    text: '⏳ Eseguendo la query...',
                    reasoning,
                    sql: generatedSql
                  } : msg
                ));
              }

              // Handle SQL execution results - capture data
              if (dataAny.type === 'state' && dataAny.data?.state === 'sql_execution_end') {
                console.log('📊 SQL Execution End - Full data:', dataAny.data);

                // Try to capture data from various possible locations
                if (dataAny.data.data) {
                  queryData = dataAny.data.data;
                  console.log('✅ Found data in dataAny.data.data:', queryData.length, 'rows');
                } else if (dataAny.data.results) {
                  queryData = dataAny.data.results;
                  console.log('✅ Found data in dataAny.data.results:', queryData.length, 'rows');
                } else if (dataAny.data.rows) {
                  queryData = dataAny.data.rows;
                  console.log('✅ Found data in dataAny.data.rows:', queryData.length, 'rows');
                } else {
                  console.warn('❌ No data found in sql_execution_end. Available keys:', Object.keys(dataAny.data));
                }
              }

              // Handle known formats
              if (typeof data.delta === 'string') {
                currentText += data.delta;
              } else if (typeof data.response === 'string') {
                currentText += data.response;
              } else if (data.summary) {
                currentText = data.summary;
              }

              // Handle "type" based format
              if (dataAny.type === 'delta' && dataAny.delta) {
                currentText += dataAny.delta;
              }
              if (dataAny.type === 'content' && dataAny.text) {
                currentText += dataAny.text;
              }

              // Handle content_block_delta format
              if (dataAny.type === 'content_block_delta' && dataAny.delta?.text) {
                currentText += dataAny.delta.text;
              }

              // Capture SQL from WrenStreamResponse
              if (data.sql && !generatedSql) {
                generatedSql = data.sql;
              }

              // Capture Error
              if (data.error) {
                currentText = `❌ Errore: ${data.error}`;
              }

              // Update message with final response text (keep reasoning and SQL separate)
              if (currentText) {
                const messageUpdate = {
                  text: currentText,
                  reasoning,
                  sql: generatedSql,
                  data: queryData.length > 0 ? queryData : undefined
                };

                console.log('💬 Final message update:', {
                  hasText: !!currentText,
                  hasReasoning: !!reasoning,
                  hasSql: !!generatedSql,
                  hasData: queryData.length > 0,
                  dataRows: queryData.length
                });

                setMessages(prev => prev.map(msg =>
                  msg.id === botMessageId ? { ...msg, ...messageUpdate } : msg
                ));
              }
            }, threadIdRef.current);
          }

          // After streaming completes (or if found in memory), if we have SQL, fetch the actual data
          if (generatedSql) {
            try {
              console.log('🔄 Fetching query results with runSql...');
              const sqlResults = await wrenService.runSql(generatedSql);

              console.log('📦 Full runSql response:', sqlResults);
              console.log('📦 Response keys:', Object.keys(sqlResults));

              if (sqlResults.records && sqlResults.records.length > 0) {
                console.log('✅ Got query results:', sqlResults.records.length, 'rows');
                queryData = sqlResults.records;

                // Update message with data
                setMessages(prev => prev.map(msg =>
                  msg.id === botMessageId ? { ...msg, data: queryData } : msg
                ));

                // Auto-save question-SQL pair to knowledge base ONLY IF NOT FOUND IN MEMORY
                if (!foundInMemory) {
                  try {
                    const saveResult = await wrenService.saveSqlPair(messageText, generatedSql);
                    if (!saveResult.error) {
                      console.log('💾 Question-SQL pair saved to knowledge base');
                    }
                  } catch (saveError) {
                    // Silent fail - don't disrupt user experience
                    console.warn('⚠️ Failed to save SQL pair:', saveError);
                  }
                }
              } else if (sqlResults.error) {
                console.error('❌ SQL execution error:', sqlResults.error);
              } else {
                console.log('ℹ️  Query returned no results');
                console.log('ℹ️  sqlResults.records:', sqlResults.records);
              }
            } catch (sqlError) {
              console.error('Error fetching SQL results:', sqlError);
            }
          }

          // Note: Chart generation removed - will be triggered by button in MessageBubble

        } catch (wrenError) {
          console.error('WREN Service Error:', wrenError);
          const errorMessage: Message = {
            id: Date.now() + 1,
            text: '❌ Errore di comunicazione con WREN AI.',
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }

      } else {
        // N8N Logic (Existing)
        const webhookUrl = isTestMode
          ? selectedAgent.testWebhook
          : selectedAgent.prodWebhook;

        const response = await fetch(webhookUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
            sessionId: sessionId
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let botText = 'Errore: formato risposta non riconosciuto.';

        // Controlla il Content-Type per decidere come processare la risposta
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          try {
            const data: ChatResponse | ChatResponse[] = await response.json();
            console.log('Risposta da N8N (JSON):', data);

            // Gestisce array di oggetti con output
            if (Array.isArray(data)) {
              if (data.length > 0 && data[0].response) {
                botText = data[0].response;
              } else {
                botText = `❌ Formato risposta sconosciuto (array).\n\nDati ricevuti: ${JSON.stringify(data)}`;
              }
            } else {
              // Gestisce oggetto singolo
              if (data.response) {
                botText = data.response;
              } else if (data.message && data.message !== "Workflow was started") {
                botText = data.message;
              } else if (data.message === "Workflow was started") {
                botText = `⚠️ WORKFLOW DI TEST ATTIVO\n\nDevi importare il workflow corretto in N8N!\n\nMessaggio ricevuto: "${messageText}"`;
              } else {
                botText = `❌ Formato risposta sconosciuto.\n\nDati ricevuti: ${JSON.stringify(data)}`;
              }
            }
          } catch (jsonError) {
            botText = '❌ Errore parsing JSON response';
          }
        } else {
          // Leggi come testo se non è JSON
          const textData = await response.text();
          console.log('Risposta da N8N (text):', textData);
          botText = textData;
        }

        const botMessage: Message = {
          id: Date.now() + 1,
          text: botText,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Errore completo:', error);
      let errorText = 'Errore di connessione.';

      if (error instanceof TypeError) {
        errorText = '🔌 Verifica che N8N sia in esecuzione su localhost:5678';
      } else if (error instanceof Error && error.message.includes('500')) {
        errorText = '⚠️ Errore nel workflow N8N. Controlla la configurazione.';
      } else if (error instanceof Error && error.message.includes('404')) {
        errorText = '📍 Webhook non trovato. Verifica il path /webhook/chatbot';
      }

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMessage = useCallback((messageId: number, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  }, []);

  return {
    messages,
    inputText,
    setInputText,
    isLoading,
    sessionId,
    isTestMode,
    setIsTestMode,
    selectedAgent,
    setSelectedAgent,
    sendMessage,
    resetChat,
    updateMessage
  };
};