import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ModelResponse } from '../../../shared/types/model.interface';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<ModelResponse>(`${environment.apiUrl}/models`);
  }
}
