import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankService } from '../../services/bankService/bank.service';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(private bankService: BankService, private fb: FormBuilder, private cookieService: CookieService){
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
      alert('User not authenticated.');
      return;
    }
    const decodedToken: any = this.decodeToken(token);
    const userId = decodedToken?.nameid;

    if(!userId){
      alert("User Id not found in token.");
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
            alert('Bank account added successfully!');
            this.addBankAccount.reset();
            this.isFlipped = false;
            this.ngOnInit();
          }
        },
        error: (error)=>{
          console.error('Failed to add bank account: ', error);
          alert('A bank account is already linked to your profile.');
        }
      });
    }
    else{
      alert('Please fill out all required fields.');
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
      alert('User not authenticated.');
      return;
    }
  
    const decodedToken: any = this.decodeToken(token);
    const userId = decodedToken?.nameid;
  
    if (!userId) {
      alert('User Id not found in token.');
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
            alert('Bank account updated successfully!');
            this.addBankAccount.reset();
            this.isFlipped = false;
            this.isEditMode = false; 
            this.ngOnInit();
          }
        },
        error: (error) => {
          console.error('Failed to update bank account: ', error);
          alert('An error occurred. Please try again.');
        },
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }

  onDelete(viewBankDetails: any): void{
    if(confirm('Are you sure you wan to delete this account?')){
      this.selectedAccountId = viewBankDetails.accountId;
      if(this.selectedAccountId!=null){
        this.bankService.deleteBankAccount(this.selectedAccountId).subscribe({
          next: () =>{
            alert('Account deleted successfully');
            this.addBankAccount.reset();
            this.isFlipped = false;
            this.isEditMode = false;
            this.ngOnInit();
          },
          error: (err)=>{
            console.error('Error deleting bank account: ', err);
          }
        })
      }
    }
  }
}
