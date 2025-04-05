import { Routes } from '@angular/router';
import { NotFoundComponent } from './main/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/main-routing.module').then(m => m.MainRoutingModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule)
  },
  {
    path: 'room',
    loadChildren: () => import('./room/room-routing.module').then(m => m.RoomRoutingModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
