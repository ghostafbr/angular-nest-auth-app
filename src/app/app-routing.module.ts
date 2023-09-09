import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {isAuthenticatedGuard, isNotAuthenticatedGuard} from "./auth/guards";

const routes: Routes = [
  {
    path: 'auth',
    // Guards
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    // Guards
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path:'**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }