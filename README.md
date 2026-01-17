# Authenticity Gate

🚀 **Quick Setup Guide** → See [SETUP.md](./SETUP.md)

A simple, production-ready content verification platform using **GenLayer Intelligent Contracts** with **Gemini AI** and **Firebase**. Verify content authenticity, detect plagiarism, identify deepfakes, and perform sentiment analysis with blockchain consensus.

## 🌟 Features

- **GenLayer Intelligent Contract**: Python contract uses Gemini AI via `gl.exec_llm()` for analysis
- **Blockchain Consensus**: Multiple validators reach agreement on AI analysis results
- **Multi-Metric Verification**: Originality, plagiarism risk, deepfake confidence, sentiment
- **Simple Architecture**:
  - Firebase Firestore for data storage (no PostgreSQL)
  - Direct contract calls (no Redis/queues)
  - Gemini AI via GenLayer (no direct API calls)
  - Production-ready logging and security
- **Modern Tech Stack**: React, TypeScript, Express, Firebase, GenLayer, TailwindCSS, shadcn/ui

## 🏗️ Architecture

```
┌─────────────────┐
│   React Client  │
│   (Vite + TS)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Express Server │────▶│   Firebase       │
│  (TypeScript)   │     │   Firestore      │
└────────┬────────┘     └──────────────────┘
         │
         │ Contract Call
         ▼
┌─────────────────────────────────┐
│  GenLayer Intelligent Contract  │
│  (Python)                       │
│                                 │
│  1. gl.get_webpage(url)        │
│  2. gl.exec_llm(prompt)        │  ──▶ Gemini AI
│  3. Consensus via validators    │
│  4. Return results              │
└─────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+**
2. **Firebase Account** (free tier)
3. **GenLayer Account** (to deploy intelligent contract)

**→ Full setup guide**: [SETUP.md](./SETUP.md)

### 1. Install

```bash
git clone <repository-url>
cd Authenticity-Gate
npm install
```

### 2. Set Up Firebase

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Generate service account key (Project Settings → Service Accounts)
3. Save the JSON file

### 3. Deploy GenLayer Contract

```bash
# Install GenLayer CLI
npm install -g @genlayer/cli

# Deploy the intelligent contract
genlayer contract deploy contracts/ContentVerification.py
```

Save the contract address!

### 4. Configure

Create `.env` file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
GENLAYER_CONTRACT_ADDRESS=0x...
GENLAYER_PRIVATE_KEY=your_private_key
```

### 5. Run

```bash
npm run dev
```

Visit `http://localhost:5000`

## 📦 Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Environment Variables

Ensure all production environment variables are set:

- `NODE_ENV=production`
- Valid `DATABASE_URL`
- `GEMINI_API_KEY`
- `REDIS_URL` (highly recommended for production)
- Strong `SESSION_SECRET` (min 32 characters)
- Proper `CORS_ORIGIN`

### 3. Start Production Server

```bash
npm start
```

### 4. Process Manager (Recommended)

Use PM2 for production process management:

```bash
npm install -g pm2
pm2 start npm --name "authenticity-gate" -- start
pm2 save
pm2 startup
```

## 🧪 GenLayer Integration

### Deploy Intelligent Contract

1. **Install GenLayer CLI**:
   ```bash
   npm install -g @genlayer/cli
   ```

2. **Initialize GenLayer Studio**:
   ```bash
   genlayer init
   ```

3. **Deploy the Contract**:
   ```bash
   genlayer contract deploy contracts/ContentVerification.py
   ```

4. **Update Environment**:
   ```env
   GENLAYER_CONTRACT_ADDRESS=<deployed_contract_address>
   GENLAYER_RPC_URL=https://rpc.genlayer.com
   GENLAYER_PRIVATE_KEY=<your_private_key>
   ```

5. **Restart the Server**

The application will automatically use the GenLayer contract when configured. Otherwise, it uses Gemini directly.

See [`contracts/README.md`](./contracts/README.md) for detailed contract documentation.

## 📊 API Endpoints

### Content Verification

- **POST** `/api/verifications` - Create new verification
  ```json
  {
    "url": "https://example.com/article"
  }
  ```

- **GET** `/api/verifications` - List all verifications

- **GET** `/api/verifications/:id` - Get specific verification

### Monitoring

- **GET** `/health` - Health check endpoint
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-01-07T...",
    "uptime": 12345.67
  }
  ```

- **GET** `/api/queue/stats` - Queue statistics
  ```json
  {
    "waiting": 5,
    "active": 2,
    "completed": 142,
    "failed": 3
  }
  ```

## 🔒 Security Features

- **Helmet.js**: Security headers (CSP, XSS protection, etc.)
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse (configurable per environment)
- **Input Validation**: Zod schema validation on all inputs
- **Error Sanitization**: Hides stack traces in production
- **Session Security**: Secure session handling

## 📝 Logging

Structured JSON logging with Pino:

- **Development**: Pretty-printed colored logs
- **Production**: JSON logs for log aggregation (e.g., ELK, Datadog)

Log levels: `error`, `warn`, `info`, `debug`

## 🗄️ Database Schema

### `verifications` Table

| Column               | Type      | Description                                    |
|---------------------|-----------|------------------------------------------------|
| id                  | SERIAL    | Primary key                                    |
| url                 | TEXT      | Content URL to verify                          |
| status              | TEXT      | pending, processing, completed, failed         |
| originality_score   | INTEGER   | 0-100 (100 = highly original)                  |
| plagiarism_risk     | INTEGER   | 0-100 (100 = high risk)                        |
| deepfake_confidence | INTEGER   | 0-100 (100 = likely fake)                      |
| sentiment           | TEXT      | Positive, Neutral, Negative                    |
| raw_result          | JSONB     | Full AI analysis result                        |
| created_at          | TIMESTAMP | Creation timestamp                             |

## 🧰 Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

### Project Structure

```
.
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # React hooks
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utilities
│   └── public/           # Static assets
├── server/               # Express backend
│   ├── config/           # Configuration
│   ├── services/         # Business logic
│   │   ├── genlayer.ts   # GenLayer/Gemini integration
│   │   ├── logger.ts     # Logging service
│   │   └── queue.ts      # Queue system
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   └── index.ts          # Server entry point
├── shared/               # Shared types/schemas
├── contracts/            # GenLayer intelligent contracts
├── migrations/           # Database migrations
└── README.md             # This file
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Check if database exists
psql -l | grep authenticity_gate
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping

# Start Redis if not running (macOS)
brew services start redis

# Start Redis (Linux)
sudo systemctl start redis
```

### Gemini API Issues

- Verify your API key is correct
- Check quota limits in Google Cloud Console
- Ensure billing is enabled for Gemini API

### Queue Not Processing

- Verify Redis is running and accessible
- Check queue stats: `curl http://localhost:5000/api/queue/stats`
- Review logs for worker errors

## 📈 Monitoring

### Health Checks

```bash
# Basic health check
curl http://localhost:5000/health

# Queue statistics
curl http://localhost:5000/api/queue/stats
```

### Logs

Development:
```bash
# Logs are printed to console with colors
```

Production:
```bash
# JSON logs to stdout (pipe to log aggregator)
npm start | pino-pretty  # For pretty printing
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [GenLayer](https://genlayer.com/) - Intelligent Contracts platform
- [Google Gemini](https://ai.google.dev/) - AI/ML capabilities
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Documentation: See `/contracts/README.md` for contract details
- GenLayer Docs: https://docs.genlayer.com/

---

Built with ❤️ using GenLayer, Gemini AI, and modern web technologies
