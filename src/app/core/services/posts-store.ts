import { Injectable, inject, signal } from '@angular/core';
import { Post } from '../../features/posts/posts.model';
import { PostsService } from '../../features/posts/posts.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsStoreService {
  private postsService = inject(PostsService);

  public posts = signal<Post[]>([]);
  public loading = signal<boolean>(false);

  loadPosts(): void {
    if (this.posts().length > 0) {
      return;
    }

    this.loading.set(true);
    this.postsService
      .getPosts()
      .pipe(take(1))
      .subscribe({
        next: (posts) => {
          this.posts.set(posts);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Błąd podczas ładowania postów:', error);
          this.loading.set(false);
        },
      });
  }
}
