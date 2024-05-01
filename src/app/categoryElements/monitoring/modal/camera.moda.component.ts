import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-video-modal',
  template: `
    <div class="dialog-header dark-background">
      <h2>Monitoring podgląd</h2>
      <button alt="Zamknij okno modalne" mat-icon-button class="close-button " mat-dialog-close>
        <mat-icon aria-label="strzałka wstecz">close</mat-icon>
      </button>
    </div>
    <div class="video-container ">
      <img #videoPlayer alt="Video Stream" src="http://192.168.1.103:5000/video_feed" />
    </div>
  `,
  styleUrls: ['./camera.modal.component.scss'],
})
export class VideoModalComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLImageElement>;

  constructor(private dialogRef: MatDialogRef<VideoModalComponent>) {}

  ngOnInit(): void {
    console.log('Video streaming component initialized');
  }

  ngOnDestroy(): void {
    console.log('Video streaming component destroyed');
  }

  close(): void {
    this.dialogRef.close();
  }
}
