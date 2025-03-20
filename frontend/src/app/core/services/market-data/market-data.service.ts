import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
    private http = inject(HttpClient);

    getPopularInstruments() {
        return this.http.get(`${environment.apiUrl}/instruments/popular`);
    }

    getInstrumentData(symbol: string) {
        return this.http.get(`${environment.apiUrl}/instruments/${symbol}`);
    }
}
