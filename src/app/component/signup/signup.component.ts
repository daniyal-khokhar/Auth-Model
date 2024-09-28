import { Component , Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user-services';
import { RolesService } from 'src/app/services/role-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html', 
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;
  signUpForm!: FormGroup;
  email!: string;
  
  constructor(private fb: FormBuilder , @Inject(ToastrService) private toastr: ToastrService ,
    private router: Router, private route: ActivatedRoute ,
    private userService: UserService , private roleService: RolesService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      this.email = queryParams['email'];
      console.log(this.email , "email");
       this.signUpForm = this.fb.group({
        name: ['', Validators.required],
        fatherName: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
        email: ['', [Validators.required, Validators.email]], 
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator });
    });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')!.value;
    const confirmPassword = form.get('confirmPassword')!.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (!this.signUpForm.valid) {
      this.signUpForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields.', 'Validation Error', {
        positionClass: 'toast-top-right',
      });
      return;
    }
  
    // Prepare the user object for submission
    const user = {
      ...this.signUpForm.value,
      role: "client"
    };
  
    const email = user.email;
    console.log(email);
  
    // Start loading
    this.isLoading = true;
  
    // Make the signup request
    this.userService.signUp(user).subscribe(
      (response) => {
        console.log(response);
  
        // Check for a specific status code, like 500, to handle errors
        if (response?.error === "Internal server error") {
          this.toastr.error('An error occurred during sign-up. Please try again.', 'Error', {
            positionClass: 'toast-top-right',
          });
          this.isLoading = false;  // Stop loading on error
          return;
        }
  
        // Success: Navigate to the OTP page and show a success message
        this.router.navigate(['/accountotp'], { queryParams: { email } });
        this.isLoading = false;  // Stop loading on success
        this.toastr.info('Please check your email for the OTP.', 'Success', {
          positionClass: 'toast-top-right',
        });
  
        console.log('Sign-up successful:', response);
      },
      (error) => {

        console.error('Sign-up error:', error);
        this.toastr.error('Signup failed. Please try again.', 'Error', {
          positionClass: 'toast-top-right',
        });
        this.isLoading = false;  // Stop loading on error
      }
    );
  }
  
}

