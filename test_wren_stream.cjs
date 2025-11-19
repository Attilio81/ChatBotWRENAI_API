const fetch = require('node-fetch');

async function testWrenStream() {
    try {
        const response = await fetch('http://localhost:5173/wren-api/stream/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'Show me sales by agent' })
        });

        if (!response.ok) {
            console.error('Error:', response.status, response.statusText);
            return;
        }

        const stream = response.body;
        stream.on('data', (chunk) => {
            console.log('Received chunk:', chunk.toString());
        });

        stream.on('end', () => {
            console.log('Stream ended');
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

testWrenStream();
