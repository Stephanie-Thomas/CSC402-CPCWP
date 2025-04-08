import type { Express } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://backend-node:4000", 
      changeOrigin: true,
      // Because Express strips the '/api' prefix when mounting middleware,
      // we add it back so that the backend receives the full URL.
      pathRewrite: (path, req) => `/api${path}`
    })
  );

  const httpServer: Server = createServer(app);
  return httpServer;
}
