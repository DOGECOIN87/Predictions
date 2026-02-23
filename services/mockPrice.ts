import { PricePoint } from '../types';
import { INITIAL_PRICE } from '../constants';

let currentPrice = INITIAL_PRICE;
let history: PricePoint[] = [];

// Generate initial history
const now = Date.now();
for (let i = 60; i > 0; i--) {
  currentPrice = currentPrice + (Math.random() - 0.5) * 50;
  history.push({
    time: now - i * 1000,
    price: currentPrice
  });
}

export const getLatestPrice = (): number => {
  // Random walk
  const volatility = 25; // Price moves up to $25 per tick
  const change = (Math.random() - 0.5) * volatility;
  currentPrice += change;
  return currentPrice;
};

export const getPriceHistory = (): PricePoint[] => {
  return [...history];
};

export const addPricePoint = (price: number): PricePoint => {
  const point = { time: Date.now(), price };
  history.push(point);
  if (history.length > 300) history.shift(); // Keep last 5 mins
  return point;
};