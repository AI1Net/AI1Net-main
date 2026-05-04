# AI1Net

AI1Net is a unified AI hub and dashboard-based platform where users can access multiple AI models, manage their usage, and interact with a token-based ecosystem powered by $AI1NET tokens. Built with a neo-brutalist design aesthetic, it combines retro, Web3, and hacker vibes for a unique user experience.

## Features

- **AI Tool Access**: Explore and use various AI tools across categories like text, image, video, code, voice, and multimodal.
- **Usage Tracking**: Monitor your AI interactions, including input/output and token consumption.
- **Token System ($AI1NET)**: Earn, spend, stake, and manage AIN credits for AI usage and platform participation.
- **Rewards Program**: Earn rewards through usage, referrals, contributions, and bonuses.
- **Staking**: Stake tokens to participate in governance and earn additional rewards.
- **Governance**: Vote on proposals to shape the platform's future.
- **Wallet Integration**: Connect ERC20-compatible wallets for seamless token management.
- **Authentication**: Secure login via email/password or wallet connect.
- **Dashboard**: Comprehensive overview of usage, balance, and rewards.
- **Responsive Design**: Neo-brutalist UI with thick borders, hard shadows, and high contrast.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, ShadCN UI (neo-brutalism themed), Radix UI components
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **State Management**: TanStack Query (React Query)
- **Wallet**: Viem for Ethereum interactions
- **Build Tools**: pnpm, esbuild
- **Deployment**: Vercel (frontend), custom server (backend)

## Architecture

The application is structured as a monorepo using pnpm workspaces:

- `artifacts/ai1net/`: Frontend React application
- `artifacts/api-server/`: Backend Express.js API server
- `lib/`: Shared libraries including database schema, API client, and utilities
- `scripts/`: Utility scripts

### Database Schema

- **Users**: User accounts and profiles
- **AI Providers**: External AI service providers
- **AI Tools**: Available AI tools with pricing
- **AI Usage**: Logs of AI tool interactions
- **Tokens**: Transaction history for AIN credits
- **Rewards**: Reward earnings and types
- **Stakes**: Token staking records
- **Governance**: Proposals and voting system
- **Activity Logs**: General platform activity

## Installation

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- Clerk account for authentication
- Ethereum wallet for testing (optional)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai1net-main
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if exists) or create environment files
   - Configure database connection, Clerk keys, and other secrets

4. Set up the database:
   - Ensure PostgreSQL is running
   - Run migrations: `pnpm run db:migrate` (check scripts in package.json)

5. Build shared libraries:
   ```bash
   pnpm run typecheck:libs
   ```

## Running the App

### Development

1. Start the API server:
   ```bash
   cd artifacts/api-server
   pnpm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd artifacts/ai1net
   pnpm run dev
   ```

3. Open your browser to `http://localhost:5173` (or the port specified by Vite)

### Production Build

1. Build the application:
   ```bash
   pnpm run build
   ```

2. Start the API server:
   ```bash
   pnpm start
   ```

3. Serve the frontend (built files are in `artifacts/ai1net/dist/`)

## API Documentation

The backend provides RESTful APIs for all platform features:

- `GET /api/health`: Health check
- `GET /api/dashboard`: User dashboard data
- `GET /api/ai/tools`: List available AI tools
- `POST /api/ai/usage`: Log AI tool usage
- `GET /api/tokens`: Token balance and transactions
- `POST /api/rewards`: Claim rewards
- `GET /api/stakes`: Staking information
- `POST /api/stakes`: Create stake
- `GET /api/governance/proposals`: List proposals
- `POST /api/governance/votes`: Cast vote
- `GET /api/users`: User profile
- `GET /api/wallet`: Wallet connection status

For detailed API specs, see `lib/api-spec/openapi.yaml`.

## Systems

### AIN Credit System

AIN credits ($AI1NET) are the platform's native token used for:

- **Spending**: Pay for AI tool usage (price per use varies by tool)
- **Earning**: Gain credits through rewards, referrals, and contributions
- **Staking**: Lock tokens to participate in governance and earn staking rewards
- **Transactions**: All token movements are tracked with types: SPEND, EARN, STAKE, UNSTAKE, REWARD

Token balance is displayed in the topbar and managed through the Token page.

### Task System (AI Usage)

The task system tracks AI interactions:

- **Usage Logging**: Every AI tool interaction is recorded with input, output, tokens used, and status
- **Categories**: Tools are categorized by type (text, image, video, code, voice, multimodal)
- **Pricing**: Each tool has a price per use in AIN credits
- **Status Tracking**: Usage can be PENDING, SUCCESS, or FAILED

View usage history on the "My Usage" page.

### Rewards System

Earn AIN credits through various activities:

- **Usage Rewards**: Credits for active AI tool usage
- **Referral Rewards**: Earn when others join via your referral
- **Contribution Rewards**: For platform contributions (e.g., bug reports, content)
- **Bonus Rewards**: Special promotions and bonuses

Rewards are automatically credited and can be claimed on the Rewards page.

### Staking System

Stake AIN tokens to:

- **Participate in Governance**: Staked tokens provide voting weight
- **Earn Rewards**: Staking rewards based on stake duration and amount
- **Status**: Stakes can be ACTIVE, COMPLETED, or WITHDRAWN

Manage stakes on the Token page.

### Governance System

Shape the platform's future through proposals:

- **Proposals**: Community-submitted ideas with titles, descriptions, and end dates
- **Voting**: Vote YES, NO, or ABSTAIN on active proposals
- **Weighted Voting**: Voting power based on staked tokens
- **Status**: Proposals can be ACTIVE, PASSED, or REJECTED

Access governance features through the sidebar.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test thoroughly
4. Run type checking: `pnpm run typecheck`
5. Commit changes: `git commit -am 'Add your feature'`
6. Push to branch: `git push origin feature/your-feature`
7. Submit a pull request

## License

MIT License - see LICENSE file for details.