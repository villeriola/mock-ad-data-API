# Mock Ad Data API

A mock Google Ads reporting data API for demo integrations. This service generates realistic, deterministic advertising performance data without requiring authentication to real ad accounts.

## Features

- **Deterministic data generation**: Same request always returns identical data (seeded randomness)
- **Realistic metrics**: CTR, CPC, conversion rates based on industry benchmarks
- **Google Ads-like structure**: Accounts → Campaigns → Ad Groups → Keywords
- **Flexible querying**: Select date ranges, dimensions, and metrics
- **5 pre-configured demo accounts**: E-commerce, SaaS, Local Services, Travel, Finance

## Quick Start for local setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

The server runs on `http://localhost:3000` by default.

## Production example
If you want to call the API from external systems, like SM Connector Builder, you can use the version running on clod servers on `https://mock-ad-data-api-production.up.railway.app`

## API Endpoints

### Health Check
```
GET /api/v1/health
```

### Authentication

All `/gads` endpoints support mock authentication via the `x-api-key` header. This simulates the authentication flow of a real API integration.

- **With header**: Response includes `"authentication": { "authenticated": true, ... }`
- **Without header**: Data is still returned, but response includes `"authentication": { "authenticated": false, ... }`

```bash
# Authenticated request
curl -H "x-api-key: any-string-works" http://localhost:3000/api/v1/gads/accounts

# Unauthenticated request (data still returned)
curl http://localhost:3000/api/v1/gads/accounts
```

The key can be any non-empty string. This allows demo integrations to test their authentication flow without needing real credentials.

### Google Ads Endpoints

#### List Accounts
```
GET /api/v1/gads/accounts
```

Returns all available mock accounts.

#### Get Account Details
```
GET /api/v1/gads/accounts/:id
```

#### List Campaigns
```
GET /api/v1/gads/accounts/:id/campaigns
```

#### Generate Report
```
GET /api/v1/gads/:accountId/reports
```

The main endpoint for generating advertising performance data. The account ID is part of the URL path, and all other parameters are passed as query parameters.

#### Example Request

```bash
curl "http://localhost:3000/api/v1/gads/123-456-7890/reports?startDate=2024-01-01&endDate=2024-01-07&dimensions=date,campaign,device&metrics=impressions,clicks,cost,ctr,cpc"
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | Yes | Start date (YYYY-MM-DD) |
| `endDate` | string | Yes | End date (YYYY-MM-DD) |
| `dimensions` | string | No | Comma-separated dimensions (see below) |
| `metrics` | string | No | Comma-separated metrics (defaults to all) |
| `pageSize` | number | No | Results per page (default: 1000, max: 10000) |
| `pageToken` | string | No | Pagination token |
| `orderBy` | string | No | Metric name to sort by |
| `orderDirection` | string | No | `ASC` or `DESC` (default: `DESC`) |
| `campaignIds` | string | No | Comma-separated campaign IDs to filter |
| `adGroupIds` | string | No | Comma-separated ad group IDs to filter |
| `campaignStatus` | string | No | Filter by campaign status: `ENABLED`, `PAUSED`, `REMOVED` |
| `adGroupStatus` | string | No | Filter by ad group status: `ENABLED`, `PAUSED`, `REMOVED` |

#### Available Dimensions

- `date` - Daily breakdown
- `campaign` - Campaign-level data
- `adGroup` - Ad group-level data
- `keyword` - Keyword-level data
- `device` - MOBILE, DESKTOP, TABLET
- `network` - SEARCH, DISPLAY, YOUTUBE

#### Available Metrics

**Base metrics** (generated):
- `impressions` - Number of ad impressions
- `clicks` - Number of clicks
- `cost` - Total cost in USD
- `conversions` - Number of conversions
- `conversionValue` - Total conversion value

**Derived metrics** (calculated):
- `ctr` - Click-through rate (%)
- `cpc` - Cost per click
- `cpm` - Cost per thousand impressions
- `conversionRate` - Conversion rate (%)
- `costPerConversion` - Cost per conversion
- `roas` - Return on ad spend

#### Example Response

```json
{
  "authentication": {
    "authenticated": true,
    "message": "Authenticated successfully"
  },
  "metadata": {
    "accountId": "123-456-7890",
    "accountName": "Acme E-Commerce Store",
    "dateRange": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-07"
    },
    "dimensions": ["date", "campaign"],
    "metrics": ["impressions", "clicks", "cost"],
    "totalRows": 35,
    "generatedAt": "2024-02-04T12:00:00.000Z"
  },
  "rows": [
    {
      "dimensions": {
        "date": "2024-01-01",
        "campaign": {
          "id": "camp_001",
          "name": "Brand Awareness",
          "status": "ENABLED"
        }
      },
      "metrics": {
        "impressions": 15420,
        "clicks": 892,
        "cost": 1245.67
      }
    }
  ],
  "nextPageToken": null
}
```

## Demo Accounts

| Account ID | Name | Industry |
|------------|------|----------|
| `123-456-7890` | Acme E-Commerce Store | E-commerce |
| `234-567-8901` | CloudFlow SaaS Platform | SaaS |
| `345-678-9012` | Metro Plumbing Services | Local Services |
| `456-789-0123` | Wanderlust Travel Agency | Travel |
| `567-890-1234` | Apex Financial Advisors | Finance |

## Deterministic Data

The API uses seeded random number generation to ensure consistency:

- Same request parameters always return identical data
- Data aggregations are consistent (daily totals sum to weekly)
- Account structures (campaigns, ad groups, keywords) are stable

The seed is derived from: `accountId + campaignId + adGroupId + date + device + network`

## Development

```bash
# Type checking
npm run typecheck

# Run tests
npm test

# Development with hot reload
npm run dev
```

## Configuration

Environment variables (optional):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |

## License

MIT
