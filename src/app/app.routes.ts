import { Routes } from '@angular/router';
import { ArticleListComponent } from './features/articles/pages/article-list/article-list.component';
import { ArticleFormComponent } from './features/articles/pages/article-form/article-form.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
  { path: 'articles', component: ArticleListComponent },
  { path: 'articles/new', component: ArticleFormComponent, canActivate: [authGuard] },
  { path: 'articles/edit/:id', component: ArticleFormComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
];
