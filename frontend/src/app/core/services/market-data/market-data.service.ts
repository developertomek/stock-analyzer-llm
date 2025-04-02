import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  AnalyzeResponse,
  PopularInstruments,
  PriceData,
} from '../../../shared/types/instrument.interface';

@Injectable({
  providedIn: 'root',
})
export class MarketDataService {
  private http = inject(HttpClient);

  getPopularInstruments() {
    return this.http.get<PopularInstruments>(
      `${environment.apiUrl}/instruments/popular`
    );
  }

  getInstrumentPriceData(symbol: string) {
    return this.http.get<PriceData>(
      `${environment.apiUrl}/instruments/${symbol}`
    );
  }

  analyzeStock(symbol: string, model: string) {
    return this.http.post<AnalyzeResponse>(
      `${environment.apiUrl}/instruments/analyze`,
      {
        symbol,
        model,
      }
    );
  }
}
