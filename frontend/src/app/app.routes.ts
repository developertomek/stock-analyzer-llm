import { Routes } from '@angular/router';

export const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () => import('./features/home/home.routes')
//       .then(m => m.HOME_ROUTES)
//   },
  
//   {
//     path: ':symbol',
//     loadChildren: () => import('./features/stock-detail/stock-detail.routes')
//       .then(m => m.STOCK_DETAIL_ROUTES)
//   },
  
  { path: '**', redirectTo: '' }
];
