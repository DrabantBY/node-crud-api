import 'dotenv/config';
import { createServer } from 'http';

const server = createServer((_req, _res) => {});

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`current PORT: ${PORT}`));
