# Setup Instructions

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## First Steps

### Adding Your First Widget

#### Method 1: Using API Templates (Recommended)

1. Click the **"Add Widget"** button
2. Select **"📋 Use Template"** tab
3. Choose an API provider:
   - **Alpha Vantage**: Stock market data (free tier available)
   - **Finnhub**: Real-time quotes and market data (free tier available)
   - **IndianAPI**: Indian stock market data
4. Click **"Add Key"** and enter your API key (get free keys from provider websites)
5. Click on any example template (e.g., "Global Quote", "Stock Quote")
6. Switch to **"✏️ Manual Entry"** tab
7. Enter widget name and configure settings
8. Click **"Next: Select Fields"** to choose which fields to display
9. Select fields and click **"Add Widget"**

#### Method 2: Manual Entry

1. Click the **"Add Widget"** button
2. Select **"✏️ Manual Entry"** tab
3. Enter widget name (e.g., "Bitcoin Price")
4. Enter an API URL. Examples:

   **Coinbase API (No API key required):**
   ```
   https://api.coinbase.com/v2/exchange-rates?currency=BTC
   ```

   **Alpha Vantage (Requires free API key):**
   ```
   https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=YOUR_API_KEY
   ```

   **Finnhub (Requires free API key):**
   ```
   https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_API_KEY
   ```

5. Select widget type:
   - **Finance Card**: For displaying key metrics
   - **Table**: For tabular data (requires array response)
   - **Chart**: For time series data visualization

6. Set refresh interval (in seconds)

7. Click **"Next: Select Fields"** to choose which fields to display

8. Select fields from the API response and click **"Add Widget"**

### Getting API Keys

- **Alpha Vantage**: [Get free API key](https://www.alphavantage.co/support/#api-key)
- **Finnhub**: [Sign up for free](https://finnhub.io/register)
- **IndianAPI**: [Sign up](https://indianapi.in)

See [API_SETUP.md](./API_SETUP.md) for detailed instructions.

## Features

- ✅ **Pre-configured API Templates** - Quick setup with Alpha Vantage, Finnhub, and IndianAPI
- ✅ **API Key Management** - Save and reuse API keys automatically
- ✅ Add/Remove widgets
- ✅ Drag and drop to rearrange widgets
- ✅ Configure widget settings
- ✅ Real-time data updates
- ✅ Dark mode toggle
- ✅ Export/Import dashboard configurations
- ✅ Responsive design

## Troubleshooting

### API CORS Issues

If you encounter CORS errors, you may need to:
1. Use a CORS proxy service
2. Set up a Next.js API route as a proxy
3. Use APIs that support CORS

### react-beautiful-dnd Warning

If you see a warning about `react-beautiful-dnd`, this is expected and doesn't affect functionality. The library works correctly despite the warning.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The app can be deployed to:
- **Vercel**: `vercel deploy`
- **Netlify**: Connect your Git repository
- **AWS**: Use AWS Amplify or other hosting services

