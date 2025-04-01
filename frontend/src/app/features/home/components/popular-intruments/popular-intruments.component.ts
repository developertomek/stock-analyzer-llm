import { Component, input, output } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Instrument } from '../../../../shared/types/instrument.interface';

@Component({
  selector: 'app-popular-instruments',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="bg-white rounded-lg shadow overflow-hidden w-full ">
      <ul class="divide-y divide-gray-200">
        @for (instrument of instruments(); track instrument.symbol) {
        <li class="p-4 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-center">
            <div class="w-1/3">
              <p class="text-sm font-medium text-gray-900">
                {{ instrument.symbol }}
              </p>
              <p class="text-xs text-gray-500">{{ instrument.name }}</p>
            </div>

            <div class="w-1/3">
              <div class="flex justify-start items-center space-x-2">
                <span class="text-sm font-semibold text-gray-900">
                  {{ instrument.current_price | currency }}
                </span>
                <span
                  class="text-xs"
                  [ngClass]="
                    instrument.change > 0 ? 'text-green-600' : 'text-red-600'
                  "
                >
                  {{ instrument.change > 0 ? '+' : '' }}
                  ({{ instrument.change_percent | number : '1.2-2' }}%)
                </span>
              </div>
            </div>

            <div class="w-1/3 text-right">
              <button
                class="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-xl hover:not-disabled:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                (click)="onAnalyze.emit(instrument.symbol)"
                [disabled]="!isModelSelected()"
              >
                Analyze
              </button>
            </div>
          </div>
        </li>
        }
      </ul>
    </div>
  `,
})
export class PopularInstrumentsComponent {
  instruments = input.required<Instrument[]>();
  isModelSelected = input<boolean>();
  onAnalyze = output<string>();
}
