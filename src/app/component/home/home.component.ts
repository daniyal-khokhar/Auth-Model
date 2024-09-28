import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user-services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userEmail: string | null = null;

  constructor(private userService: UserService , 
    private route:ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    const user = UserService.getLoggedUser();
    if (user) {
      this.userEmail = user.data.email;  
    }    
  }

  sendEmailWithQueryParam() {
    if (this.userEmail) {
      this.router.navigate(['/reset'], { 
        queryParams: { email: this.userEmail }
      }).then(() => {
        this.router.resetConfig(this.router.config);
      });
    }
  }
}
