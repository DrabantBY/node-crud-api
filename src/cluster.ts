import cluster from "node:cluster";
import { createServer, request } from "node:http";
import { availableParallelism } from "node:os";
import { createServerInstance } from "./app";

process.loadEnvFile();

const PORT = Number(process.env.PORT);
const COUNT = availableParallelism() - 1;

const ports = Array.from({ length: COUNT }, (_, i) => PORT + i + 1);

if (cluster.isPrimary) {
  for (const port of ports) {
    cluster.fork({ WORKER_PORT: port });
  }

  let index = 0;
  const balancer = createServer((req, res) => {
    const port = ports[index];
    index = (index + 1) % ports.length;

    const workerReq = request(
      {
        path: req.url,
        method: req.method,
        headers: req.headers,
        port,
      },
      (workerRes) => {
        res.writeHead(workerRes.statusCode ?? 502, workerRes.headers);
        workerRes.pipe(res);
      },
    );

    req.pipe(workerReq);
  });

  balancer.listen(PORT, () => {
    console.log(`Balancer listening on port ${PORT}`);
  });
} else {
  const app = createServerInstance({ logger: true });

  try {
    await app.listen({ port: Number(process.env.WORKER_PORT) });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
