// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import SignInComponent from './demo/authentication/sign-in/sign-in.component';
import UserComponent from './demo/management-user/user/user.component';
import CustomerComponent from './demo/management-user/customer/customer.component';
import ProviderComponent from './demo/provider/provider.component';
import InventoryComponent from './demo/inventory/inventory.component';
import WorkOrderComponent from './demo/work-order/work-order.component';
import StatusOrderComponent from './demo/status-order/status-order.component';

const routes: Routes = [
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        redirectTo: 'auth/signin',
        pathMatch: 'full'
      },
      {
        path: 'auth/signup',
        loadComponent: () => import('./demo/authentication/sign-up/sign-up.component')
      },
      {
        path: 'auth/signin',
        loadComponent: () => import('./demo/authentication/sign-in/sign-in.component')
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [ 
      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics/dash-analytics.component')
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'customer',
        component: CustomerComponent,
        // canActivate: [SignInComponent]
      }, 
      {
        path: 'provider',
        component: ProviderComponent
      },
      {
        path: 'inventory',
        component: InventoryComponent
      },
      {
        path: 'work-order',
        component: WorkOrderComponent
      },
      {
        path: 'status-order',
        component: StatusOrderComponent
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart & map/core-apex/core-apex.component')
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms & tables/form-elements/form-elements.component')
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/forms & tables/tbl-bootstrap/tbl-bootstrap.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
