import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'principal',
    redirectTo: 'principal',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    redirectTo: 'registro',
    pathMatch: 'full'
  },
  {
    path: 'desayuno',
    redirectTo: 'desayuno',
    pathMatch: 'full'
  },
  {
    path: 'qr',
    redirectTo: 'qr',
    pathMatch: 'full'
  },
  {
    path: 'perfil',
    redirectTo: 'perfil',
    pathMatch: 'full'
  },
  {
    path: 'recovery',
    redirectTo: 'recovery',
    pathMatch: 'full'
  },
  {
    path: 'entrada',
    redirectTo: 'entrada',
    pathMatch: 'full'
  },
  {
    path: 'salida',
    redirectTo: 'salida',
    pathMatch: 'full'
  },
  {
    path: 'asistencia',
    redirectTo: 'asistencia',
    pathMatch: 'full'
  },
  {
    path: 'recuperarPass',
    redirectTo: 'recuperarPass',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'principal',
    loadChildren: () => import('./principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'desayuno',
    loadChildren: () => import('./desayuno/desayuno.module').then( m => m.DesayunoPageModule)
  },
  {
    path: 'almuerzo',
    loadChildren: () => import('./almuerzo/almuerzo.module').then( m => m.AlmuerzoPageModule)
  },
  {
    path: 'once',
    loadChildren: () => import('./once/once.module').then( m => m.OncePageModule)
  },
  {
    path: 'cena',
    loadChildren: () => import('./cena/cena.module').then( m => m.CenaPageModule)
  },
  {
    path: 'qr',
    loadChildren: () => import('./qr/qr.module').then( m => m.QrPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'recovery',
    loadChildren: () => import('./recovery/recovery.module').then( m => m.RecoveryPageModule)
  },
  {
    path: 'entrada',
    loadChildren: () => import('./entrada/entrada.module').then( m => m.EntradaPageModule)
  },
  {
    path: 'salida',
    loadChildren: () => import('./salida/salida.module').then( m => m.SalidaPageModule)
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./asistencia/asistencia.module').then( m => m.AsistenciaPageModule)
  },
  {
    path: 'recuperarpass',
    loadChildren: () => import('./recuperarpass/recuperarpass.module').then( m => m.RecuperarpassPageModule)
  },








];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
