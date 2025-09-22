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
  protected posts = this.postsStore.posts;

  public isAnimating = signal(false);

  ngOnInit(): void {
    this.postsStore.loadPosts();
  }

  public toggleFavoritesOnly(): void {
    this.postsStore.toggleFavoritesOnly();
    this.isAnimating.set(true);
    setTimeout(() => {
      this.isAnimating.set(false);
    });
  }
}
