import { Injectable, inject, signal } from '@angular/core';
import { Post, PostDetailsModel } from '../../features/posts/posts.model';
import { PostsService } from '../../features/posts/posts.service';
import { delay, finalize, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsStoreService {
  private postsService = inject(PostsService);

  public posts = signal<Post[]>([]);
  public loading = signal<boolean>(false);
  private lastFetchTimestamp = signal<number | null>(null);

  loadPosts(): void {
    const now = Date.now();
    const CACHE_LIFETIME = 5 * 60 * 1000;

    if (
      this.posts().length > 0 &&
      this.lastFetchTimestamp() &&
      now - this.lastFetchTimestamp()! < CACHE_LIFETIME
    ) {
      return;
    }

    this.loading.set(true);
    this.postsService
      .getPosts()
      .pipe(
        delay(300), // showcase spinner
        take(1),
      )
      .subscribe({
        next: (posts) => {
          this.posts.set(posts);
          this.lastFetchTimestamp.set(now);
          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.loading.set(false);
        },
      });
  }

  public loadPostDetails(postId: number): Observable<PostDetailsModel> {
    this.loading.set(true);
    return this.postsService.getPostDetails(postId).pipe(finalize(() => this.loading.set(false)));
  }

  public updatePosts(updatedPosts: Post[]): void {
    this.posts.set(updatedPosts);
  }
}
