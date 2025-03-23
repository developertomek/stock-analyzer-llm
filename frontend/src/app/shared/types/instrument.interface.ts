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
