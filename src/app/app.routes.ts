import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { anonGuard } from './core/guards/anon.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'articles',
    pathMatch: 'full'
  },

  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [anonGuard]
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [anonGuard]
  },

  {
    path: 'articles',
    loadComponent: () => import('./features/articles/pages/article-list/article-list.component').then(m => m.ArticleListComponent)
  },

  {
    path: 'articles/new',
    loadComponent: () => import('./features/articles/pages/article-form/article-form.component').then(m => m.ArticleFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'articles/edit/:id',
    loadComponent: () => import('./features/articles/pages/article-form/article-form.component').then(m => m.ArticleFormComponent),
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'articles'
  }
];