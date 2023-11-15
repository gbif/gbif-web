import express from 'express';
import { stream } from '../dist/gbif/streaming-server/entry.server.js';

const PORT = parseInt(process.env.PORT || 3000);

async function main() {
    const app = express();

    app.use(express.static('dist/gbif/streaming-client', { index: false }));
    app.use(express.static('public', { index: false }));

    app.use('*', async (req, res) => {
        await stream(req, res);
    });

    app.listen(PORT, () => {
        console.log(`Streaming server listening at http://localhost:${PORT}`);
    });
}

main();