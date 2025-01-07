import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from '../../service/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserErrorReportService } from '../../service/user-error-report.service'
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-user-error-report',
  templateUrl: './user-error-report.component.html',
  styles: ``
})
export class UserErrorReportComponent {
  modalService = inject(NgbModal);
  reportForm: FormGroup;
  getErrorMessage = false;
  errorMessages: string[] = [];
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  submittedClick = false;
  isLoading!: boolean;
  isLoadingDataSubscribtion: any;

  constructor(private formBuilder: FormBuilder, private loadingService: LoadingService, private reportService: UserErrorReportService, private alertService: AlertService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.reportForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      description: ['', Validators.required]
    })
  }

  sendUserReport() {
    if (this.reportForm.valid) {
      this.loadingService.show();
      this.reportService.sendUserReport(this.reportForm.value).subscribe({
        next: result => {
          this.loadingService.hide();
          this.modalService.dismissAll();
          this.alertService.showSelfClosedSuccessAlert();
        },
        error: error => {
          this.loadingService.hide();
          this.getErrorMessage = true;
          this.errorMessages = error;
        }
      })
    }
  }

  //open modal form
  open(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'md',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.reportForm.reset();
    this.modalService.open(content, options);
  }

}
