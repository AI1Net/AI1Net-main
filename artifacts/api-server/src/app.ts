import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";
import walletRouter from "./routes/wallet";

const app: Express = express();

/* =========================
   1. TRUST PROXY (IMPORTANT FOR RAILWAY + CLERK)
========================= */
app.set("trust proxy", 1);

/* =========================
   2. CORS (MUST BE FIRST)
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:23717",
        "http://localhost:5173",
        "https://app.ai1net.xyz",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Blocked by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

/* =========================
   3. BODY PARSERS (ONLY ONCE)
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   4. LOGGER
========================= */
app.use(
  pinoHttp({
    logger,
  })
);

/* =========================
   5. CLERK PROXY
========================= */
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY
    ),
  }))
);

/* =========================
   6. ROUTES
========================= */
app.use("/api", router);
app.use("/api/wallet", walletRouter);

export default app;
