import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";
import { ArticleService } from "../../../../core/services/article.service";

interface Article {
    id?: number;
    title: string;
    content: string;
    tags: string;
}

@Component({
    selector: 'app-article-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatInputModule,
        MatFormFieldModule,
        MatSnackBarModule
    ],
    templateUrl: './article-list.component.html',
    styleUrl: './article-list.component.scss',
})

export class ArticleListComponent implements OnInit {
    private articleService = inject(ArticleService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);

    public articles = signal<Article[]>([]);
    public isLoading = signal<boolean>(true);
    public searchFilter = signal<string>('');

    ngOnInit(): void {
        this.loadArticles();
    }

    public loadArticles(): void {
        this.isLoading.set(true);

        this.articleService.getAll().subscribe({
            next: (data) => {
                this.articles.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Erro ao buscar artigos', err);
                this.isLoading.set(false);
            }
        });
    }

    public onSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchFilter.set(value);
        this.loadArticles();
    }

    public editArticle(id: number): void {
        if (!this.authService.isAuthenticated()) {
            this.snackBar.open('Você precisa estar logado para editar um artigo técnico.', 'Fechar', {
                duration: 3000,
                panelClass: ['error-snack']
            });
            this.router.navigate(['/login']);
            return;
        }

        this.router.navigate(['/articles/edit', id]);
    }

    public deleteArticle(id: number): void {
        if (!this.authService.isAuthenticated()) {
            this.snackBar.open('Você precisa estar logado para excluir um artigo técnico.', 'Fechar', {
                duration: 3000,
                panelClass: ['error-snack']
            });
            this.router.navigate(['/login']);
            return;
        }

        if (confirm('Tem certeza que deseja excluir este artigo?')) {
            this.articleService.delete(id).subscribe({
                next: () => {
                    this.articles.update(currentArticles =>
                        currentArticles.filter(article => article.id !== id)
                    );
                    this.snackBar.open('Artigo excluído com sucesso!', 'Fechar', {
                        duration: 3000,
                        panelClass: ['success-snack']
                    });
                },
                error: (err) => {
                    console.error('Erro ao deletar artigo:', err);
                    this.snackBar.open('Erro ao excluir o artigo.', 'Fechar', {
                        duration: 3000,
                        panelClass: ['error-snack']
                    });
                }
            });
        }
    }
}
