import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InboxComponent } from './inbox/inbox.component';
import { SignupComponent } from './signup/signup.component';
import { DmsComponent } from './dms/dms.component';
import { GroupsComponent } from './groups/groups.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent },
    { path: 'inbox', component: InboxComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dms', component: DmsComponent },
    { path: 'groups', component: GroupsComponent },
];
