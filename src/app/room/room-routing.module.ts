import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { authguardGuard } from '../guards/authguard.guard';
import { InventoryComponent } from './inventory/inventory.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { ItemManagementComponent } from './item-management/item-management.component';

const routes: Routes = [
  {
    path: '',
    title: 'Room',
    component: MainComponent,
    canActivate: [authguardGuard],
    children: [
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
      },
      {
        path: 'inventory',
        title: 'Inventory',
        component: InventoryComponent,
        canActivate: [authguardGuard]
      },
      {
        path: 'maintenance',
        title: 'Maintenance',
        component: MaintenanceComponent,
        canActivate: [authguardGuard]
      },
      {
        path: 'item-management',
        title: 'Item Management',
        component: ItemManagementComponent,
        canActivate: [authguardGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
