import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  // userRole: string | null = null;

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
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("^[A-Za-z ]+(?: [A-Za-z]+)*$")]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("^[A-Za-z ]+(?: [A-Za-z]+)*$")]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      password: ['',[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
      confirmPassword: [''],
      role: ['', Validators.required]
    },{validators:this.passwordMatchValidator});

    this.loginFormData = this.formBuilder.group({
      loginEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      loginPassword: ['',[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]],
      // loginRole: ['', Validators.required]
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
      Swal.fire('Error!', 'Failed to register user.', 'error');
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
        // console.log('Registration failed: ', err || 'An error occurred');
        // alert(err.error.message || 'User already exists. Please login');
        Swal.fire('Error!', 'Failed to register user.', 'error');
      },
    });
  }
  userRole: string | null = null;
  decodedToken(token: string):any {
    try{
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    }
    catch(error){
      console.error('Error decoding token: ', error);
      return null;
    }
  }

  fetchUserRole(){
    const token = this.cookieService.get('authToken');
    if(!token){
      console.error('User not authenticated');
      return;
    }
    const decodedToken = this.decodedToken(token);
    if(!decodedToken){
      console.error('Invalid or missing token');
      return;
    }
    this.userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }
  
  onLogin() {
    this.isSubmitted = true;

    if(this.loginFormData.invalid){
      Swal.fire('Error!', 'Failed to login user. Please check your login credentials', 'error');
      return;
    }
    const credentials = {
      email: this.loginFormData.value.loginEmail,
      password: this.loginFormData.value.loginPassword
      // role: this.loginFormData.value.loginRole
    };
    // console.log('Login Credentials:', credentials);
    this.service.login(credentials).subscribe({
      next: (response: any)=>{
        // console.log('Login successful: ', response);
        this.cookieService.set('authToken', response.token);
        this.router.navigate(['/home']).then(() => {
          window.location.reload(); // Force reload to update navbar
        });
      },
      error: (error)=>{
        // console.log('Login failed ', error || 'An error occurred');
        // alert(error.error?.message || 'Invalid credentials, please try again');
        Swal.fire('Error!', 'Your account has been Inactivated by admin. Please contact Admin to activate it.', 'error');
      },
    });
  }

  navigateToAdminLogin() {
    this.router.navigate(['/admin-login']);
  }
}