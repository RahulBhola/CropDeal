import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoiceService/invoice.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-management.component.html',
  styleUrl: './invoice-management.component.css'
})
export class InvoiceManagementComponent {
  invoices: any[] = [];
  filteredInvoices: any[] = [];
  searchTerm: string = '';

  constructor(
    private router: Router,
    private invoiceService: InvoiceService
  ) {
    this.fetchInvoices();
  }

  fetchInvoices(): void {
    this.invoiceService.getAllInvoiceForAdmin().subscribe({
      next: (data) => {
        this.invoices = data.sort((a, b) => {
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        });
        this.filteredInvoices = [...this.invoices]; 
      },
      error: (err) => {
        console.error('Error fetching invoice data:', err);
      },
    });
  }
  searchInvoices(): void {
    const searchValue = this.searchTerm.trim().toLowerCase();
    this.filteredInvoices = this.invoices.filter((invoice) =>
      invoice.invoiceId.toString().toLowerCase().includes(searchValue)
    );
  }

  navigate(invoiceId: number): void {
    this.router.navigate(['/invoice'], { queryParams: { invoiceId: invoiceId } });
  }
  toggleDetails(invoiceData: any) {
    invoiceData.showDetails = !invoiceData.showDetails;
  }
}