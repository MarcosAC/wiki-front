import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'articles',
        pathMatch: 'full'
    },
    {
        path: 'articles',        
        loadComponent: () => import('./features/articles/pages/article-list/article-list.component')
            .then(m => m.ArticleListComponent)
    },
    {
        path: 'articles/new',        
        loadComponent: () => import('./features/articles/pages/article-form/article-form')
            .then(m => m.ArticleForm)
    },
    {
        path: 'articles/edit/:id',        
        loadComponent: () => import('./features/articles/pages/article-form/article-form')
            .then(m => m.ArticleForm)
    },
    {
        path: '**',
        redirectTo: 'articles'
    }    
];