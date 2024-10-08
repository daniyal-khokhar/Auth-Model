import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule , FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user-services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading = false;
    public loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
     private userService: UserService, 
     @Inject(ToastrService) private toastr: ToastrService,
      private router: Router) { }

  ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
          email: new FormControl('', [
              Validators.required,
              Validators.email,
          ]),
          password: new FormControl('', [
              Validators.required,
              Validators.minLength(6),
          ]),
      });
  }
  onSubmit() {
      if (!this.loginForm.valid) {
          this.loginForm.markAllAsTouched();
          return;
      }

      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      const data = { email, password };
      this.isLoading = true;
      this.userService.logIn(data).then(
        response => {
           if (response.message === "Unauthorized" && response.statusCode === 401 ) {
            this.toastr.error('Login failed. Please try again.', 'Error', {
              positionClass: 'toast-top-right',
            });
          } else {
            this.toastr.success('User Login Successful.', 'Success', {
              positionClass: 'toast-top-right',
            });
            this.router.navigate(['/home']);
          }
          this.isLoading = false;
        },
      ).catch(error => {
        console.error('An error occurred:', error);
        this.toastr.error('Login failed. Please try again..', 'Error', {
          positionClass: 'toast-top-right',
        });
      });
      
  }



  emailError() {
      return this.loginForm.get('email')?.hasError('required') ? 'Email is required' :
          this.loginForm.get('email')?.hasError('email') ? 'Enter a valid email address' : '';
  }

  getEmail() {
      return this.loginForm.get('email');
  }

  passwordError() {
      return this.loginForm.get('password')?.hasError('required') ? 'Password is required' :
          this.loginForm.get('password')?.hasError('minlength') ? 'Password must be at least 6 characters' : '';
  }

  getPassword() {
      return this.loginForm.get('password');
  }

  private markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach(control => {
          control.markAsTouched();

          if (control instanceof FormGroup) {
              this.markFormGroupTouched(control);
          }
      });
  }
}
