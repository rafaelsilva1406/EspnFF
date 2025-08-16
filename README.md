# ESPN Fantasy Football Web App

A modern Next.js TypeScript application for ESPN Fantasy Football league management and analytics. This project is a complete rewrite of the original Python ESPN API, providing a web-based interface for fantasy sports data.

## Features

- 🏈 Multi-sport support (NFL, NBA, NHL, MLB, WNBA)
- 📊 Real-time league standings and team analytics
- 👥 Player management and roster tracking
- 📈 Matchup analysis and scoring
- 🔒 Private league support with ESPN authentication
- 📱 Responsive design with Tailwind CSS
- 🐳 Docker containerization
- ☁️ Azure App Service deployment
- 🚀 CI/CD with GitHub Actions

## Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Docker (for containerization)
- Azure CLI (for deployment)
- Terraform (for infrastructure)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd EspnFF
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your ESPN credentials
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### ESPN Authentication

For private leagues, you need to obtain your ESPN session cookies:

1. Log into ESPN Fantasy in your browser
2. Open Developer Tools (F12)
3. Go to Application/Storage tab > Cookies
4. Copy the values for `espn_s2` and `SWID` from espn.com
5. Add these to your `.env.local` file

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ESPN_S2` | ESPN session cookie | For private leagues |
| `SWID` | ESPN user ID cookie | For private leagues |
| `DEFAULT_LEAGUE_ID` | Default league to load | No |
| `DEFAULT_YEAR` | Default season year | No |

## API Endpoints

- `GET /api/league` - Fetch league data
- `GET /api/matchups` - Get weekly matchups
- `GET /api/teams` - Team information
- `GET /api/players` - Player data and stats

## Docker Deployment

### Build Docker Image

```bash
docker build -t espn-ff .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e ESPN_S2=your_espn_s2 \
  -e SWID=your_swid \
  espn-ff
```

## Azure Deployment

### Prerequisites

1. Azure subscription
2. Azure CLI installed and logged in
3. Terraform installed

### Deploy Infrastructure

```bash
cd terraform
terraform init
terraform plan -var="espn_s2=your_espn_s2" -var="swid=your_swid"
terraform apply
```

### GitHub Actions Deployment

Set up the following secrets in your GitHub repository:

- `AZURE_CREDENTIALS` - Azure service principal credentials
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `ESPN_S2` - ESPN session cookie
- `SWID` - ESPN user ID

The workflow will automatically deploy to Azure on pushes to the main branch.

## Development

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── league/         # League pages
│   └── layout.tsx      # Root layout
├── components/         # React components
│   └── ui/            # Reusable UI components
├── lib/               # Utility libraries
│   ├── espn-client.ts # ESPN API client
│   ├── espn-leagues.ts # League management
│   └── constants.ts   # App constants
└── types/             # TypeScript type definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original Python ESPN API by [cwendt94/espn-api](https://github.com/cwendt94/espn-api)
- ESPN Fantasy API documentation and community