import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FarmerComponent } from './components/farmer/farmer.component';
import { DealerComponent } from './components/dealer/dealer.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ViewCropComponent } from './components/view-crop/view-crop.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentComponent } from './components/payment/payment.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login/admin-login.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CropManagementComponent } from './components/admin/crop-management/crop-management.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { InvoiceManagementComponent } from './components/admin/invoice-management/invoice-management.component';
import { UserInvoicesComponent } from './components/user-invoices/user-invoices.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard]
    },
    {
        path: 'home',
        component: HomeComponent,
        // canActivate: [authGuard]
    },
    {
        path: 'farmer',
        component: FarmerComponent,
        canActivate: [authGuard]
    },
    {
        path: 'dealer',
        component: DealerComponent,
        canActivate: [authGuard]
    },
    {
        path: 'order-history',
        component: OrderHistoryComponent
    },
    {
        path: 'view-crop',
        component: ViewCropComponent
    }, 
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path:'payment',
        component: PaymentComponent
    },
    {
        path: 'invoice',
        component: InvoiceComponent
    },
    {
        path: 'user-invoice',
        component: UserInvoicesComponent
    },
    {
        path: 'admin-login',
        component: AdminLoginComponent
    },
    {
        path: 'admin-home',
        component: AdminHomeComponent
    },
    {
        path: 'about-us',
        component: AboutUsComponent
    },
    {
        path: 'crop-management',
        component: CropManagementComponent
    },
    {
        path: 'user-management',
        component: UserManagementComponent
    },
    {
        path: 'invoice-management',
        component: InvoiceManagementComponent
    }
];
