import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  passwordVisible: boolean = false;
  isSubmitted: boolean = false;
  isActive: boolean = false;

  registerFormData!: FormGroup;
  loginFormData!: FormGroup;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  constructor(
    private formBuilder: FormBuilder,
    private service: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerFormData = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("^[A-Za-z]+(?: [A-Za-z]+)*$")]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      password: ['',[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
      confirmPassword: [''],
      role: ['', Validators.required]
    },{validators:this.passwordMatchValidator});

    this.loginFormData = this.formBuilder.group({
      loginEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      loginPassword: ['',[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
      loginRole: ['', Validators.required]
    })
  }
  passwordMatchValidator: ValidatorFn=(control:AbstractControl):null =>{
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if(password && confirmPassword && password.value != confirmPassword.value){
      confirmPassword?.setErrors({passwordMismatch:true})
    }
    else{
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  hasDisplayableRegisterError(controlName: string): Boolean {
    const control = this.registerFormData.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched));
  }

  hasDisplayableLoginError(controlName: string): Boolean {
    const control = this.loginFormData.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched));
  }

  toggleForm(state: boolean):void{
    this.isActive = state;
  }

  onRegister() {
    this.isSubmitted = true;
  
    if (this.registerFormData.invalid) {
      return;
    }
  
    this.service.register(this.registerFormData.value).subscribe({
      next: (response: any) => {
        if (response) {
          console.log(this.registerFormData.value);
          console.log('Registration successful: ', response);
          this.isActive = false;
          this.registerFormData.reset(); 
          this.isSubmitted = false; 
        }
      },
      error: (err) => {
        console.log('Registration failed: ', err || 'An error occurred');
        alert(err.error?.message || 'User already exists. Please login');
      },
    });
  }
  

  onLogin() {
    this.isSubmitted = true;

    if(this.loginFormData.invalid){
      return;
    }
    const credentials = {
      email: this.loginFormData.value.loginEmail,
      password: this.loginFormData.value.loginPassword,
      role: this.loginFormData.value.loginRole
    };
    // console.log('Login Credentials:', credentials);
    this.service.login(credentials).subscribe({
      next: (response: any)=>{
        // console.log('Login successful: ', response);
        this.cookieService.set('authToken', response.token);
        this.cookieService.set('userRole', credentials.role);
        if(credentials.role == 'Farmer'){
          this.router.navigate(['/farmer']);
        }
        else if(credentials.role == 'Dealer'){
          this.router.navigate(['/dealer']);
        }
        window.location.reload(); 
      },
      error: (error)=>{
        console.log('Login failed ', error || 'An error occurred');
        alert(error.error?.message || 'Invalid credentials, please try again');
      },
    });
  }
}