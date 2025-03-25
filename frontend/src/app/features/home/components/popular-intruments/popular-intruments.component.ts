import { Component, input } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Instrument } from '../../../../shared/types/instrument.interface';

@Component({
  selector: 'app-popular-instruments',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <ul class="divide-y divide-gray-200">
        @for (instrument of instruments(); track instrument.symbol) {
        <li class="p-4 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ instrument.symbol }}
              </p>
              <p class="text-xs text-gray-500">{{ instrument.name }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">
                {{ instrument.current_price | currency }}
              </p>
              <p
                class="text-xs"
                [ngClass]="
                  instrument.change > 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ instrument.change > 0 ? '+' : ''
                }}{{ instrument.change | number : '1.2-2' }} ({{
                  instrument.change_percent | number : '1.2-2'
                }}%)
              </p>
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
}
