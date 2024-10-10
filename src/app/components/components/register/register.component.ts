import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false; // Loader visibility flag

  constructor(private fb: FormBuilder, private authService: AuthService, private router : Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', Validators.required], // Added username field

    });
  }

  ngOnInit(): void {}

// register.component.ts
  onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true ;
      const { email, password , username} = this.registerForm.value;
      this.authService.register(email, password, username).then(() => {
        console.log('Registration successful');
      this.isLoading = false ;
        this.router.navigate(['./chat'])
        // You may want to navigate to another page or display a success message
      }).catch(err => {
        console.error('Registration failed:', err.message || err);
        this.isLoading = false ;
        // Handle the error here (e.g., display it in the UI)
      });
    } 
  }


}
