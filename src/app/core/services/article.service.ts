import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  tags: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
  authorName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5119/api/articles';

  #articleState = signal<ArticleResponse[]>([]);
  public articles = this.#articleState.asReadonly();

  /**
   * Mantido o getAll original com suporte a filtros,
   * e adicionado o apelido getArticles() para bater com a listagem.
   */
  public getAll(search?: string, tag?: string): Observable<ArticleResponse[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (tag) params = params.set('tag', tag);    

    return this.http.get<ArticleResponse[]>(this.apiUrl, { params }).pipe(
      tap(articles => this.#articleState.set(articles))
    );
  }

  // Abstração/Apelido utilizado pelo ArticleListComponent
  public getArticles(): Observable<ArticleResponse[]> {
    return this.getAll();
  }

  /**
   * Busca um artigo específico pelo ID para o formulário de Edição
   */
  public getArticleById(id: number): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cadastra um novo artigo e o adiciona no Signal de estado global
   */
  public createArticle(article: Partial<ArticleResponse>): Observable<ArticleResponse> {
    return this.http.post<ArticleResponse>(this.apiUrl, article).pipe(
      tap(newArticle => {
        this.#articleState.update(list => [...list, newArticle]);
      })
    );
  }

  /**
   * Atualiza um artigo existente e atualiza sua referência no Signal de estado
   */
  public updateArticle(id: number, article: Partial<ArticleResponse>): Observable<ArticleResponse> {
    return this.http.put<ArticleResponse>(`${this.apiUrl}/${id}`, article).pipe(
      tap(updatedArticle => {
        this.#articleState.update(list => 
          list.map(a => a.id === id ? { ...a, ...updatedArticle } : a)
        );
      })
    );
  }

  /**
   * Remove o artigo do banco e atualiza o Signal de estado removendo-o da lista
   */
  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.#articleState.update(list => list.filter(a => a.id !== id));
      })
    );
  }

  // Abstração/Apelido utilizado pelo ArticleListComponent para o delete
  public deleteArticle(id: number): Observable<void> {
    return this.delete(id);
  }
}