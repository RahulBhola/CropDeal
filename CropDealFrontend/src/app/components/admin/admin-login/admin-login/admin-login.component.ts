import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/adminService/admin.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {
  adminLogin!: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: AdminService,
    private cookieService: CookieService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.adminLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      password: ['',[Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$")]]
    })
  }

  hasDisplayableLoginError(controlName: string): Boolean {
    const control = this.adminLogin.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched));
  }

  onAdminLogin(){
    // console.log(this.adminLogin.value);
    this.service.login(this.adminLogin.value).subscribe({
      next: (response: any)=>{
        this.cookieService.set('authToken', response.token);
        window.location.replace('/home');
      },
      error: ()=>{
        // console.log('Login failed ', error || 'An error occurred');
        // alert(error.error?.message || 'Invalid credentials, please try again');
        Swal.fire('Error!', 'Invalid credentials, please try again', 'error');
      },
    });
  }
}
