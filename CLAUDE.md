# CLAUDE.md - ESPN Fantasy Football Web App

## Project Overview

This is a modern Next.js TypeScript application that serves as a complete rewrite of the Python ESPN API project. It provides a web-based interface for ESPN Fantasy Football league management and analytics.

## Development Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Docker
docker build -t espn-ff .                    # Build Docker image
docker run -p 3000:3000 espn-ff             # Run container

# Terraform (Azure deployment)
cd terraform
terraform init                               # Initialize Terraform
terraform plan                               # Plan infrastructure changes
terraform apply                              # Apply infrastructure changes
terraform destroy                            # Destroy infrastructure
```

## Architecture

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **React 18** - Latest React features

### API Layer
- **Next.js API Routes** - Serverless API endpoints
- **ESPN Client** - TypeScript client for ESPN Fantasy API
- **Type-safe** - Full TypeScript coverage

### Infrastructure
- **Docker** - Containerization for consistent deployments
- **Azure App Service** - Managed hosting platform
- **Terraform** - Infrastructure as Code
- **GitHub Actions** - CI/CD pipeline

## Environment Configuration

### Required for Private Leagues
- `ESPN_S2` - ESPN session cookie (get from browser dev tools)
- `SWID` - ESPN user ID cookie (get from browser dev tools)

### Optional
- `DEFAULT_LEAGUE_ID` - Auto-load specific league
- `DEFAULT_YEAR` - Default season year

### Azure Deployment
- `AZURE_SUBSCRIPTION_ID` - Azure subscription
- `AZURE_RESOURCE_GROUP` - Resource group name
- `AZURE_APP_SERVICE_NAME` - App service name

## Key Files

### Core Logic
- `src/lib/espn-client.ts` - Main ESPN API client
- `src/lib/espn-leagues.ts` - League management classes
- `src/lib/constants.ts` - ESPN API constants and mappings
- `src/types/espn.ts` - TypeScript type definitions

### API Routes
- `src/app/api/league/route.ts` - League data endpoint
- `src/app/api/matchups/route.ts` - Matchups endpoint

### Components
- `src/components/TeamCard.tsx` - Team display component
- `src/components/ui/LoadingSpinner.tsx` - Loading indicator

### Infrastructure
- `terraform/main.tf` - Azure infrastructure definition
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `Dockerfile` - Container definition

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev  # Start dev server
   ```

2. **Type Checking**
   ```bash
   npm run type-check  # Verify TypeScript
   ```

3. **Linting**
   ```bash
   npm run lint  # Check code style
   ```

4. **Building**
   ```bash
   npm run build  # Production build
   ```

## Deployment

### Local Docker
```bash
docker build -t espn-ff .
docker run -p 3000:3000 -e ESPN_S2=xxx -e SWID=xxx espn-ff
```

### Azure via Terraform
```bash
cd terraform
terraform init
terraform apply -var="espn_s2=xxx" -var="swid=xxx"
```

### GitHub Actions
Push to main branch triggers automatic deployment to Azure.

## API Compatibility

This TypeScript implementation maintains compatibility with the original Python ESPN API while providing modern web interfaces:

- **Sports Support**: NFL, NBA, NHL, MLB, WNBA
- **Authentication**: ESPN S2/SWID cookies for private leagues
- **Data Access**: Teams, players, matchups, standings, draft info
- **Error Handling**: Proper error types and fallback endpoints

## Testing Results

### Development Server Testing ✅

**Test Date**: August 16, 2025

**Issues Found and Fixed**:

1. **Missing Dependencies**: 
   - **Issue**: `autoprefixer` was missing from devDependencies
   - **Fix**: Added `"autoprefixer": "^10.4.14"` to package.json
   - **Result**: Build and dev server now work correctly

2. **Turbopack Configuration Warning**:
   - **Issue**: `experimental.turbo` is deprecated in Next.js 15.4.6
   - **Fix**: Removed deprecated turbo configuration from next.config.js
   - **Result**: No more warnings during startup

3. **ESLint Warnings**:
   - **Issue**: React Hook useEffect missing dependency warning
   - **Fix**: Used `useCallback` to memoize `fetchLeague` function
   - **Issue**: Next.js Image optimization warning for external images
   - **Fix**: Replaced `<img>` with `<Image>` component and configured remote patterns
   - **Result**: All ESLint warnings resolved

4. **TypeScript Configuration**:
   - **Issue**: Next.js automatically updated tsconfig.json target to ES2017
   - **Fix**: Configuration was automatically optimized by Next.js
   - **Result**: TypeScript compilation successful

**Final Test Results**:
- ✅ `npm run dev`: Server starts successfully on http://localhost:3001
- ✅ `npm run build`: Production build completes without errors
- ✅ `npm run lint`: No ESLint warnings or errors
- ✅ `npm run type-check`: TypeScript compilation successful

**Build Output**:
- Static pages: 7 pages generated
- Bundle size: ~100kB first load JS
- API routes: 2 dynamic routes configured
- All pages optimized and ready for production

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check ESPN_S2 and SWID cookies
2. **404 Not Found**: Verify league ID and year
3. **Build Errors**: Run `npm run type-check` and `npm run lint`
4. **Port Already in Use**: Dev server will automatically use next available port
5. **Missing autoprefixer**: Run `npm install` to ensure all dependencies are installed

### Getting ESPN Cookies

1. Log into ESPN Fantasy
2. Press F12 to open Developer Tools
3. Go to Application → Cookies → espn.com
4. Copy `espn_s2` and `SWID` values

## Performance

- **Server-side Rendering** for SEO and performance
- **API Route Caching** for reduced ESPN API calls
- **Optimized Bundle** with Next.js automatic optimizations
- **Docker Multi-stage** builds for smaller images