export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
}

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getTopCoins(limit = 20): Promise<Coin[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
    );
    if (!response.ok) throw new Error('Failed to fetch coins');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return [];
  }
}

export async function searchCoins(query: string): Promise<Coin[]> {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${query}`);
    if (!response.ok) throw new Error('Failed to search coins');
    const data = await response.json();
    // The search endpoint returns a different structure, we might need to fetch details or map it
    // For simplicity in this demo, we'll just return the basic info and maybe fetch details if needed
    // But to keep it simple, let's just map what we can or use a different strategy.
    // Actually, the search endpoint returns `coins` array with `id`, `name`, `symbol`, `large` (image).
    // It doesn't return price.
    return data.coins.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.large,
      current_price: 0, // Placeholder as search doesn't return price
      market_cap: 0,
      market_cap_rank: coin.market_cap_rank,
      price_change_percentage_24h: 0,
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
}

export async function getCoinsByIds(ids: string[]): Promise<Coin[]> {
  if (ids.length === 0) return [];
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}&order=market_cap_desc&sparkline=false`
    );
    if (!response.ok) throw new Error('Failed to fetch coins by ids');
    return await response.json();
  } catch (error) {
    console.error('Error fetching coins by ids:', error);
    return [];
  }
}
