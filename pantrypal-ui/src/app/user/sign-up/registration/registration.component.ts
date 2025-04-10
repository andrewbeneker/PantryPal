import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  imports:[CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
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
  
      // Map "password" to "passwordHash"
      const userPayload = {
        username: formData.username,
        email: formData.email,
        passwordHash: formData.password // match the backend DTO
      };
  
      this.userService.register(userPayload).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! You can now log in.';
          this.registerForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Registration failed. Username may already exist.';
          console.error(err);
        }
      });
    }
  }}