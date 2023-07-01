import { createServer } from 'http';

import handleServer from './handleServer';
import 'dotenv/config';

const PORT = process.env.PORT ?? 3000;

export const server = createServer(handleServer);

server.listen(PORT, () => console.log(`server is running on PORT: ${PORT}`));
