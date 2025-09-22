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
  private userIdFilterSignal = signal<number | null>(null);
  public favoritesOnlySignal = signal<boolean>(false);

  private readonly FAVORITES_KEY = 'favoritePostIds';

  public posts = computed(() => {
    let filteredPosts = this.allPostsSignal();
    const searchText = this.searchTextSignal().toLowerCase();
    const userIdFilter = this.userIdFilterSignal();

    if (searchText) {
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchText) ||
          post.body.toLowerCase().includes(searchText),
      );
    }

    if (userIdFilter !== null) {
      filteredPosts = filteredPosts.filter((post) => post.userId === userIdFilter);
    }

    if (this.favoritesOnlySignal()) {
      filteredPosts = filteredPosts.filter((post) => post.favorite);
    }

    return filteredPosts;
  });

  private saveFavoritesToLocalStorage(favoriteIds: number[]): void {
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  private loadFavoritesFromLocalStorage(): Set<number> {
    try {
      const storedIds = localStorage.getItem(this.FAVORITES_KEY);
      if (storedIds) {
        return new Set(JSON.parse(storedIds));
      }
    } catch (e) {
      console.error('Error reading from localStorage', e);
    }
    return new Set<number>();
  }

  loadPosts(userId?: number, forceReload = false): void {
    const now = Date.now();
    const CACHE_LIFETIME = 5 * 60 * 1000;

    if (
      !forceReload &&
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
        delay(300),
        take(1),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (posts) => {
          const storedFavorites = this.loadFavoritesFromLocalStorage();
          const updatedPosts = posts.map((p) => ({ ...p, favorite: storedFavorites.has(p.id) }));
          this.allPostsSignal.set(updatedPosts);
          this.lastFetchTimestamp.set(Date.now());
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

  public toggleFavorite(postId: number): void {
    this.allPostsSignal.update((posts) =>
      posts.map((post) => (post.id === postId ? { ...post, favorite: !post.favorite } : post)),
    );
    const favoriteIds = this.allPostsSignal()
      .filter((p) => p.favorite)
      .map((p) => p.id);
    this.saveFavoritesToLocalStorage(favoriteIds);
  }

  public setSearchText(text: string): void {
    this.searchTextSignal.set(text);
  }

  public setUserIdFilter(userId: number | null): void {
    this.userIdFilterSignal.set(userId);
    const shouldForceReload = userId === null;
    this.loadPosts(userId === null ? undefined : userId, shouldForceReload);
  }

  public toggleFavoritesOnly(): void {
    this.favoritesOnlySignal.update((current) => !current);
  }
}
