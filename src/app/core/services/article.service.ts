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

  public getAll(search?: string, tag?: string) {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (tag) params = params.set('tag', tag);    

    return this.http.get<ArticleResponse[]>(this.apiUrl, { params }).pipe(
      tap(articles => this.#articleState.set(articles)));
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.#articleState.update(list => list.filter(a => a.id !== id));
      })
    );
  }
}
