import { Routes } from '@angular/router';

export const postsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./posts-list/posts-list').then((m) => m.PostsList),
  },
  {
    path: ':id',
    loadComponent: () => import('./post-details/post-details').then((m) => m.PostDetails),
  },
];
