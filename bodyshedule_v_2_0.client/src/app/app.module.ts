import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular'


import { AppComponent } from './app.component';
import { LoginComponent } from './modules/authorization/components/login/login.component';
import { HomeComponent } from './modules/home/components/home/home.component';
import { RegistrationComponent } from './modules/registration/components/registration/registration.component';
import { HttpInterceptorService } from './modules/authorization/shared/http-interceptor.service';
import { CreateComponent } from './modules/events/components/create/create.component';
import { ListComponent } from './modules/events/components/list/list.component';
import { EditComponent } from './modules/events/components/edit/edit.component';
import { DeleteComponent } from './modules/events/components/delete/delete.component';
import { DetailsComponent } from './modules/events/components/details/details.component';
import { NavbarComponent } from './modules/navbar/components/navbar/navbar.component';
import { CreateTrainingProgramComponent } from './modules/training-programs/components/create-training-program/create-training-program.component';
import { ListTrainingProgramComponent } from './modules/training-programs/components/list-training-program/list-training-program.component';
import { DetailsTrainingProgramComponent } from './modules/training-programs/components/details-training-program/details-training-program.component';
import { DeleteTrainingProgramComponent } from './modules/training-programs/components/delete-training-program/delete-training-program.component';
import { EditTrainingProgramComponent } from './modules/training-programs/components/edit-training-program/edit-training-program.component';
import { ChangeUserPasswordComponent } from './modules/authorization/components/change-user-password/change-user-password.component';
import { ResetUserPasswordComponent } from './modules/authorization/components/reset-user-password/reset-user-password.component';
import { ForgotUserPasswordComponent } from './modules/authorization/components/forgot-user-password/forgot-user-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegistrationComponent,
    CreateComponent,
    ListComponent,
    EditComponent,
    DeleteComponent,
    DetailsComponent,
    NavbarComponent,
    CreateTrainingProgramComponent,
    ListTrainingProgramComponent,
    DetailsTrainingProgramComponent,
    DeleteTrainingProgramComponent,
    EditTrainingProgramComponent,
    ChangeUserPasswordComponent,
    ResetUserPasswordComponent,
    ForgotUserPasswordComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule, FormsModule, NgbModule,
    ReactiveFormsModule, FullCalendarModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
