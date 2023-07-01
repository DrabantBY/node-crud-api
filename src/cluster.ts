import cluster from 'cluster';
import { cpus } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));
const exec = join(_dirname, 'index.js');
const cpuCount = cpus().length;

cluster.setupPrimary({ exec });

for (let i = 1; i <= cpuCount; i++) {
  cluster.fork({ PORT: 4000 + i });
}
