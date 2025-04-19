import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  imports:[CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
  
      const userPayload = {
        username: formData.username,
        email: formData.email,
        passwordHash: formData.password
      };
  
      this.userService.register(userPayload).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Redirecting...';
          this.registerForm.reset();
          // Auto-login after successful registration
          const loginPayload = {
            username: userPayload.username,
            password: formData.password
          };
  
          this.userService.login(loginPayload).subscribe({
            next: (response) => {
              localStorage.setItem('token', response.token);
              // Navigate to dashboard after short delay
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 1000);
            },
            error: (err) => {
              this.errorMessage = 'Auto-login failed. Please log in manually.';
              console.error(err);
            }
          });
        },
        error: (err) => {
          this.errorMessage = 'Registration failed. Username may already exist.';
          console.error(err);
        }
      });
    }
  }
}