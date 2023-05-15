import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: 'login',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'principal-empresa',
    redirectTo: 'principal-empresa',
    pathMatch: 'full',
  },
  {
    path: 'principal-usuario',
    redirectTo: 'principal-usuario',
    pathMatch: 'full',
  },
  {
    path: 'registrar',
    redirectTo: 'registrar',
    pathMatch: 'full',
  },
  {
    path: 'recovery',
    redirectTo: 'recovery',
    pathMatch: 'full',
  },
  {
    path: 'index',
    loadComponent: () => import('./pages/index/index.page').then( m => m.IndexPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'principal-empresa',
    loadComponent: () => import('./pages/principal-empresa/principal-empresa.page').then( m => m.PrincipalEmpresaPage)
  },
  {
    path: 'principal-usuario',
    loadComponent: () => import('./pages/principal-usuario/principal-usuario.page').then( m => m.PrincipalUsuarioPage)
  },
  {
    path: 'registrar',
    loadComponent: () => import('./pages/registrar/registrar.page').then( m => m.RegistrarPage)
  },
  {
    path: 'recovery',
    loadComponent: () => import('./pages/recovery/recovery.page').then( m => m.RecoveryPage)
  },
];
