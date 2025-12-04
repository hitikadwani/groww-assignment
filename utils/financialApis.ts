/**
 * Financial API Configurations
 * 
 * This file contains configuration and helper functions for the IndianAPI
 * financial data provider.
 */

export interface ApiConfig {
  name: string
  provider: 'indianapi'
  baseUrl: string
  requiresApiKey: boolean
  apiKeyPlaceholder: string
  rateLimit?: string
  documentation: string
  examples: ApiExample[]
}

export interface ApiExample {
  name: string
  description: string
  url: string
  widgetType: 'finance-card' | 'table' | 'chart'
  fields?: string[]
}

// IndianAPI Configuration (for Indian stock market)
export const INDIAN_API_CONFIG: ApiConfig = {
  name: 'IndianAPI',
  provider: 'indianapi',
  baseUrl: 'https://api.indianapi.in',
  requiresApiKey: true,
  apiKeyPlaceholder: 'YOUR_INDIAN_API_KEY',
  rateLimit: 'Varies by plan',
  documentation: 'https://indianapi.in/docs',
  examples: [
    {
      name: 'Stock Quote (NSE) - RELIANCE',
      description: 'Get NSE stock quote for Reliance Industries',
      url: 'https://api.indianapi.in/v1/stock/quote?symbol=RELIANCE&exchange=NSE&apikey=YOUR_INDIAN_API_KEY',
      widgetType: 'finance-card',
    },
    {
      name: 'Stock Quote (NSE) - TCS',
      description: 'Get NSE stock quote for Tata Consultancy Services',
      url: 'https://api.indianapi.in/v1/stock/quote?symbol=TCS&exchange=NSE&apikey=YOUR_INDIAN_API_KEY',
      widgetType: 'finance-card',
    },
    {
      name: 'Stock Quote (BSE)',
      description: 'Get BSE stock quote for Reliance',
      url: 'https://api.indianapi.in/v1/stock/quote?symbol=RELIANCE&exchange=BSE&apikey=YOUR_INDIAN_API_KEY',
      widgetType: 'finance-card',
    },
    {
      name: 'Market Gainers',
      description: 'Top gaining stocks in Indian market',
      url: 'https://api.indianapi.in/v1/market/gainers?apikey=YOUR_INDIAN_API_KEY',
      widgetType: 'table',
    },
    {
      name: 'Market Losers',
      description: 'Top losing stocks in Indian market',
      url: 'https://api.indianapi.in/v1/market/losers?apikey=YOUR_INDIAN_API_KEY',
      widgetType: 'table',
    },
  ],
}

export const ALL_API_CONFIGS: ApiConfig[] = [INDIAN_API_CONFIG]

/**
 * Replace API key placeholder in URL with actual API key
 */
export const replaceApiKey = (url: string, apiKey: string, provider: string): string => {
  if (provider === 'indianapi') {
    return url.replace('YOUR_INDIAN_API_KEY', apiKey)
  }
  return url
}

/**
 * Get API key from localStorage or environment
 */
export const getApiKey = (provider: string): string | null => {
  if (typeof window === 'undefined') return null
  const key = localStorage.getItem(`api_key_${provider}`)
  return key || null
}

/**
 * Save API key to localStorage
 */
export const saveApiKey = (provider: string, apiKey: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(`api_key_${provider}`, apiKey)
}

/**
 * Get API key setup instructions
 */
export const getApiKeyInstructions = (provider: string): string => {
  const instructions: Record<string, string> = {
    indianapi: `
1. Visit https://indianapi.in
2. Click "Sign Up" or "Register" to create an account
3. Verify your email if required
4. Log in to your dashboard
5. Navigate to API Keys section
6. Generate a new API key
7. Copy and save your API key securely
8. Check your plan limits in the dashboard
    `,
  }
  return instructions[provider] || 'Please check the API provider documentation for API key setup.'
}

