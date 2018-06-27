import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  @Input() time: object;
  private subscriptionTimer: Subscription;
  private startSeconds: number;
  private totalSeconds: number;
  private timeClick = new BehaviorSubject<number>(0);

  public hh: number;
  public mm: number;
  public ss: number;
  public isStart: boolean;
  public isReset: boolean;
  public isEnd: boolean;

  constructor() { }

  private setSeconds(): void {

    this.totalSeconds = this.startSeconds = +this.time['second'] + this.time['minute'] * 60 + this.time['hour'] * 60 * 60;

  }

  private print( seconds ): void {

    const date = new Date(seconds * 1000);
    this.hh = date.getUTCHours();
    this.mm = date.getUTCMinutes();
    this.ss = date.getSeconds();

  }

  private subscribeTime(): void {

    this.subscriptionTimer = interval(1000).subscribe(() => {

      this.totalSeconds = this.totalSeconds - 1;

      this.print( this.totalSeconds );

      if ( this.totalSeconds === 0 ) {
        this.isEnd = true;
        this.unsubscribeTime();
      }

    });

  }

  private unsubscribeTime(): void {

    if ( this.subscriptionTimer ) {

      this.subscriptionTimer.unsubscribe();

    }

  }

  public reset(): void {

    this.unsubscribeTime();

    this.totalSeconds = this.startSeconds;
    this.print(this.totalSeconds);
    this.isStart = false;
    this.isReset = false;
    this.isEnd = false;

  }

  public start(): void {

    this.subscribeTime();
    this.isStart = true;
    this.isReset = true;

  }

  public stop(): void {

    this.unsubscribeTime();
    this.isStart = false;

  }

  public wait(): void {

    let currentTime = new Date().getTime();
    const delay = currentTime - this.timeClick.getValue();

    if ( delay < 300 ) {

      this.stop();
      currentTime = 0;

    }

    this.timeClick.next(currentTime);
  }

  public ngOnInit(): void {

    this.setSeconds();
    this.print(this.startSeconds);
    this.isStart = false;
    this.isReset = false;
    this.isEnd = this.startSeconds === 0;

  }

  public ngOnDestroy(): void {

    this.unsubscribeTime();

  }
}
