import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankService } from '../../services/bankService/bank.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  isFlipped = false;
  isEditMode: boolean = false; 
  selectedAccountId: number | null = null; 
  
  addBankAccount: FormGroup;
  viewBankDetails: any;
  // bankInfo = {
    
  //     accountId: 0,
  //     accountNumber: 0,
  //     bankName: "",
  //     ifsc:""
  // } ;

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
  ngOnInit(): void {
    this.getAccountData();
  }

  constructor(
    private bankService: BankService, 
    private fb: FormBuilder, 
    private cookieService: CookieService
  ){
    this.decodeToken(this.cookieService.get('authToken'));
    this.addBankAccount = this.fb.group({
      accountNumber: ['', Validators.required],
      ifsc: ['',  Validators.required],
      bankName: ['', Validators.required],
    });
  };

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

  onSubmit(): void {
    const token = this.cookieService.get('authToken');
    if(!token){
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'User not authenticated.',
        confirmButtonText: 'OK',
      });
      // alert('User not authenticated.');
      return;
    }
    const decodedToken: any = this.decodeToken(token);
    const userId = decodedToken?.nameid;

    if(!userId){
      // alert("User Id not found in token.");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User ID not found in token.',
        confirmButtonText: 'OK',
      });
      return;
    }
    const BankAccountDetails = {
      accountNumber: this.addBankAccount.value.accountNumber,
      ifsc: this.addBankAccount.value.ifsc,
      bankName: this.addBankAccount.value.bankName,
      userId: userId
    }
    if(this.addBankAccount.valid){
      this.bankService.addBankAccount(BankAccountDetails).subscribe({
        next: (response: any) =>{
          if(response){
            // alert('Bank account added successfully!');
            // this.addBankAccount.reset();
            // this.isFlipped = false;
            // this.ngOnInit();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Bank account added successfully!',
              confirmButtonText: 'OK',
            }).then(() => {
              this.addBankAccount.reset();
              this.isFlipped = false;
              this.ngOnInit();
            });
          }
        },
        error: (error)=>{
          console.error('Failed to add bank account: ', error);
          // alert('A bank account is already linked to your profile.');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'A bank account is already linked to your profile.',
            confirmButtonText: 'OK',
          });
        }
      });
    }
    else{
      // alert('Please fill out all required fields.');
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill out all required fields.',
        confirmButtonText: 'OK',
      });
    }
  }

  onEdit(viewBankDetails: any): void {
    this.isFlipped = true;
    this.isEditMode = true;
    this.selectedAccountId = viewBankDetails.accountId;
    this.ngOnInit();
    console.log(this.selectedAccountId);
    
    this.addBankAccount.patchValue({
      accountNumber: viewBankDetails.accountNumber,
      ifsc: viewBankDetails.ifsc,
      bankName: viewBankDetails.bankName,
    });
  }

  goBack(){
    this.isFlipped = false;
    this.isEditMode = false; 
  }
  

  onUpdate(): void {
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
  
    const updatedAccountDetails = {
      accountNumber: this.addBankAccount.value.accountNumber,
      ifsc: this.addBankAccount.value.ifsc,
      bankName: this.addBankAccount.value.bankName,
      userId: userId,
    };
  
    if (this.addBankAccount.valid && this.selectedAccountId) {
      const updatedBankAccount = { ...updatedAccountDetails };
      this.bankService.updateBankAccount( this.selectedAccountId, updatedBankAccount).subscribe({
        next: (response: any) => {
          if (response) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Bank account updated successfully!',
              confirmButtonText: 'OK',
            }).then(() => {
              this.addBankAccount.reset();
              this.isFlipped = false;
              this.isEditMode = false;
              this.ngOnInit();
            });
            // alert('Bank account updated successfully!');
            // this.addBankAccount.reset();
            // this.isFlipped = false;
            // this.isEditMode = false; 
            // this.ngOnInit();
          }
        },
        error: (error) => {
          // console.error('Failed to update bank account: ', error);
          // alert('An error occurred. Please try again.');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred. Please try again.',
            confirmButtonText: 'OK',
          });
        },
      });
    } else {
      // alert('Please fill out all required fields.');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please fill out all required fields.',
        confirmButtonText: 'OK',
      });
    }
  }

  onDelete(viewBankDetails: any): void{
    // if(confirm('Are you sure you wan to delete this account?')){
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
        this.selectedAccountId = viewBankDetails.accountId;
        if(this.selectedAccountId!=null){
          this.bankService.deleteBankAccount(this.selectedAccountId).subscribe({
            next: () =>{
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Bank account deleted successfully!',
                confirmButtonText: 'OK',
              }).then(() => {
                this.addBankAccount.reset();
                this.isFlipped = false;
                this.isEditMode = false;
                this.ngOnInit();
              });
              // alert('Account deleted successfully');
              // this.addBankAccount.reset();
              // this.isFlipped = false;
              // this.isEditMode = false;
              // this.ngOnInit();
            },
            error: (err)=>{
              console.error('Error deleting bank account: ', err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred when deleting account. Please try again.',
                confirmButtonText: 'OK',
              });
            },
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Account details are missing. Please try again.',
            confirmButtonText: 'OK',
          });
        }
      }
    });
  }
}
