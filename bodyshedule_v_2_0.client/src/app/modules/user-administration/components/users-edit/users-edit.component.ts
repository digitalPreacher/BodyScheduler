import { Component, Input, TemplateRef, ViewChild, inject } from '@angular/core';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';
import { UserAdministrationService } from '../../shared/service/user-administration.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrl: './users-edit.component.css'
})
export class UsersEditComponent {
  isLoadingDataSubscribtion: any;
  isLoading!: boolean;
  editUserForm: FormGroup;
  submittedClick: boolean = false;

  @Input() userId!: number;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  modalService = inject(NgbModal);

  constructor(private userAdminService: UserAdministrationService, private loadingService: LoadingService, private formBuilder: FormBuilder) {

    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.editUserForm = this.formBuilder.group({
      id: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: [''],
    });
  }

  //get user data
  loadData() {
    this.loadingService.show();
    this.userAdminService.getUser(this.userId).subscribe({
      next: data => {
        this.loadingService.hide();
        this.editUserForm.patchValue({
          id: data.id,
          userName: data.userName,
          email: data.email
        });
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    })
  }

  //save user data changes
  saveUserDataChanges() {
    if (this.editUserForm.valid) {
      this.loadingService.show();
      this.userAdminService.editUserData(this.editUserForm.value).subscribe({
        next: result => {
          this.loadingService.hide();
          this.submittedClick = false;
          this.modalService.dismissAll();
          this.userAdminService.userChangeData$.next(true);
        },
        error: err => {
          this.loadingService.hide();
          this.errorModal.openModal(err);
        }
      });
    }
  }

  //open modal form
  open(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };

    this.loadData();

    this.modalService.open(content, options);
  }


}
