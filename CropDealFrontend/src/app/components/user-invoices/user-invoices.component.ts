import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../../services/invoiceService/invoice.service';

@Component({
  selector: 'app-user-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-invoices.component.html',
  styleUrl: './user-invoices.component.css'
})
export class UserInvoicesComponent {
  invoices: any[] = [];

  constructor(
    private router: Router,
    private invoice: InvoiceService
  ) {
    this.invoice.getAllInvoice().subscribe({
      next: (data)=>{
        this.invoices = data.sort((a, b) => {
          return new Date(b.invoice.orderDate).getTime() - new Date(a.invoice.orderDate).getTime();
        });
      },
      error: (err)=>{
        console.error('Error fetching invoice data: ', err);
      }
    })
  }

  navigate(invoiceId: number){
    this.router.navigate(['/invoice'], { queryParams: { invoiceId: invoiceId } });
  }

  toggleDetails(invoiceData: any) {
    invoiceData.showDetails = !invoiceData.showDetails;
  }
}
