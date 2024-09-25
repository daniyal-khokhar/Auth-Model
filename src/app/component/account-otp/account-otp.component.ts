import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user-services';

@Component({
  selector: 'app-account-otp',
  templateUrl: './account-otp.component.html',
  styleUrls: ['./account-otp.component.css']
})
export class AccountOtpComponent {

  public otpForm!: FormGroup;
  data: any;
  email!: string;
  isLogin: boolean = false;
  
  constructor(private formBuilder: FormBuilder 
    ,private userService: UserService,
     private router: Router, private route :ActivatedRoute
  ) { 
    this.otpForm = this.formBuilder.group({
      digit1: new FormControl('', [Validators.required]),
      digit2: new FormControl('', [Validators.required]),
      digit3: new FormControl('', [Validators.required]),
      digit4: new FormControl('', [Validators.required]),
      digit5: new FormControl('', [Validators.required]),
      digit6: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.email = queryParams['email'];
      console.log(this.email , "email");
      this.isLogin = queryParams['isForLogin']
    });
  }

onSubmit() {
  this.markFormGroupTouched(this.otpForm);

  if (this.otpForm.valid) {
    const enteredOtp = Object.values(this.otpForm.value).join('');
    console.log('Entered OTP:', enteredOtp);

    if (!this.isLogin) {
      const verification = {
        verification: enteredOtp,
        email: this.email
      };
      console.log(verification , "email");
      

      this.userService.accouuntVerify(verification)
      .then(response => {
        if (response.message === "Invalid or expired OTP.") {
          // this.toastr.error('Invalid or expired OTP.', 'Error', {
          //   positionClass: 'toast-top-right',
          // });
        } else {
          // this.toastr.success('User Saved Successfully.', 'Success', {
          //   positionClass: 'toast-top-right',
          // });
          this.router.navigate(['/login']);
        }
      })
        .catch(error => {
          // Handle any errors during OTP verification
          console.error('Error:', error);
        });
    }
  }
}

  

  getOtp() {
    return this.otpForm;
  }

  otpError() {
    return this.otpForm.invalid ? 'Please enter a valid OTP' : '';
  }

  moveToNext(nextInput: number) {
    const currentInput = nextInput - 1;

    if (this.otpForm.get(`digit${currentInput}`)?.value.length === 1) {
      const nextInputId = `otp${nextInput}`;
      document.getElementById(nextInputId)?.focus();
    }
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
