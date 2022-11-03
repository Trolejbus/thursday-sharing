import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'niceDateTime',
  templateUrl: './nice-date-pipe.component.html',
  styleUrls: ['./nice-date-pipe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NiceDatePipeComponent implements OnInit {

  public currentDate = new Date();
  public date3MinutesAgo = new Date(new Date().getTime() - 3 * 60 * 1000);
  public date1Hour3MinutesAgo = new Date(new Date().getTime() - 1 * 60 * 60 * 1000 - 3 * 60 * 1000);
  public dateYesterday = new Date(new Date().getTime() - 25 * 60 * 60 * 1000);
  public dateMonthAgo = new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000);
  public dateYearAgo = new Date(new Date().getTime() - 13 * 31 * 24 * 60 * 60 * 1000);

  public date3MinutesLater = new Date(new Date().getTime() + 3 * 60 * 1000);
  public date1Hour3MinutesLater = new Date(new Date().getTime() + 1 * 60 * 60 * 1000 + 3 * 60 * 1000);
  public dateTommorow = new Date(new Date().getTime() + 25 * 60 * 60 * 1000);
  public dateYearLater = new Date(new Date().getTime() + 13 * 31 * 24 * 60 * 60 * 1000);

  public date1 = new Date(2022, 1, 1);

  public date3 = new Date(2022, 1, 1);

  constructor() { }

  ngOnInit(): void {
  }

}
