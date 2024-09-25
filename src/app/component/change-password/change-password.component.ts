import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user-services';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm!: FormGroup;
  email!: string;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.email = queryParams['email'];
  
      this.changePasswordForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, { validator: this.passwordMatchValidator });
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getpassword() {
    return this.changePasswordForm.get('password');
  }

  getConfirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  passwordError() {
    if (this.getpassword()?.hasError('required')) {
      return 'New Password is required';
    }
    if (this.getpassword()?.hasError('minlength')) {
      return 'New Password must be at least 6 characters long';
    }
    return '';
  }

  confirmPasswordError() {
    if (this.getConfirmPassword()?.hasError('required')) {
      return 'Confirm Password is required';
    }
    if (this.changePasswordForm.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const values = this.changePasswordForm.value
      const data = {
        password:values.password,
        confirmPassword:values.confirmPassword,
        email: this.email,
      };
      this.userService.resetPassword(data)
      .then(response => {
        this.router.navigate(['/login'], { queryParams: { email: this.email } });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}
}
