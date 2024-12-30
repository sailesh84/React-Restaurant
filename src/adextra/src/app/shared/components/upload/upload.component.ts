import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UploadService} from '@app/core/services/upload.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
  })
  export class UploadComponent implements OnInit, OnDestroy {
  @Input() title = 'File upload';
  @Input() fileSizeMax = 50; // in mb
  @Input() previewImg: any;
  @Input() noUpload = false;
  @Output() previewImgOnChange = new EventEmitter();

  fileError = false;
  fileSuccess = false;
  file = null;
  errorMessage = null;

  private isDead$ = new Subject();

  constructor(private uploadService: UploadService) { }

  ngOnInit() {
  }

  uploadFile() {
    if (this.file === undefined || this.file === null || this.file === '') {
      this.fileError = true;
      this.errorMessage = 'No image.';
      return;
    }

    const formData = new FormData();
    formData.append('upload', this.file, this.file.name);
    this.uploadService.upload(formData).pipe(takeUntil(this.isDead$)).subscribe( response => {
      this.fileSuccess = true;
      this.previewImgOnChange.emit(response.data);
    }, error => {
      this.fileError = true;
      this.errorMessage = 'Error occurred during the file upload.';
      this.previewImgOnChange.emit(null);
    });
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.fileError = true;
      this.errorMessage = 'Only images are supported.';
      return;
    }

    if (files[0].size / 1024 / 1024 > this.fileSizeMax) {
      this.fileError = true;
      this.errorMessage = 'File size greater than 50 MB.';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.fileError = false;
      this.previewImg = reader.result;
      this.previewImgOnChange.emit(this.previewImg);
      this.file = files[0];
    };
  }

  dragover(event) {
    event.preventDefault();
    event.target.classList.add('dragover');
  }

  drop(event) {
    event.preventDefault();
    event.target.classList.remove('dragover');
    if (event.dataTransfer.items) {
      const item = event.dataTransfer.items[0];
      if (item.kind === 'file') {
        this.preview([item.getAsFile()]);
      }
    } else {
      this.preview(event.dataTransfer.files);
    }
  }

  dragleave(event) {
    event.preventDefault();
    event.target.classList.remove('dragover');
  }

  ngOnDestroy() {
    this.isDead$.next();
  }
}
