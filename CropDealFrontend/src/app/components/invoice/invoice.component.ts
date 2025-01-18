import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoiceService/invoice.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  dealerInfo: any = '';
  orderTransactionId: number = 0;
  invoiceId: number = 0;
  // firstName: string = '';
  // lastName: string = '';

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    // Get query parameters
    this.route.queryParams.subscribe(params => {
      this.orderTransactionId = +params['orderTransactionId'];  // Convert to number
      console.log(this.orderTransactionId);
      this.invoiceId = +params['invoiceId'];  // Convert to number
      console.log(this.invoiceId);

      // Fetch invoice details
      this.getInvoiceDetails(this.orderTransactionId, this.invoiceId);
    });
    // this.getProfileData(1007);
  }

  getInvoiceDetails(orderTransactionId: number, invoiceId: number): void {
    this.invoiceService.getInvoiceDetails(++invoiceId).subscribe({
      next: (data) => {
        this.dealerInfo = data;
        console.log(this.dealerInfo);
      },
      error: (err) => {
        console.error('Error fetching invoice details', err);
      },
    });
  }

  // getProfileData(orderId: number): void {
  //   this.invoiceService.getInvoiceDetails(orderId).subscribe({
  //     next: (data) => {
  //       this.dealerInfo = data;
  //       console.log(this.dealerInfo);
  //       // const nameParts = this.dealerInfo.billingTo.split('_');
  //       // this.firstName = nameParts[0];
  //       // this.lastName = nameParts.length > 1 ? nameParts[1] : '';
  //     },
  //     error: (err) => {
  //       console.error('Error fetching user details', err);
  //     },
  //   });
  // }

  public downloadPDF(){
    return xepOnline.Formatter.Format('content',{render:'download'});
  }
  
}