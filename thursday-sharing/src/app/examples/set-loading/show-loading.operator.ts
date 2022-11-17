import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';

export function showLoading<TSource>(text: string | null = null) {
    return (input: Observable<TSource>) => new Observable<TSource>(ob => {
        const key = Math.floor(Math.random() * 1000000000).toString();
        LoadingService.startStatic(key, text);
        const sub = input.subscribe({
            next: (v) => {
                ob.next(v);
            },
            error: err => {
                LoadingService.stopStatic(key);
                ob.error(err);
            },
            complete: () => {
                LoadingService.stopStatic(key);
                ob.complete();
            },
        });
        return () => {
            LoadingService.stopStatic(key);
            return sub;
        }
    });
}
