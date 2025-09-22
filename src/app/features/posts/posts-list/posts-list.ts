import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostsStoreService } from '../../../core/services/posts-store';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './posts-list.html',
})
export class PostsList implements OnInit {
  private readonly postsStore = inject(PostsStoreService);
  protected posts = this.postsStore.posts;
  protected loading = this.postsStore.loading;

  ngOnInit(): void {
    this.postsStore.loadPosts();
  }
}
