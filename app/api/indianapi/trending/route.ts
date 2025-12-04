import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  const apiKey = process.env.INDIANAPI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'INDIANAPI_API_KEY is not configured on the server' },
      { status: 500 }
    )
  }

  try {
    const url = 'https://stock.indianapi.in/trending'
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        Accept: 'application/json',
        'X-Api-Key': apiKey,
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching IndianAPI trending data:', error?.message || error)
    return NextResponse.json(
      { error: 'Failed to fetch data from IndianAPI trending endpoint' },
      { status: 502 }
    )
  }
}


