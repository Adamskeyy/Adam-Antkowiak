import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, delay, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Post, User, Comment, PostDetailsModel } from './posts.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  getPosts(userId?: number): Observable<Post[]> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('userId', userId.toString());
    }
    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { params }).pipe(
      map((posts) => posts.map((post) => ({ ...post, favorite: false }))),
      catchError(() => of([])),
    );
  }

  getPostDetails(postId: number): Observable<PostDetailsModel | null> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${postId}`).pipe(
      delay(300), // showcase spinner
      switchMap((post) => {
        return forkJoin({
          post: of(post),
          author: this.http
            .get<User>(`${this.apiUrl}/users/${post.userId}`)
            .pipe(catchError(() => of({} as User))),
          comments: this.http
            .get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`)
            .pipe(catchError(() => of([]))),
        });
      }),
      map((data) => ({
        post: data.post,
        author: data.author,
        comments: data.comments,
      })),
      catchError(() => of(null)),
    );
  }
}
