import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InboxComponent } from './inbox/inbox.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent },
    { path: 'inbox', component: InboxComponent },
    { path: 'signup', component: SignupComponent },
];
