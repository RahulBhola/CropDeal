import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FarmerService } from '../../services/farmerService/farmer.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-farmer',
  standalone: true,
  imports: [CommonModule, FormsModule ,ReactiveFormsModule],
  templateUrl: './farmer.component.html',
  styleUrl: './farmer.component.css'
})
export class FarmerComponent implements OnInit {
  addFarmerDetails!: FormGroup;
  isSubmitted: boolean = false;
  imageUrl: string | null = null; 
  image:string[] = [];
  previewImageUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private service: FarmerService,
    private cookieService: CookieService
  ){}
  

  ngOnInit(): void {
    this.decodeToken(this.cookieService.get('authToken'));
    this.addFarmerDetails = this.formBuilder.group({
      cropType: ['', [Validators.required]],
      cropName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      cropQuantity: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Ensure numeric input
      cropPricePerKg: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Numeric with up to 2 decimals
    });
  }

  onSavingCropDetails(){
    this.isSubmitted = true;
    if(this.addFarmerDetails.invalid){
      return;
    }
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
    const cropDetails = {
      type: this.addFarmerDetails.value.cropType,
      cropName: this.addFarmerDetails.value.cropName,
      description: this.addFarmerDetails.value.description,
      availableQuantity: this.addFarmerDetails.value.cropQuantity,
      pricePerKg: this.addFarmerDetails.value.cropPricePerKg,
      userId: userId,
      imageData:this.image[1]
    };

    this.service.addCropDetails(cropDetails).subscribe({
      next: (response: any)=>{
        if(response){
          // console.log(this.addFarmerDetails.value);
          console.log('Details Added: ', response);
          alert("Crop Added Successfully");
          this.addFarmerDetails.reset();
          this.previewImageUrl = '';
        }
      },
      error:(err)=>{
        console.log(cropDetails);
        console.log('Adding Crop Details failed: ', err || 'An error occured');
        alert(err.error?.message);
      },
    });
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

  private previewImage(file: File): void {
    const reader = new FileReader();
  
    reader.onload = (e: any) => {
      this.image = e.target.result.split("base64,");// Set the preview URL directly
      this.previewImageUrl = e.target.result;
      console.log('Base64 Image String:', this.image[1]);
    };
  
    reader.onerror = (error) => {
      console.error('Error reading the file:', error);
      alert('An error occurred while uploading the image. Please try again.');
    };
  
    reader.readAsDataURL(file); // Convert file to Base64 URL
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg']; // Allowed file types
      if (!validFileTypes.includes(file.type)) {
        alert('Invalid file type. Please select a PNG, JPG, or JPEG image.');
        return;
      }
  
      this.previewImage(file);
  }
}}