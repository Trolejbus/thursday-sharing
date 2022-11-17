import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Subject, withLatestFrom } from "rxjs";

@Injectable()
export class LoadingService {

    private static startLoadingStatic$ = new Subject<LoadingInfo>();
    private static stopLoadingStatic$ = new Subject<string>();
    
    private loadsSubject$ = new BehaviorSubject<LoadingInfo[]>([]);
    private startLoadingSubject$ = new Subject<LoadingInfo>();
    private startLoading$ = this.startLoadingSubject$.pipe(
        withLatestFrom(this.loadsSubject$),
        map(([info, infos]) => ({ info, infos })),
    );
    
    private stopLoadingSubject$ = new Subject<string>();
    private stopLoading$ = this.stopLoadingSubject$.pipe(
        withLatestFrom(this.loadsSubject$),
        map(([key, infos]) => ({ key, infos })),
    );
    
    public isLoading$ = this.loadsSubject$.pipe(
        map((loadings) => ({
            isLoading: loadings.length > 0,
            text: loadings.find(l => l.text != null)?.text,
        })),
    );
    
    constructor() {
        this.startLoading$.subscribe(arg => {
            this.loadsSubject$.next([ ...arg.infos, arg.info ]);
        });
    
        this.stopLoading$.subscribe(arg => {
            this.loadsSubject$.next(arg.infos.filter(i => i.key !== arg.key));
        });
    
        LoadingService.startLoadingStatic$.subscribe(s => {
            this.startLoadingSubject$.next(s);
        });
    
        LoadingService.stopLoadingStatic$.subscribe(s => {
            this.stopLoadingSubject$.next(s);
        });
    }
    
    public static startStatic(key: string, text: string | null = null): void {
        this.startLoadingStatic$.next({ key, text });
    }
    
    public static stopStatic(key: string): void {
        this.stopLoadingStatic$.next(key);
    }
    
    public start(key: string, text: string | null  = null): void {
        this.startLoadingSubject$.next({ key, text });
    }
    
    public stop(key: string): void {
        this.stopLoadingSubject$.next(key);
    }
}

export class LoadingInfo {
    constructor(public key: string, public text: string | null) {

    }
}
      