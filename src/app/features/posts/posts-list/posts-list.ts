import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostsStoreService } from '../../../core/services/posts-store.service';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Loader],
  templateUrl: './posts-list.html',
})
export class PostsList implements OnInit {
  protected readonly postsStore = inject(PostsStoreService);
  protected posts = this.postsStore.posts;
  protected loading = this.postsStore.loading;

  public setSearchText = this.postsStore.setSearchText.bind(this.postsStore);
  public setUserIdFilter = this.postsStore.setUserIdFilter.bind(this.postsStore);
  public toggleFavoritesOnly = this.postsStore.toggleFavoritesOnly.bind(this.postsStore);

  ngOnInit(): void {
    this.postsStore.loadPosts();
  }

  toggleFavorite(postId: number, event: MouseEvent): void {
    event.stopPropagation();
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.map((post) => {
      if (post.id === postId) {
        return { ...post, favorite: !post.favorite };
      }
      return post;
    });

    this.postsStore.updatePosts(updatedPosts);
  }
}
