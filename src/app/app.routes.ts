import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'posts',
    loadChildren: () => import('./features/posts/posts.routes').then((m) => m.postsRoutes),
  },
  {
    path: '',
    redirectTo: '/posts',
    pathMatch: 'full',
  },
];
