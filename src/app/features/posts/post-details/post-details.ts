import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDetailsModel } from '../posts.model';
import { filter, switchMap } from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PostsStoreService } from '../../../core/services/posts-store.service';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, Loader],
  templateUrl: './post-details.html',
})
export class PostDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly postsStore = inject(PostsStoreService);
  private readonly router = inject(Router);

  protected loading = this.postsStore.loading;

  private postId = toSignal(
    this.route.paramMap.pipe(
      filter((params) => !!params.get('id')),
      switchMap((params) => [Number(params.get('id'))]),
    ),
  );

  public postDetailsData: Signal<PostDetailsModel | undefined> = toSignal(
    toObservable(this.postId).pipe(
      filter((id) => id !== undefined),
      switchMap((id) => this.postsStore.loadPostDetails(id as number)),
    ),
  );

  public goBack() {
    this.router.navigate(['/posts']);
  }
}
