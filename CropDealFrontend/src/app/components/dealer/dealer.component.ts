import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FarmerService } from '../../services/farmerService/farmer.service';

@Component({
  selector: 'app-dealer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dealer.component.html',
  styleUrl: './dealer.component.css'
})
export class DealerComponent {
  crops: any[] = [];

  constructor(private farmerService: FarmerService){
    this.farmerService.getAllFarmerCrops().subscribe({
      next: (data)=>{
        this.crops = data;
      },
      error: (err)=>{
        console.error('Error fetching crops:', err);
      }
    })
  }
}
