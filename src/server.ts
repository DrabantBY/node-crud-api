import { createServerInstance } from "./app";

process.loadEnvFile();

const server = createServerInstance({
  logger: true,
});

try {
  await server.listen({ port: Number(process.env.PORT ?? 4000) });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
