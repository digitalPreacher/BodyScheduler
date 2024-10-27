import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/components/home/home.component';
import { LoginComponent } from '../app/modules/authorization/components/login/login.component';
import { AuthorizationUserGuard } from './modules/authorization/guards/authorization-user.guard';
import { RegistrationComponent } from './modules/registration/components/registration/registration.component';
import { CreateComponent } from './modules/events/components/create/create.component';
import { ListComponent } from './modules/events/components/list/list.component'
import { EditComponent } from './modules/events/components/edit/edit.component';
import { DeleteComponent } from './modules/events/components/delete/delete.component';
import { DetailsComponent } from './modules/events/components/details/details.component';
import { NavbarComponent } from './modules/navbar/components/navbar/navbar.component'

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'create', component: CreateComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'list', component: ListComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'edit', component: EditComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'delete', component: DeleteComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'details', component: DetailsComponent, canActivate: [AuthorizationUserGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
