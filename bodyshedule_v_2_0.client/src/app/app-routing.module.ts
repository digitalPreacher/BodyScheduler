import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/events/home/components/home/home.component';
import { LoginComponent } from '../app/modules/authorization/components/login/login.component';
import { AuthorizationUserGuard } from './modules/authorization/guards/authorization-user.guard';
import { RegistrationComponent } from './modules/registration/components/registration/registration.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
