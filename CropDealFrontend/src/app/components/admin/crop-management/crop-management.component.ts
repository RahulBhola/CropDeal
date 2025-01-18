import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FarmerService } from '../../../services/farmerService/farmer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crop-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crop-management.component.html',
  styleUrl: './crop-management.component.css'
})
export class CropManagementComponent {
  crops: any[] = [];
    showEditModal = false;
    editForm: FormGroup;
    selectedCropId: number | null = null;
    image: string[] = [];
    previewImageUrl: string = '';
  
    constructor(
      private farmerService: FarmerService, 
      private fb: FormBuilder
    ){
      this.editForm = this.fb.group({
        cropName: ['', Validators.required],
        availableQuantity: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        pricePerKg: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        description: ['', Validators.required],
        imageData: ['']
      });
  
      this.farmerService.getAllFarmerCrops().subscribe({
        next: (data)=>{
          this.crops = data;
        },
        error: (err)=>{
          console.error('Error fetching crops:', err);
        }
      })
    } 

    onApproveCrop(crop: any): void {
      Swal.fire({
        title: 'Crop Approved!',
        text: `Crop "${crop.cropName}" has been approved successfully.`,
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        this.crops = this.crops.filter(c => c.cropId !== crop.cropId);
      });
    }
    
    onRejectCrop(crop: any): void {
      Swal.fire({
        title: 'Crop Rejected!',
        text: `Crop "${crop.cropName}" has been rejected.`,
        icon: 'error',
        confirmButtonText: 'OK',
      }).then(() => {
        this.crops = this.crops.filter(c => c.cropId !== crop.cropId);
      });
    }    
}
