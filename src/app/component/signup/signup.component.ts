import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user-services';
import { RolesService } from 'src/app/services/role-service';
import { HttpConfig } from 'src/app/services/http-config';
import { WrapHttpService } from 'src/app/services/wrap-http.service';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html', 
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signUpForm!: FormGroup;
  email!: string;
  
  constructor(private fb: FormBuilder ,
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
      return;
    }
    const user = {
      ...this.signUpForm.value, 
       role: "client"
    };

    const email = user.email;
    console.log(email);

    this.userService.signUp(user).subscribe(
      (response) => {
        console.log(response);
        if (response.statusCode === 500) {
          alert("error")
        }
        this.router.navigate(['/accountotp'], { queryParams: { email } });
      //   this.toastr.info('Please Check Email for Otp.', 'Success',{
      //     positionClass: 'toast-top-right',
      //  });
        console.log('signUp successful:', response);
      },
      (error) => {
        console.error('Signup error:', error);
      })
  }

  tologinpage(){
    this.router.navigate(['p-login']);
  }
}

