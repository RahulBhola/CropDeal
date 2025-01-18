import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeService } from '../../services/paymentService/stripe.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DealerService } from '../../services/dealerService/dealer.service';
import { InvoiceService } from '../../services/invoiceService/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  totalPrice: number = 0;
  totalQuantity: number = 0;
  stripe: any;
  elements: any;
  card: any;
  clientSecret: string = '';
  isProcessing: boolean = false; 
  cartDetails: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private stripeService: StripeService,
    private http: HttpClient,
    private cookieService: CookieService,
    private dealerService: DealerService,
    private invoiceService: InvoiceService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.totalPrice = Number(params['totalPrice']);
      this.totalQuantity = Number(params['totalQuantity']);
    });

    this.dealerService.getCartDetails().subscribe((data: any[]) => {
      this.cartDetails = data;
    });
    this.loadStripe();
  }

  loadStripe(): void {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        this.stripe = (window as any).Stripe(
          'pk_test_51QXbaWK03k9mYtIQrU8uL2RPzuasySFINefMLkrzUPLAfD1KewxYOszJ7UOlPbqdUChjRr8oiYcdHC9ZRu2uUx8e00dkj6sql4'
        );
        this.elements = this.stripe.elements();
        this.card = this.elements.create('card');
        this.card.mount('#card-element');
      };
      window.document.body.appendChild(script);
    }
  }

  // async makePayment(): Promise<void> {
  //   if (this.isProcessing) return; // Prevent multiple submissions
  //   this.isProcessing = true; // Disable button

  //   // Request payment intent
  //   this.http
  //     .post<{ clientSecret: string }>(
  //       'http://localhost:5142/api/Payments/create-payment-intent',
  //       { amount: this.totalPrice }
  //     )
  //     .subscribe(
  //       async (response) => {
  //         this.clientSecret = response.clientSecret;

  //         // Confirm payment
  //         const result = await this.stripe.confirmCardPayment(
  //           this.clientSecret,
  //           {
  //             payment_method: {
  //               card: this.card,
  //               billing_details: {
  //                 name: 'Customer Name',
  //               },
  //             },
  //           }
  //         );

  //         // Handle result
  //         if (result.error) {
  //           alert(result.error.message);
  //         } else if (result.paymentIntent.status === 'succeeded') {
  //           alert('Payment successful!');
  //         }
  //         this.isProcessing = false; // Re-enable button
  //       },
  //       (error) => {
  //         alert('Payment failed. Please try again.');
  //         this.isProcessing = false; // Re-enable button on failure
  //       }
  //     );
  // }

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

  makePayment(){
    const token = this.cookieService.get('authToken');
    if(!token){
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
    const userEmail = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];;

    if(!userId){
      // alert("User Id not found in token.");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User Id not found in token.',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (this.isProcessing) return;
    this.isProcessing = true; 

    this.stripeService.createPaymentIntent(this.totalPrice).subscribe(
        async (response) => {
          this.clientSecret = response.clientSecret;

          const result = await this.stripe.confirmCardPayment(this.clientSecret, {
            payment_method: {
              card: this.card,
              billing_details: {
                name: '${userId.FirstName}',
              },
            },
          });
          if (result.error) {
            // alert(result.error.message);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `${result.error.message}`,
              confirmButtonText: 'OK',
            });
            return;
          } 
          else if (result.paymentIntent.status === 'succeeded') {
            // alert('Payment successful!');
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Payment Successfull!',
              confirmButtonText: 'OK'
            });

            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 7); 

            const formattedDeliveryDate = deliveryDate.toISOString().split('T')[0]; // "yyyy-mm-dd"

            const orderTransactionData = {
              OrderQuantity: this.totalQuantity, 
              TotalPrice: this.totalPrice,
              DeliveryDate: formattedDeliveryDate, 
              // InvoiceId: response.invoiceId, 
              CropId: this.cartDetails.map(crop => crop.cropId),
              UserId: userId,
            };
            this.stripeService.saveOrderTransaction(orderTransactionData).subscribe(
              (response) => {
                // console.log('Order transaction saved successfully:', response);
                const { orderTransactionId, invoiceId } = response;
                // console.log('OrderTransactionId:', orderTransactionId, 'InvoiceId:', invoiceId);

                // console.log(`user email is ${userEmail}`);
                // console.log(`user invoice id is ${invoiceId}`);

                this.invoiceService.sendInvoiceEmail(userEmail, invoiceId) 
                .subscribe(
                  () => {
                    // console.log('Invoice email sent successfully.');
                    this.router.navigate(['/invoice'], { 
                      queryParams: { orderTransactionId: orderTransactionId, invoiceId: invoiceId }
                    });
                  },
                  (error) => {
                    console.error('Failed to send invoice email:', error);
                  }
                );
                // this.router.navigate(['/invoice'], { 
                //   queryParams: { orderTransactionId: orderTransactionId, invoiceId: invoiceId }
                // });
              },
              (error) => {
                console.error('Failed to save order transaction:', error);
              }
            );
          }
          this.isProcessing = false;
        },
        (error) => {
          // alert('Payment failed. Please try again.');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Payment failed. Please try again.',
            confirmButtonText: 'OK'
          });
          this.isProcessing = false; 
        }
      );
  }
}

