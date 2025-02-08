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
import { CreateTrainingProgramComponent } from './modules/training-programs/components/create-training-program/create-training-program.component';
import { ListTrainingProgramComponent } from './modules/training-programs/components/list-training-program/list-training-program.component';
import { DetailsTrainingProgramComponent } from './modules/training-programs/components/details-training-program/details-training-program.component';
import { ChangeUserPasswordComponent } from './modules/authorization/components/change-user-password/change-user-password.component'
import { ResetUserPasswordComponent } from './modules/authorization/components/reset-user-password/reset-user-password.component';
import { ForgotUserPasswordComponent } from './modules/authorization/components/forgot-user-password/forgot-user-password.component';
import { CreateBodyMeasureComponent } from './modules/body-measure/components/create-body-measure/create-body-measure.component';
import { DetailsBodyMeasureComponent } from './modules/body-measure/components/details-body-measure/details-body-measure.component';
import { LineChartBodyMeasureComponent } from './modules/body-measure/components/line-chart-body-measure/line-chart-body-measure.component';
import { CopyComponent } from './modules/events/components/copy/copy.component';
import { UsersListComponent } from './modules/user-administration/components/users-list/users-list.component';
import { AuthorizationAdminGuard } from './modules/authorization/guards/authorization-admin.guard';
import { TrainingResultsListComponent } from './modules/training-results/components/training-results-list/training-results-list.component'
import { CreateExerciseComponent } from './modules/exercises/components/create-exercise/create-exercise.component'
import { ListExercisesComponent } from './modules/exercises/components/list-exercises/list-exercises.component'

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'create', component: CreateComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'list', component: ListComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'edit', component: EditComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'delete', component: DeleteComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'details', component: DetailsComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'copy', component: CopyComponent, canActivate: [AuthorizationUserGuard] },  
  { path: 'programs/create', component: CreateTrainingProgramComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'programs/list', component: ListTrainingProgramComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'programs/details', component: DetailsTrainingProgramComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'account/change-user-password', component: ChangeUserPasswordComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'account/reset-password', component: ResetUserPasswordComponent },
  { path: 'account/forgot-password', component: ForgotUserPasswordComponent },
  { path: 'body-measure/create-body-measure', component: CreateBodyMeasureComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'body-measure/details-body-measure', component: DetailsBodyMeasureComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'body-measure/line-chart-body-measure', component: LineChartBodyMeasureComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'user-administration/users-list', component: UsersListComponent, canActivate: [AuthorizationAdminGuard] },
  { path: 'training-result/training-results-list', component: TrainingResultsListComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'exercises/create-exercise', component: CreateExerciseComponent, canActivate: [AuthorizationUserGuard] },
  { path: 'exercises/list-exercises', component: ListExercisesComponent, canActivate: [AuthorizationUserGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
