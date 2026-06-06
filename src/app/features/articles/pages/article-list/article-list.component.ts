import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ArticleService } from "../../../../core/services/article.service";

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
        MatFormFieldModule
    ],
    templateUrl: './article-list.component.html',
    styleUrl: './article-list.component.scss',
})

export class ArticleListComponent implements OnInit {
    private articleService = inject(ArticleService);

    public articles = this.articleService.articles;
    public searchFilter = signal<string>('');

    ngOnInit(): void {
        this.loadArticles();
    }

    public loadArticles(): void {
        this.articleService.getAll(this.searchFilter()).subscribe({
            error: (err) => console.error('Erro ao buscar artigos da API:', err)
        });
    }

    public onSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchFilter.set(value);
        this.loadArticles();
    }

    public deleteArticle(id: number): void {
        if (confirm('Deseja realmente excluir este artigo?')) {
            this.articleService.delete(id).subscribe({
                error: (err) => console.error('Erro ao deletar artigo:', err)
            })
        }
    }
}
