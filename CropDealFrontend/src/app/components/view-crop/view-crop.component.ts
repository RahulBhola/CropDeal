import { Component } from '@angular/core';
import { FarmerService } from '../../services/farmerService/farmer.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-crop',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-crop.component.html',
  styleUrl: './view-crop.component.css'
})
export class ViewCropComponent {
  crops: any[] = [];
  showEditModal = false;
  editForm: FormGroup;
  selectedCropId: number | null = null;
  image: string[] = [];
  previewImageUrl: string = '';

  constructor(private farmerService: FarmerService, private fb: FormBuilder){
    this.editForm = this.fb.group({
      cropName: ['', Validators.required],
      availableQuantity: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      pricePerKg: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: ['', Validators.required],
      imageData: ['']
    });

    this.farmerService.getCropDetails().subscribe({
      next: (data)=>{
        this.crops = data;
      },
      error: (err)=>{
        console.error('Error fetching crops:', err);
      }
    })
  } 

  // private previewImage(file: File): void{
  //   const reader = new FileReader();

  //   reader.onload = (e: any)=>{
  //     this.image = e.target.result.split("base64,");
  //     this.previewImage = e.target.result;
  //     console.log('Base64 image: ', this.image[1]);
  //   };

  //   reader.onerror = (error) =>{
  //     console.error('Error reading the file: ', error);
  //     alert('An error occurred while uploading the image');
  //   }
  //   reader.readAsDataURL(file);
  // }
  private previewImage(file: File): void {
    const reader = new FileReader();
  
    reader.onload = (e: any) => {
      const base64String = e.target.result.split('base64,')[1]; // Extract Base64 data
      this.image = base64String;
      this.previewImageUrl = e.target.result; // Set preview URL
      this.editForm.patchValue({ imageData: base64String }); // Update form
    };
  
    reader.onerror = (error) => {
      console.error('Error reading the file:', error);
      alert('An error occurred while uploading the image');
    };
  
    reader.readAsDataURL(file);
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if(file){
      const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if(!validFileTypes.includes(file.type)){
        alert('Invalid file type. Please select a PNG, JPG, or JPEG image.');
        return;
      }
      this.previewImage(file);
    }
  }

  onEditCrop(crop: any): void {
    this.showEditModal = true;
    this.selectedCropId = crop.cropId;

    this.editForm.patchValue({
      cropName: crop.cropName,
      availableQuantity: crop.availableQuantity,
      pricePerKg: crop.pricePerKg,
      description: crop.description,
      imageData: this.image[1]
    });
  }

  // Method to close the modal
  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedCropId = null;
    this.editForm.reset();
  }

  // Method to stop click propagation
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  onSubmitEdit(): void {
    if(this.editForm.valid && this.selectedCropId){
      const updatedCrop = { ...this.editForm.value };
      this.farmerService.updateCropDetails(this.selectedCropId, updatedCrop).subscribe({
        next: ()=>{
          alert('Crop updated successfully!');
          this.closeEditModal();
          this.farmerService.getCropDetails().subscribe(data => {this.crops = data});
        },
        error: (err)=>{
          console.error('Error updating crop:', err);
        }
      });
    }
  }
  
  onDeleteCrop(cropId: number): void {
    if (confirm('Are you sure you want to delete this crop?')) {
      // Call the service method to delete the crop
      this.farmerService.deleteCrop(cropId).subscribe({
        next: () => {
          alert('Crop deleted successfully.');
          this.crops = this.crops.filter(crop => crop.cropId !== cropId); // Remove from UI
        },
        error: (err) => {
          console.error('Error deleting crop:', err);
        }
      });
    }
  }
}