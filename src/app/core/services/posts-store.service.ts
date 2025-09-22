import { Injectable, inject, signal, computed } from '@angular/core';
import { Post, PostDetailsModel } from '../../features/posts/posts.model';
import { PostsService } from '../../features/posts/posts.service';
import { delay, finalize, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsStoreService {
  private postsService = inject(PostsService);

  private allPostsSignal = signal<Post[]>([]);
  public loading = signal<boolean>(false);
  private lastFetchTimestamp = signal<number | null>(null);

  private searchTextSignal = signal<string>('');
  public favoritesOnlySignal = signal<boolean>(false);

  public posts = computed(() => {
    let filteredPosts = this.allPostsSignal();
    const searchText = this.searchTextSignal().toLowerCase();

    if (searchText) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchText) ||
          post.body.toLowerCase().includes(searchText),
      );
    }

    if (this.favoritesOnlySignal()) {
      filteredPosts = filteredPosts.filter((post) => post.favorite);
    }

    return filteredPosts;
  });

  loadPosts(userId?: number): void {
    const now = Date.now();
    const CACHE_LIFETIME = 5 * 60 * 1000;

    if (
      this.allPostsSignal().length > 0 &&
      this.lastFetchTimestamp() &&
      now - this.lastFetchTimestamp()! < CACHE_LIFETIME &&
      !userId
    ) {
      return;
    }

    this.loading.set(true);
    this.postsService
      .getPosts(userId)
      .pipe(
        delay(300), // showcase spinner
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (posts) => {
          this.allPostsSignal.set(posts);
          this.lastFetchTimestamp.set(now);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  public loadPostDetails(postId: number): Observable<PostDetailsModel | null> {
    this.loading.set(true);
    return this.postsService.getPostDetails(postId).pipe(finalize(() => this.loading.set(false)));
  }

  public updatePosts(updatedPosts: Post[]): void {
    this.allPostsSignal.set(updatedPosts);
  }

  public toggleFavorite(postId: number, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.allPostsSignal.update((posts) =>
      posts.map((post) => (post.id === postId ? { ...post, favorite: !post.favorite } : post)),
    );
  }

  public setSearchText(text: string): void {
    this.searchTextSignal.set(text);
  }

  public setUserIdFilter(userId: number | null): void {
    this.loadPosts(userId === null ? undefined : userId);
  }

  public toggleFavoritesOnly(): void {
    this.favoritesOnlySignal.update((current) => !current);
  }
}
