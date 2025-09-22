import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostsStoreService } from '../../../core/services/posts-store';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Loader],
  templateUrl: './posts-list.html',
})
export class PostsList implements OnInit {
  private readonly postsStore = inject(PostsStoreService);
  protected posts = this.postsStore.posts;
  protected loading = this.postsStore.loading;

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
