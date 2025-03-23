export interface Instrument {
  name: string;
  description: string;
  symbol: string;
  type: string;
  current_price: number;
  change: number;
  change_percent: number;
  volume: number;
  region: string;
}

export interface PopularInstruments {
  popular_instruments: Instrument[];
}

const priceDataKeys = ['open', 'close', 'high', 'low', 'volume'] as const;

export type PriceData = Record<(typeof priceDataKeys)[number], number[]>;
