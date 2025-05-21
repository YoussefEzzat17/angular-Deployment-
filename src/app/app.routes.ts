import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ForgetPasswordVerificationComponent } from './component/forget-password-verification/forget-password-verification.component';

import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layout/blank-layout/blank-layout.component';

import { HomeComponent } from './component/home/home.component';
import { ProductsComponent } from './component/products/products.component';
import { ProductDetailComponent } from './component/product-detail/product-detail.component';
import { ProfileComponent } from './component/profile/profile.component';
import { OrdersComponent } from './component/orders/orders.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { CartComponent } from './component/cart/cart.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { OrdersDashboardComponent } from './component/orders-dashboard/orders-dashboard.component';
import { ProductsDashboardComponent } from './component/products-dashboard/products-dashboard.component';
import { CustomersDashboardComponent } from './component/customers-dashboard/customers-dashboard.component';
import { MainDashboardComponent } from './component/main-dashboard/main-dashboard.component';
import { WishListComponent } from './component/wish-list/wish-list.component';
import { ErrorComponent } from './component/error/error.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ContactUsComponent } from './component/contact-us/contact-us.component';
import { SettingsComponent } from './component/settings/settings.component';
import { CategoryDetailsComponent } from './component/category-details/category-details.component';

import { loggedGuard } from './util/Guards/logged.guard';
import { authGuard } from './util/Guards/auth.guard';
import { adminGuard } from './util/Guards/admin.guard';
import { userOnlyGuard } from './util/Guards/userOnly.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [loggedGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, title: 'Login Page' },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register Page',
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'Forgot Password',
      },
      {
        path: 'forgot-password-verification',
        component: ForgetPasswordVerificationComponent,
        title: 'Forgot Password Verification',
      },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'Home Page' },

      {
        path: 'products',
        component: ProductsComponent,
        title: 'Products Page',
      },
      {
        path: 'products/:id',
        component: ProductDetailComponent,
        title: 'Product Page',
      },

      {
        path: 'categories',
        component: CategoriesComponent,
        title: 'Categories Page',
      },
      {
        path: 'categories/:id',
        component: CategoryDetailsComponent,
        title: 'Category Details Page',
      },

      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [adminGuard],
        title: 'Dashboard Page',
        children: [
          { path: '', redirectTo: 'mainDashboard', pathMatch: 'full' },
          {
            path: 'mainDashboard',
            component: MainDashboardComponent,
            title: 'Main Dashboard',
          },
          {
            path: 'orders',
            component: OrdersDashboardComponent,
            title: 'Orders Dashboard',
          },
          {
            path: 'products',
            component: ProductsDashboardComponent,
            title: 'Products Dashboard',
          },
          {
            path: 'customers',
            component: CustomersDashboardComponent,
            title: 'Customers Dashboard',
          },
        ],
      },

      {
        path: 'cart',
        component: CartComponent,
        title: 'Cart Page',
        canActivate: [userOnlyGuard],
      },
      {
        path: 'wishlist',
        component: WishListComponent,
        title: 'Wishlist Page',
        canActivate: [userOnlyGuard],
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        title: 'Checkout Page',
        canActivate: [userOnlyGuard],
      },
      {
        path: 'orders',
        component: OrdersComponent,
        title: 'Orders Page',
        canActivate: [userOnlyGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Profile Page',
        canActivate: [userOnlyGuard],
      },

      {
        path: 'contact-us',
        component: ContactUsComponent,
        title: 'Contact Us Page',
      },
      {
        path: 'settings',
        component: SettingsComponent,
        title: 'Settings Page',
      },
    ],
  },
  { path: '**', component: ErrorComponent, title: 'Error Page' },
];
