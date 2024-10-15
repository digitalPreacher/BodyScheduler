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
import { HomeComponent } from './modules/events/components/home/home.component';
import { RegistrationComponent } from './modules/registration/components/registration/registration.component';
import { HttpInterceptorService } from './modules/authorization/shared/http-interceptor.service';
import { CreateComponent } from './modules/events/components/create/create.component';
import { ListComponent } from './modules/events/components/list/list.component';
import { EditComponent } from './modules/events/components/edit/edit.component';
import { DeleteComponent } from './modules/events/components/delete/delete.component';
import { DetailsComponent } from './modules/events/components/details/details.component';

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
