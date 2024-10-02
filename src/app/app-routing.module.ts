import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/components/register/register.component';
import { LoginComponent } from './components/components/login/login.component';
import { ChatRoomComponent } from './components/components/chat-room/chat-room.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' }, // Default route to register
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatRoomComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'register' } // Wildcard route for undefined paths

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
