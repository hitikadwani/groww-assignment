# FinBoard - Finance Dashboard

A customizable finance dashboard where users can build their own real-time finance monitoring dashboard by connecting to various financial APIs and displaying real-time data through customizable widgets.

## Features

### 1. Widget Management System
- **Add Widgets**: Create new finance data widgets by connecting to any financial API
  - **Table**: Paginated list or grid of stocks with filters and search functionality
  - **Finance Cards**: List or single card view for watchlist, market gainers, performance data, financial data
  - **Charts**: Line graphs showing stock prices over different intervals
- **Remove Widgets**: Easy deletion of unwanted widgets
- **Rearrange Layout**: Drag-and-drop functionality to reorganize widget positions
- **Widget Configuration**: Each widget includes a configuration panel for customization

### 2. API Integration & Data Handling
- **Dynamic Data Mapping**: Explore API responses and select specific fields to display
- **Real-time Updates**: Automatic data refresh with configurable intervals
- **Data Caching**: Intelligent caching system to optimize API calls and reduce redundant requests

### 3. User Interface & Experience
- **Customizable Widgets**: Each widget displays as a finance card with editable titles and selected metrics
- **Responsive Design**: Fully responsive layout supporting multiple screen sizes
- **Loading & Error States**: Comprehensive handling of loading, error, and empty data states

### 4. Data Persistence
- **Browser Storage Integration**: All widget configurations and dashboard layouts persist across sessions
- **State Recovery**: Complete dashboard restoration upon page refresh or browser restart
- **Configuration Backup**: Export/import functionality for dashboard configurations (coming soon)

### 5. Advanced Widget Features
- **Field Selection Interface**: Interactive JSON explorer for choosing display fields
- **Custom Formatting**: Support for different data formats (currency, percentage, etc.)
- **Widget Naming**: User-defined widget titles and descriptions
- **API Endpoint Management**: Easy switching between different API endpoints per widget

### Bonus Features
- **Dark Mode**: Toggle between light and dark themes seamlessly

## Technologies

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Data Visualization**: Recharts
- **Drag and Drop**: react-beautiful-dnd
- **TypeScript**: For type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Adding a Widget

1. Click the "Add Widget" button
2. Enter a widget name (e.g., "Bitcoin Price Tracker")
3. Enter an API URL (e.g., `https://api.coinbase.com/v2/exchange-rates?currency=BTC`)
4. Select widget type (Finance Card, Table, or Chart)
5. Set refresh interval in seconds
6. Click "Next: Select Fields"
7. Select the fields you want to display from the API response
8. Click "Add Widget"

### Configuring a Widget

1. Click the gear icon (⚙️) on any widget
2. Modify widget name, API URL, refresh interval, or selected fields
3. Click "Save Changes"

### Rearranging Widgets

1. Click and hold the drag handle (⋮⋮) on any widget
2. Drag to the desired position
3. Release to drop

### Removing a Widget

1. Click the × button on any widget
2. Confirm deletion

## API Integration

The dashboard includes **built-in support** for popular financial APIs with pre-configured templates:

### Supported APIs

- **Alpha Vantage** ⭐ (Recommended)
  - Stock market data, time series, technical indicators
  - Free tier: 5 calls/minute, 500 calls/day
  - [Get API Key](https://www.alphavantage.co/support/#api-key)

- **Finnhub**
  - Real-time quotes, company profiles, market news
  - Free tier: 60 calls/minute
  - [Get API Key](https://finnhub.io/register)

- **IndianAPI**
  - Indian stock market data (NSE/BSE)
  - [Get API Key](https://indianapi.in)

### Using API Templates

1. Click **"Add Widget"**
2. Select **"📋 Use Template"** tab
3. Choose an API provider
4. Add your API key (saved automatically)
5. Click on any example to use it
6. Configure widget name and settings

### Manual API Entry

You can also use any REST API that returns JSON data:
- Must return JSON data
- Should support CORS (or use a proxy)
- Rate limits should be considered (the app includes caching to help)

See [API_SETUP.md](./API_SETUP.md) for detailed setup instructions.

## Quick Start with Financial APIs

### Example: Alpha Vantage Stock Quote

1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Click "Add Widget" → "Use Template"
3. Select "Alpha Vantage"
4. Click "Add Key" and enter your API key
5. Click "Global Quote (Stock Price)"
6. Enter widget name (e.g., "IBM Stock Price")
7. Select fields and add widget

Your API key is automatically saved for future use!

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── Dashboard.tsx        # Main dashboard component
│   ├── Widget.tsx           # Widget wrapper component
│   ├── AddWidgetModal.tsx   # Modal for adding widgets
│   ├── WidgetConfigPanel.tsx # Widget configuration panel
│   ├── FieldSelector.tsx    # Field selection interface
│   ├── Providers.tsx        # Redux provider wrapper
│   └── widgets/
│       ├── TableWidget.tsx      # Table widget component
│       ├── FinanceCardWidget.tsx # Finance card widget
│       └── ChartWidget.tsx      # Chart widget component
├── store/
│   ├── store.ts             # Redux store configuration
│   ├── dashboardSlice.ts    # Dashboard state slice
│   └── hooks.ts             # Typed Redux hooks
├── types/
│   └── index.ts             # TypeScript type definitions
└── utils/
    ├── api.ts               # API fetching utilities
    └── fieldExplorer.ts     # JSON field exploration utilities
```

## License

This project is created for assignment purposes.

