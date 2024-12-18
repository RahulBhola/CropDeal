import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/authService/auth.service';
import { BankService } from '../../services/bankService/bank.service';
import { AddressComponent } from "../address/address.component";
import { AddressService } from '../../services/addressService/address.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CardComponent, ReactiveFormsModule, AddressComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
  tabs: any = [
    { id: 1, label: 'Edit Profile' },
    { id: 2, label: 'Add Address' },
    { id: 3, label: 'Add Bank Account' },
    { id: 4, label: 'Payment' }
  ];
  selectedTab: number = 1;
  selectTab(tabid: number) {
    console.log(tabid);
    this.selectedTab = tabid;
  }
  
  showEditAccountDetailsModel = false;
  onEditDetails(){
    this.showEditAccountDetailsModel = true;
  }
  closeEditAccountDetailsModel(){
    this.showEditAccountDetailsModel = false;
  }
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  editAccountForm: FormGroup;
  constructor(
    private fb: FormBuilder, 
    private service: AuthService, 
    private bankService: BankService,
    private addressService: AddressService,
    private cookieService: CookieService
  ){
    this.editAccountForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("^[A-Za-z ]+(?: [A-Za-z]+)*$")]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.pattern("^[A-Za-z ]+(?: [A-Za-z]+)*$")]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]],
      phoneNumber: ['']
    })
    this.ngOnInit();
  }
  
  userDetails: any;
  firstName: string = '';
  lastName: string = '';

  getProfileData(): void {
    this.service.getUserDetails().subscribe({
      next: (data) => {
        this.userDetails = data;
        const nameParts = this.userDetails.userName.split('_');
        this.firstName = nameParts[0];
        this.lastName = nameParts.length > 1 ? nameParts[1] : '';
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      },
    });
  }

  viewBankDetails: any;

  getAccountData(): void{
    this.bankService.getBankDetails().subscribe({
      next: (data:any)=>{
        this.viewBankDetails = data;
        console.log(data);
        console.log(this.viewBankDetails);
      },
      error: (err)=>{
        console.error('Error fetching account details: ', err);
      }
    })
  }

  viewAddressDetails: any;
  getAddress(): void {
    this.addressService.getAddress().subscribe({
      next: (data: any) => {
        this.viewAddressDetails = data;
      },
      error: (err)=>{
        console.error('Error fetching account details: ', err);
      }
    })
  } 
  userRole: string | null = null;

  ngOnInit(): void {
    this.userRole = this.cookieService.get('userRole');
    this.getProfileData();
    this.getAccountData();
    this.getAddress();
  }

  onSubmitEdit(): void {
    console.log(this.editAccountForm.value);
    if(this.editAccountForm.valid){
      const updatedData = { ...this.editAccountForm.value };
      this.service.updateProfile(updatedData).subscribe({
        next: (response) =>{
          alert(response.message || 'Profile updated successfully!');
          this.closeEditAccountDetailsModel();
          this.ngOnInit();
        },
        error: (err)=>{
          alert(err.error.message || 'An error occurred while updating the profile.');
        }
      });
    }
    else{
      alert('Please fill the form correctly.');
    }
  }
}