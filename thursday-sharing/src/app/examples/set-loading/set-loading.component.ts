import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, delay, map, Observable, of } from 'rxjs';
import { LoadingService } from './loading.service';
import { showLoading } from './show-loading.operator';

@Component({
  selector: 'app-set-loading',
  templateUrl: './set-loading.component.html',
  styleUrls: ['./set-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetLoadingComponent implements OnInit {

  private incrementSubject$ = new BehaviorSubject(0);
  public vm$ = combineLatest([
    this.loadingService.isLoading$,
    this.incrementSubject$,
  ]).pipe(
    map(([isLoading, increment]) => ({ isLoading, increment })),
  )

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
  }

  public callApi(): void {
    of(null).pipe(
      delay(3000),
      showLoading(),
    ).subscribe(() => {
      this.incrementSubject$.next(this.incrementSubject$.value + 1);
    });
  }

  public callApiWithText(): void {
    of(null).pipe(
      delay(3000),
      showLoading('Loading...'),
    ).subscribe(() => {
      this.incrementSubject$.next(this.incrementSubject$.value + 1);
    });
  }
}
