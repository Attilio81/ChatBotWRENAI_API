export interface WrenResponse {
    id: string;
    sql?: string;
    summary?: string;
    explanation?: string;
    type?: 'SQL_QUERY' | 'NON_SQL_QUERY';
    threadId?: string;
    error?: string;
}

export interface WrenModel {
    name: string;
    properties?: {
        displayName?: string;
        description?: string;
    };
}

export interface WrenModelsResponse {
    models: WrenModel[];
}

export interface WrenChartResponse {
    vegaSpec?: any; // Vega-Lite spec
    error?: string;
}

export interface WrenStreamResponse {
    id?: string;
    delta?: string;
    step?: string;
    final_answer?: string;
    sql?: string;
    summary?: string;
    error?: string;
    response?: string; // Fallback for non-standard fields
}

class WrenService {
    private baseUrl: string;

    constructor(baseUrl: string = '/wren-api') {
        this.baseUrl = baseUrl;
    }

    async ask(question: string, threadId?: string): Promise<WrenResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    threadId,
                }),
            });

            if (!response.ok) {
                throw new Error(`WREN API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error calling WREN API:', error);
            return {
                id: 'error',
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    async getModels(): Promise<WrenModelsResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/models`);

            if (!response.ok) {
                throw new Error(`WREN API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching WREN models:', error);
            throw error;
        }
    }

    async generateVegaChart(question: string, sql: string): Promise<WrenChartResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/generate_vega_chart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    sql,
                }),
            });

            if (!response.ok) {
                throw new Error(`WREN API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating chart:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    async runSql(sql: string): Promise<{ columns: string[], records: any[], error?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/run_sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sql }),
            });

            if (!response.ok) {
                throw new Error(`WREN API Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error running SQL:', error);
            return {
                columns: [],
                records: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async saveSqlPair(question: string, sql: string): Promise<{ id?: string, error?: string }> {
        try {
            console.log('💾 Saving SQL pair to knowledge base...');
            const response = await fetch(`${this.baseUrl}/knowledge/sql_pairs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, sql }),
            });

            if (!response.ok) {
                throw new Error(`WREN API Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ SQL pair saved successfully:', result.id);
            return result;
        } catch (error) {
            console.error('❌ Error saving SQL pair:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    async getSqlPairs(): Promise<{ data?: any[], error?: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/knowledge/sql_pairs`);

            if (!response.ok) {
                throw new Error(`WREN API Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return { data: result };
        } catch (error) {
            console.error('Error fetching SQL pairs:', error);
            return { error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    async streamAsk(question: string, onData: (data: WrenStreamResponse) => void, threadId?: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/stream/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question, threadId }),
            });

            if (!response.ok || !response.body) {
                throw new Error(`WREN API Error: ${response.status} ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            onData(data);
                        } catch (e) {
                            console.warn('Error parsing stream chunk:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in streamAsk:', error);
            onData({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
    }
}

export const wrenService = new WrenService();
