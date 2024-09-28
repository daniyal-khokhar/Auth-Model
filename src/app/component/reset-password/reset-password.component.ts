import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user-services';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  changePasswordForm!: FormGroup;
  userEmail: string | null = null;

  constructor(private fb: FormBuilder , 
    private userService:UserService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getOldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }

  getPassword() {
    return this.changePasswordForm.get('password');
  }

  getConfirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  // Error messages
  oldPasswordError() {
    return this.getOldPassword()?.hasError('required') ? 'Old password is required.' : '';
  }

  passwordError() {
    if (this.getPassword()?.hasError('required')) {
      return 'New password is required.';
    }
    return this.getPassword()?.hasError('minlength') ? 'Password must be at least 6 characters long.' : '';
  }

  confirmPasswordError() {
    if (this.getConfirmPassword()?.hasError('required')) {
      return 'Confirm password is required.';
    }
    return this.changePasswordForm.hasError('mismatch') ? 'Passwords do not match.' : '';
  }

  getUserDetails() {
    const user = UserService.getLoggedUser();
    if (user) {
      this.userEmail = user.data.email;  
    }    
  }

  onSubmit() {
    if (this.changePasswordForm.valid && this.userEmail) {
      const formValues = this.changePasswordForm.value;

        const Data = {
        email: this.userEmail, // Send the logged-in user's email
        currentPassword: formValues.currentPassword,
        newPassword: formValues.newPassword
      };

      this.userService.changePassword(Data).subscribe(
        response => {
          console.log("Password changed successfully:", response);
          alert('Password changed successfully');
        },
        error => {
          console.error("Error changing password:", error);
          alert('Failed to change password');
        }
      );
    }
  }
  }
