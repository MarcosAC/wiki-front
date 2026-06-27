import { Routes } from '@angular/router';
import { ArticleListComponent } from './features/articles/pages/article-list/article-list.component';
import { ArticleFormComponent } from './features/articles/pages/article-form/article-form.component';
import { LoginComponent } from './features/auth/login/login.component'; // 👈 Importe aqui

export const routes: Routes = [
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
  { path: 'articles', component: ArticleListComponent },
  { path: 'articles/new', component: ArticleFormComponent },
  { path: 'articles/edit/:id', component: ArticleFormComponent },
  { path: 'login', component: LoginComponent }, // 👈 Adicione a rota aqui
];

// import { Routes } from '@angular/router';

// export const routes: Routes = [
//     {
//         path: '',
//         redirectTo: 'articles',
//         pathMatch: 'full'
//     },
//     {
//         path: 'articles',        
//         loadComponent: () => import('./features/articles/pages/article-list/article-list.component')
//             .then(m => m.ArticleListComponent)
//     },
//     {
//         path: 'articles/new',        
//         loadComponent: () => import('./features/articles/pages/article-form/article-form.component')
//             .then(m => m.ArticleFormComponent)
//     },
//     {
//         path: 'articles/edit/:id',        
//         loadComponent: () => import('./features/articles/pages/article-form/article-form.component')
//             .then(m => m.ArticleFormComponent)
//     },
//     {
//         path: '**',
//         redirectTo: 'articles'
//     }    
// ];