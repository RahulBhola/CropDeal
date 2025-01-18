import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressService } from '../../services/addressService/address.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements OnInit {
  addAddressDetails: FormGroup;
  editAddressModel: FormGroup;
  showEditAddressModel = false;
  selectedAddressId: number | null = null;
  viewAddressDetails: any;
  hasAddress: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: AddressService,
    private cookieService: CookieService
  ){
    this.addAddressDetails = this.fb.group({
      country: [''],
      state: [''],
      district: [''],
      city: [''],
      pincode: [''],
      landmark: ['']
    })

    this.editAddressModel = this.fb.group({
      country1: [''],
      state1: [''],
      district1: [''],
      city1: [''],
      pincode1: [''],
      landmark1: ['']
    })
  }

  getAddress(): void {
    this.service.getAddress().subscribe({
      next: (data: any) => {
        if (data && Object.keys(data).length > 0) { 
          this.viewAddressDetails = data;
          this.hasAddress = true; 
        } else {
          this.hasAddress = false; 
        }
      },
      error: (err)=>{
        console.error('Error fetching account details: ', err);
        this.hasAddress = false;
      }
    })
  } 

  ngOnInit(): void {
    this.getAddress();
  }

  decodeToken(token: string): any {
    try{
      const payload = atob(token.split('.')[1]);
      console.log(payload);
      return JSON.parse(payload);
    }
    catch(e){
      console.error('Error decoding token:', e);
      return null;
    }
  }

  onSubmitAddAddress(): void {
    console.log(this.addAddressDetails.value);
    const token = this.cookieService.get('authToken');
    if(!token){
      alert('User not authenticated.');
    }
    const decodedToken: any = this.decodeToken(token);
    const userId = decodedToken?.nameid;

    if(!userId){
      alert("User Id not found in token");
      return;
    }
    if(this.addAddressDetails.valid){
      const addressDetails = { ...this.addAddressDetails.value, userId: userId };
      this.service.addAddress(addressDetails).subscribe({
        next: (response) =>{
          // alert(response.message || 'Profile updated successfully!');
          // this.addAddressDetails.reset();
          // this.ngOnInit();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message || 'Profile updated successfully!',
            confirmButtonText: 'OK',
          }).then(() => {
            this.addAddressDetails.reset();
            this.ngOnInit();
          });
        },
        error: (err)=>{
          // alert(err.error.message || 'An error occurred while updating the profile.');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error.message || 'An error occurred while updating the profile.',
            confirmButtonText: 'OK',
          });
        }
      });
    }
    else{
      // alert('Please fill the form correctly.');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill the form correctly.',
        confirmButtonText: 'OK',
      });
    }
  }

  onEditDetails(viewAddressDetails: any){
    this.showEditAddressModel = true;
    this.selectedAddressId = viewAddressDetails.addressId;
    console.log(this.selectedAddressId);
  }

  closeAddressModel(){
    this.showEditAddressModel = false;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  onUpdateAddress(){
    const token = this.cookieService.get('authToken');
    if (!token) {
      // alert('User not authenticated.');
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Error',
        text: 'User not authenticated.',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    const decodedToken: any = this.decodeToken(token);
    const userId = decodedToken?.nameid;
  
    if (!userId) {
      // alert('User Id not found in token.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User Id not found in token.',
        confirmButtonText: 'OK',
      });
      return;
    }
    const updateAddress = {
      country : this.editAddressModel.value.country1,
      state: this.editAddressModel.value.state1,
      district: this.editAddressModel.value.district1,
      city: this.editAddressModel.value.city1,
      pincode: this.editAddressModel.value.pincode1,
      landmark: this.editAddressModel.value.landmark1,
      userId: userId
    }
    console.log(this.editAddressModel.value);
    if(this.editAddressModel.valid && this.selectedAddressId){
      const updatedData = { ...updateAddress };
      console.log(this.selectedAddressId);
      this.service.updateAddress(this.selectedAddressId, updatedData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile updated successfully!',
            confirmButtonText: 'OK',
          }).then(() => {
            this.closeAddressModel();
            this.ngOnInit();
          });
          // alert('Profile updated successfully');
          // this.closeAddressModel();
          // this.ngOnInit();
        },
        error:(err)=>{
          // alert(err.error.message || 'An error occurred while updating the address.');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating the address Make sure you have filled all the details.',
            confirmButtonText: 'OK',
          });
        },
      });
    }
    else{
      // alert('Please fill the form correctly.');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please fill out all required fields.',
        confirmButtonText: 'OK',
      });
    }
  }

  onDelete(viewAddressDetails: any): void{
    // if(confirm('Are you sure you want to delete this account?')){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this account? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedAddressId = viewAddressDetails.addressId;
        // console.log(this.selectedAddressId);
        this.hasAddress = false;
        if(this.selectedAddressId != null){
          this.service.deleteAddress(this.selectedAddressId).subscribe({
            next: ()=>{
              // alert('Account deleted successfully');
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Bank account deleted successfully!',
                confirmButtonText: 'OK',
              });
            },
            error: (err)=>{
              console.error('Error deleting address details', err);
            }
          })
        }
      }
      // else{
      //   // alert("Id not found");
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Error',
      //     text: 'Address details are missing. Please try again.',
      //     confirmButtonText: 'OK',
      //   });
      // }
    });
  }
}
