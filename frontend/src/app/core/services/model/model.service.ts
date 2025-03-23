import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Model } from '../../../shared/types/model.interface';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<{ models: Model[] }>(`${environment.apiUrl}/models`);
  }
}
