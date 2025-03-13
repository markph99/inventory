import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ItemsComponent } from './items/items.component';
import { SettingsComponent } from './settings/settings.component';
import { authguardGuard } from '../guards/authguard.guard';
const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        canActivate: [authguardGuard]
      },
      {
        path: 'items',
        component: ItemsComponent,
        canActivate: [authguardGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authguardGuard]
      }
    ],
    canActivate: [authguardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
