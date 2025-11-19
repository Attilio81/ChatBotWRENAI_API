import { useState } from 'react';
import { marked } from 'marked';
import type { Message } from '../types';
import { ChartRenderer } from './ChartRenderer';
import { wrenService } from '../services/wren';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: Message;
  onUpdateMessage?: (messageId: number, updates: Partial<Message>) => void;
}

export const MessageBubble = ({ message, onUpdateMessage }: MessageBubbleProps) => {
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);

  // Configure marked for security
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  // Convert literal \n to actual newlines, then markdown to HTML
  const textWithNewlines = message.text.replace(/\\n/g, '\n');
  const htmlContent = marked(textWithNewlines);


  // Export data to CSV
  const exportToCSV = () => {
    if (!message.data || message.data.length === 0) return;

    const data = message.data;
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma or quote
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    // Create blob and download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `data_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate chart on demand
  const generateChart = async () => {
    console.log('📊 Generate Chart button clicked');
    console.log('📊 Message SQL:', message.sql);
    console.log('📊 Message text:', message.text);
    console.log('📊 onUpdateMessage available:', !!onUpdateMessage);

    if (!message.sql || !onUpdateMessage) {
      console.warn('⚠️ Cannot generate chart - missing SQL or onUpdateMessage');
      return;
    }

    setLoadingChart(true);
    try {
      console.log('📊 Calling wrenService.generateVegaChart...');
      const chartResponse = await wrenService.generateVegaChart(
        message.text,
        message.sql
      );

      console.log('📊 Chart response received:', chartResponse);
      console.log('📊 Has vegaSpec?', !!chartResponse.vegaSpec);
      console.log('📊 Has error?', !!chartResponse.error);

      if (chartResponse.vegaSpec) {
        console.log('✅ Chart spec found, updating message...');
        onUpdateMessage(message.id, { chartSpec: chartResponse.vegaSpec });
        console.log('✅ Message updated with chart spec');
      } else if (chartResponse.error) {
        console.error('❌ Chart generation error:', chartResponse.error);
      } else {
        console.warn('⚠️ No vegaSpec and no error in response');
      }
    } catch (error) {
      console.error('❌ Exception during chart generation:', error);
    } finally {
      setLoadingChart(false);
    }
  };

  return (
    <div className={`message ${message.sender}`}>
      <div className="message-content">
        {/* Collapsible Reasoning Section */}
        {message.reasoning && (
          <details className="reasoning-section" open={reasoningExpanded}>
            <summary onClick={() => setReasoningExpanded(!reasoningExpanded)}>
              {reasoningExpanded ? '▼' : '▶'} Dettagli ragionamento
            </summary>
            <div className="reasoning-content">
              <div dangerouslySetInnerHTML={{ __html: marked(message.reasoning) }} />

              {message.sql && (
                <div className="sql-section">
                  <strong>Query SQL:</strong>
                  <pre><code>{message.sql}</code></pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Main Response Text */}
        <div
          className="message-text"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Data Table */}
        {message.data && message.data.length > 0 && (
          <div className="data-table-container">
            <div className="data-table-header">
              <span>Risultati query ({message.data.length} righe)</span>
              <button
                className="export-btn"
                onClick={exportToCSV}
                title="Esporta in CSV"
              >
                📥 Esporta CSV
              </button>
            </div>
            <div className="data-table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    {Object.keys(message.data[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {message.data.slice(0, 100).map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((value: any, cellIdx) => (
                        <td key={cellIdx}>{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {message.data.length > 100 && (
                <div className="data-table-footer">
                  Mostrando 100 righe su {message.data.length}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chart Section */}
        {message.chartSpec ? (
          <div className="message-chart">
            <ChartRenderer spec={message.chartSpec} />
          </div>
        ) : (
          message.sql && !loadingChart && (
            <button
              className="generate-chart-btn"
              onClick={generateChart}
            >
              📊 Genera Grafico
            </button>
          )
        )}

        {loadingChart && <div className="chart-loading">⏳ Generando grafico...</div>}

        <span className="timestamp">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};