import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Model } from '../../shared/types/model.interface';
import { ModelService } from '../../core/services/model/model.service';
import { MarketDataService } from '../../core/services/market-data/market-data.service';
import { Instrument } from '../../shared/types/instrument.interface';
import { PopularInstrumentsComponent } from './components/popular-intruments/popular-intruments.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, PopularInstrumentsComponent],
  template: `
    <h1 class="text-4xl mt-16 font-bold text-center">Stock Analyzer</h1>
    <div class="max-w-xl mx-auto px-4 py-8">
      <div class="mb-6">
        @if (error().model) {
        <div class="mt-2 text-sm text-red-600">
          {{ error().model }}
        </div>
        } @else if (isLoading().model) {
        <div class="animate-pulse space-y-4">
          <div class="h-10 bg-gray-200 rounded w-full opacity-50"></div>
        </div>
        } @else if (models().length > 0) {
        <select
          [(ngModel)]="selectedModel"
          id="model-select"
          class="mt-1 text-black bg-white block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500s focus:border-indigo-500s sm:text-sm rounded-md shadow-sm appearance-auto"
        >
          <option value="" disabled>Select a model</option>

          @for (model of models(); track model) {
          <option [value]="model.model">
            {{ model.model }} ({{
              (model.size / 1024 / 1024 / 1024).toFixed(1)
            }}
            GB)
          </option>
          }
        </select>
        } @else if (models().length === 0) {
        <div class="mt-2 text-sm text-amber-600">
          No models available. Please make sure Ollama is running with at least
          one model.
        </div>
        }
      </div>
      <div class="mb-6">
        <h2 class="text-sm font-bold mt-8 mb-4">Popular Instruments</h2>

        @if (error().instrument) {
        <div class="mt-2 text-sm text-red-600">
          {{ error().instrument }}
        </div>
        } @else if (isLoading().instrument) {
        <div class="animate-pulse space-y-4">
          <div class="h-20 bg-gray-200 rounded w-full opacity-50"></div>
        </div>
        } @else {
        <app-popular-instruments
          [instruments]="popularInstruments()"
          (onAnalyze)="onAnalyze($event)"
          [isModelSelected]="!!selectedModel"
        />
        }
      </div>
    </div>
  `,
})
export class HomeComponent {
  private modelService = inject(ModelService);
  private marketDataService = inject(MarketDataService);

  selectedModel = '';
  isLoading: WritableSignal<{ model: boolean; instrument: boolean }> = signal({
    model: true,
    instrument: true,
  });
  error: WritableSignal<{ model: string; instrument: string }> = signal({
    model: '',
    instrument: '',
  });
  models: WritableSignal<Model[]> = signal([]);
  popularInstruments: WritableSignal<Instrument[]> = signal([]);

  ngOnInit() {
    this.getModels();
    this.getMarketData();
  }

  getModels() {
    this.modelService.getAll().subscribe({
      next: (data) => {
        this.models.set(data.models);
        this.error.update((val) => ({ ...val, model: '' }));
        this.isLoading.update((val) => ({ ...val, model: false }));
      },
      error: (error) => {
        this.error.update((val) => ({ ...val, model: error.message }));
        this.isLoading.update((val) => ({ ...val, model: false }));
      },
    });
  }

  getMarketData() {
    this.marketDataService.getPopularInstruments().subscribe({
      next: (data) => {
        this.popularInstruments.set(data.popular_instruments);
        this.error.update((val) => ({ ...val, instrument: '' }));
        this.isLoading.update((val) => ({ ...val, instrument: false }));
      },
      error: (error) => {
        this.error.update((val) => ({ ...val, instrument: error.message }));
        this.isLoading.update((val) => ({ ...val, instrument: false }));
      },
    });
  }

  onAnalyze(symbol: string) {
    console.log(symbol);
  }
}
