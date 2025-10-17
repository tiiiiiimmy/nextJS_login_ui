// api/server.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import usersRouter from './routes/users';

// Explicitly load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app: Application = express();


const PORT = Number(process.env.PORT) || Number(process.env.API_PORT) || 5001;

// ---- CORS ----
const FRONTEND_URL = process.env.FRONTEND_URL?.trim();
const EXTRA_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = [
  ...(FRONTEND_URL ? [FRONTEND_URL] : []),
  ...EXTRA_ORIGINS,
];

const isAllowedOrigin = (origin?: string | null) => {
  if (!origin) return true; // same-origin / curl
  if (ALLOWED_ORIGINS.includes(origin)) return true;

  if (/\.csb\.app$/i.test(origin)) return true;
  return false;
};

const corsOptions: CorsOptions = {
  origin: (origin, cb) => (isAllowedOrigin(origin) ? cb(null, true) : cb(new Error(`Not allowed by CORS: ${origin}`))),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));     //  app.options('/api/*', cors(corsOptions))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});


app.use('/api/users', usersRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});


if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    if (ALLOWED_ORIGINS.length) {
      console.log(`CORS allow-list: ${ALLOWED_ORIGINS.join(', ')}`);
    } else {
      console.log('CORS allow-list: *.csb.app (dynamic) + same-origin');
    }
  });
}

export default app;
