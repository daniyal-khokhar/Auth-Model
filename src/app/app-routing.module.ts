import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './component/signup/signup.component';
import { LoginComponent } from './component/login/login.component';
import { AccountOtpComponent } from './component/account-otp/account-otp.component';
import { HomeComponent } from './component/home/home.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { VerifyOtpComponent } from './component/verify-otp/verify-otp.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';

const routes: Routes = [
  { path:"signup" , component:SignupComponent },
  { path:"home" , component: HomeComponent },
  { path:"login" , component:LoginComponent },
  { path:"accountotp" , component: AccountOtpComponent },
  { path:"verifyotp" , component: VerifyOtpComponent },
  { path:"forgot" , component: ForgotPasswordComponent },
  { path:"change" , component: ChangePasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
