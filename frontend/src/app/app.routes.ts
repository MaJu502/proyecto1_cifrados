import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InboxComponent } from './inbox/inbox.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';
import { GroupsComponent } from './groups/groups.component';
import { ComposeMailsComponent } from './compose-mails/compose-mails.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent },
    { path: 'inbox', component: InboxComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'users', component: UsersComponent },
    { path: 'groups', component: GroupsComponent },
    { path: 'email', component: ComposeMailsComponent },
];
