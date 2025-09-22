import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, forkJoin, map, Observable, switchMap } from 'rxjs';
import { Post, User, Comment } from './posts.model';

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
    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { params });
  }

  getPostDetails(postId: number): Observable<{ post: Post; author: User; comments: Comment[] }> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${postId}`).pipe(
      delay(500), // showcase spinner
      switchMap((post) => {
        return forkJoin({
          post: [post],
          author: this.http.get<User>(`${this.apiUrl}/users/${post.userId}`),
          comments: this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`),
        });
      }),
      map((data) => ({
        post: data.post,
        author: data.author,
        comments: data.comments,
      })),
    );
  }
}
