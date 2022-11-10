import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, interval, map, startWith, Subscription } from "rxjs";

@Pipe({
    name: "niceDateTime",
    pure: false,
})
export class NiceDateTimePipe implements OnDestroy, PipeTransform {

    private subscription: Subscription | null = null;
    private latestValue: string | null = null;
    private dateSubject$ = new BehaviorSubject<Date | null>(null);

    private readonly ONE_DAY = 86400000;
    private readonly ONE_HOUR = 3600000;
    private readonly ONE_MINUTE = 60000;

    private date$ = combineLatest([
      this.dateSubject$,
      interval(10000).pipe(startWith(0)),
    ]).pipe(
      map(([d, _]) => d),
      filter(d => d != null),
      map(d => this.toNicelyFormattedTime(d as Date)),
      map(d => this.translate(d)),
      distinctUntilChanged(),
    );
  
    constructor(
      private changeDetectorRef: ChangeDetectorRef,
    ) {
      this.subscription = this.date$.subscribe(d => {
        this._updateLatestValue(d);
      });
    }
  
    ngOnDestroy(): void {
      if (this.subscription != null) {
        this._dispose();
      }
    }
  
    transform(value: Date) {
      this.dateSubject$.next(value);
      return this.latestValue;
    }
  
    private _dispose(): void {
      this.subscription?.unsubscribe();
      this.latestValue = null;
    }

    // TODO: replace method body by your translation library
    private translate(date: NicelyFormattedDate): string {
        if (date.key == null) {
            return date.date ?? '';
        }
  
        const monthNameMap = new Map([
            ["JANUARY", "january"],
            ["FEBRUARY", "february"],
            ["MARCH", "march"],
            ["APRIL", "april"],
            ["MAY", "may"],
            ["JUNI", "juni"],
            ["JULI", "juli"],
            ["AUGUST", "august"],
            ["SEPTEMBER", "september"],
            ["OKTOBER", "oktober"],
            ["NOVEMBER", "november"],
            ["DECEMBER", "december"],
        ]);
        const monthName = date.month != null ? monthNameMap.get(date.month) : null;
        const translationMap = new Map([
            ["MINUTES_ONLY_AGO", `${ date.minutes } minutes ago`],
            ["HOURS_AND_MINUTES_AGO", `${ date.hours } hours ${ date.minutes } minutes ago`],
            ["IN_MINUTES", `in ${ date.minutes } minutes`],
            ["IN_HOURS_AND_MINUTES", `in ${ date.hours } hours ${ date.minutes } minutes`],
            ["YESTERDAY_DATE", `yesterday ${ date.date }`],
            ["TOMORROW_DATE", `tomorrow ${ date.date }`],
            ["LAST_YEAR", `${ monthName } ${ date.monthDay }, ${ date.time }`],
        ]);
        const translatedValue = translationMap.get(date.key);
        if (translatedValue == null) {
            throw new Error('Not mapped');
        }

        return translatedValue;
    }
  
    private _updateLatestValue(value: string): void {
      this.latestValue = value;
      this.changeDetectorRef.markForCheck();
    }

    private toNicelyFormattedTime(date: Date): NicelyFormattedDate {
        date = this.verifyDateType(date);
        const comparator = (new Date()).getTime();
        const dateTimestamp = date.getTime();
        const difference = comparator - dateTimestamp;
    
        if (difference < 0) {
            return this.futureFormattedDate(-difference, date);
        }
    
        return this.pastFormattedDate(difference, date);
    }

    private verifyDateType(date: Date): Date {
        if (typeof date === "string") {
            return this.parseDateStringToDate(date);
        }
        return date;
    }

    private parseDateStringToDate(date: string): Date {
        return new Date(date);
    }

    function pastFormattedDate(difference: number, date: Date): NicelyFormattedDate {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		yesterday.setHours(0, 0, 0, 0);

		if (date > today) {
			return milisecondsToHoursAgo(difference);
		}
		else if (date > yesterday) {
			return dateToYesterday(date);
		}

		if (difference < oneDay * 365) {
			return dateToLocalizedDate(date);
		}

		return { key: null, date: toFormattedDate(date)};
	}

	function futureFormattedDate(difference: number, date: Date): NicelyFormattedDate {
		const today = new Date();
		today.setHours(24, 0, 0, 0);
		const tommorow = new Date();
		tommorow.setDate(tommorow.getDate() + 1);
		tommorow.setHours(24, 0, 0, 0);

		if (date < today) {
			return milisecondsToHoursTo(difference);
		}

		if (date < tommorow) {
			return dateToTomorrow(date);
		}

		if (difference > oneDay * 365) {
			return dateToLocalizedDate(date);
		}

		return { key: null, date: toFormattedDate(date)};
	}

    private milisecondsToHoursTo(ms: number): NicelyFormattedDate {
        // tslint:disable-next-line: no-bitwise
        const hours = (ms / this.ONE_HOUR) | 0;
        // tslint:disable-next-line: no-bitwise
        const minutes = ((ms %  this.ONE_HOUR) / this.ONE_MINUTE) | 0;
    
        if (hours === 0) {
            return {
                key: "IN_MINUTES",
                minutes
             };
        }
    
        return {
            key: "IN_HOURS_AND_MINUTES",
            hours,
            minutes
        };
    }

    private milisecondsToHoursAgo(ms: number): NicelyFormattedDate {
        // tslint:disable-next-line: no-bitwise
        const hours = (ms / this.ONE_HOUR) | 0;
        // tslint:disable-next-line: no-bitwise
        const minutes = ((ms % this.ONE_HOUR) / this.ONE_MINUTE) | 0;
    
        if (hours === 0) {
            return {
                key: "MINUTES_ONLY_AGO",
                minutes
             };
        }
    
        return {
            key: "HOURS_AND_MINUTES_AGO",
            hours,
            minutes
        };
    }
    
    private dateToTomorrow(date: Date): NicelyFormattedDate {
        return {
            key: "TOMORROW_DATE",
            date: this.toFormattedTime(date)
        };
    }

    private dateToLocalizedDate(date: Date): NicelyFormattedDate {
        return {
            key: "LAST_YEAR",
            month: this.mapMonthName(date.getMonth() + 1),
            monthDay: date.getDate(),
            time: this.toFormattedTime(date)
        };
    }

    private dateToYesterday(date: Date): NicelyFormattedDate {
        return {
            key: "YESTERDAY_DATE",
            date: this.toFormattedTime(date)
        };
    }

    private toFormattedDate(date: Date): string {
        date = this.verifyDateType(date);
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    }

    private toFormattedTime(date: Date): string {
        date = this.verifyDateType(date);
        const time = date.toTimeString().split(" ")[0];
        const timeWithoutSeconds = time.split(":").slice(0, 2).join(":");
        return timeWithoutSeconds;
    }

    private mapMonthName(month: number): string {
        var monthNameMap = new Map([
            [1, "JANUARY"],
            [2, "FEBRUARY"],
            [3, "MARCH"],
            [4, "APRIL"],
            [5, "MAY"],
            [6, "JUNI"],
            [7, "JULI"],
            [8, "AUGUST"],
            [9, "SEPTEMBER"],
            [10, "OKTOBER"],
            [11, "NOVEMBER"],
            [12, "DECEMBER"],
        ]);
        const monthName = monthNameMap.get(month);
        if (monthName == null) {
            throw new Error("Not mapped");
        }

        return monthName;
    }
}

export interface NicelyFormattedDate {
    key: string | null;
    month?: string;
    monthDay?: number;
    hours?: number;
    minutes?: number;
    date?: string;
    time?: string;
}
