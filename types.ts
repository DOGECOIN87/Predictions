export enum RoundStatus {
  EXPIRED = 'EXPIRED',
  LIVE = 'LIVE',
  OPEN = 'OPEN',
  NEXT = 'NEXT'
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN'
}

export interface Round {
  id: number;
  status: RoundStatus;
  startTime: number;
  lockTime: number; // When betting closes
  closeTime: number; // When round ends
  lockPrice: number | null;
  closePrice: number | null;
  totalPool: number;
  upPool: number;
  downPool: number;
  winner?: Direction;
}

export interface PricePoint {
  time: number;
  price: number;
}

export interface UserBet {
  roundId: number;
  direction: Direction;
  amount: number;
  claimed: boolean;
}