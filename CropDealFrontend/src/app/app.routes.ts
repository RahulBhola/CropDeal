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
    }
];
