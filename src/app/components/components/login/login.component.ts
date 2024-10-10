import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false; // Loader visibility flag


  constructor(private fb: FormBuilder,
     private authService: AuthService,
      private router : Router,
    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {}

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true; // Show loader
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .then(() => {
          console.log('Login successful');
          this.isLoading = false; // Hide loader on success

          this.router.navigate(['/chat']); 
          // Redirect to the desired page after successful login
        })
        .catch(err => {
          console.error('Login failed', err);
        this.isLoading = false; // Hide loader on error

          // Handle login errors (e.g., display an error message)
        });
    }
  }


  
  
}
