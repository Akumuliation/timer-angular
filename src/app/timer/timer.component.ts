import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';


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

  public hh: number;
  public mm: number;
  public ss: number;
  public isStart: boolean;

  constructor() { }

  ngOnInit() {

    this.setSeconds();

    this.print(this.startSeconds);
    this.isStart = false;
  }

  ngOnDestroy() {

    this.unsubscribeTime();

  }

  private setSeconds() {

    this.totalSeconds = this.startSeconds = +this.time['second'] + this.time['minute'] * 60 + this.time['hour'] * 60 * 60;

  }

  private print( seconds ) {

    const date = new Date(seconds * 1000);
          this.hh = date.getUTCHours();
          this.mm = date.getUTCMinutes();
          this.ss = date.getSeconds();
  }

  private subscribeTime() {

    this.subscriptionTimer = interval(1000).subscribe(() => {

      if ( this.totalSeconds === 0 ) {
        this.unsubscribeTime();
        return;
      }

      this.totalSeconds = this.totalSeconds - 1;

      this.print( this.totalSeconds );

    });

  }

  private unsubscribeTime() {

    if ( this.subscriptionTimer ) {

      this.subscriptionTimer.unsubscribe();

    }

  }

  public reset() {

    this.unsubscribeTime();

    this.totalSeconds = this.startSeconds;
    this.print(this.totalSeconds);
    this.isStart = true;
  }

  public start() {

    this.subscribeTime();

    this.isStart = true;
  }

  public stop() {

    this.unsubscribeTime();

    this.isStart = false;
  }
}
