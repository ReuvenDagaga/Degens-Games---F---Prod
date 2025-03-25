import axios from 'axios';

const BITCOIN_API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';

export const getBitcoinPrice = async () => {
  try {
    const response = await axios.get(BITCOIN_API_URL);
    const price = parseFloat(response.data.price);
    return price;
  } catch (error) {
    throw new Error('Failed to fetch Bitcoin price');
  }
};