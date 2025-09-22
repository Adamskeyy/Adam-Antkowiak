import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostsStoreService } from '../../../core/services/posts-store.service';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Loader],
  templateUrl: './posts-list.html',
  styleUrls: ['./posts-list.css'],
})
export class PostsList implements OnInit {
  protected readonly postsStore = inject(PostsStoreService);
  protected loading = this.postsStore.loading;

  protected isAnimating = signal(false);
  protected posts = computed(() => {
    if (this.isAnimating()) {
      return [];
    }
    return this.postsStore.posts();
  });

  ngOnInit(): void {
    this.postsStore.loadPosts();
  }

  public setSearchText(text: string): void {
    this.postsStore.setSearchText(text);
  }

  public setUserIdFilter(userId: number | null): void {
    this.postsStore.setUserIdFilter(userId);
  }

  public toggleFavoritesOnly(): void {
    this.postsStore.toggleFavoritesOnly();
    this.isAnimating.set(true);
    setTimeout(() => {
      this.isAnimating.set(false);
    });
  }

  toggleFavorite(postId: number, event: MouseEvent): void {
    event.stopPropagation();
    const currentPosts = this.postsStore.posts();
    const updatedPosts = currentPosts.map((post) => {
      if (post.id === postId) {
        return { ...post, favorite: !post.favorite };
      }
      return post;
    });

    this.postsStore.updatePosts(updatedPosts);
  }
}
