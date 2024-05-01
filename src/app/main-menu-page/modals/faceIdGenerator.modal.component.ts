import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryElementsService } from 'src/app/categoryElements/category-elements.service';

@Component({
  selector: 'app-video-modal',
  template: `
    <div class="dialog-header dark-background " tabindex="-1">
      <h2>Skanowanie twarzy</h2>
      <button mat-icon-button class="close-button" mat-dialog-close>
        <mat-icon aria-label="Zamknij okno modalne">close</mat-icon>
      </button>
    </div>
    <div class="video-container">
      <img #videoPlayer alt="Video Stream" src="http://192.168.1.103:5000/video_feed" />
    </div>
    <button (click)="generateFaceIdModel()" class="dark-fill-button">Generuj model Face ID</button>
  `,
  styleUrls: ['./styles/faceIdGenerator.modal.component.scss'],
})
export class FaceIdModalComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLImageElement>;

  constructor(private dialogRef: MatDialogRef<FaceIdModalComponent>, private categoryElementsService: CategoryElementsService) {}

  ngOnInit(): void {
    console.log('Video streaming component initialized');
  }

  ngOnDestroy(): void {
    console.log('Video streaming component destroyed');
  }

  close(): void {
    this.dialogRef.close();
  }
  generateFaceIdModel() {
    this.categoryElementsService.generateFaceIdModel().subscribe({
      next: (response) => {
        console.log(response.message);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
