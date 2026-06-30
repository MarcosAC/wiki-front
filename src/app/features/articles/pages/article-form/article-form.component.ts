import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ArticleService } from '../../../../core/services/article.service';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss'
})
export class ArticleFormComponent implements OnInit {
  articleForm!: FormGroup;
  isEditMode = false;
  articleId?: number;
  
  public isLoading = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.articleId) {
      this.isEditMode = true;
      this.loadArticleForEdit();
    }
  }

  private initForm(): void {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      tags: ['', [Validators.required]]
    });
  }

  private loadArticleForEdit(): void {
    this.isLoading.set(true);
    this.articleService.getArticleById(this.articleId!).subscribe({
      next: (article) => {
        this.articleForm.patchValue(article);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar artigo para edição:', err);
        this.isLoading.set(false);
        this.router.navigate(['/articles']);
      }
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid) return;

    this.isLoading.set(true);

    const articleData = {
      ...this.articleForm.value,
      id: this.articleId
    }

    if (this.isEditMode) {      
      this.articleService.updateArticle(this.articleId!, articleData).subscribe({
        next: () => this.router.navigate(['/articles']),
        error: (err) => {
          console.error('Erro ao atualizar artigo:', err);
          this.isLoading.set(false);
        }
      });
    } else {
      this.articleService.createArticle(articleData).subscribe({
        next: () => this.router.navigate(['/articles']),
        error: (err) => {
          console.error('Erro ao criar artigo:', err);
          this.isLoading.set(false);
        }
      });
    }
  }
}