import { DashboardService } from './../../util/services/dashboard.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../util/interfaces/iproduct';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders-dashboard',
  imports: [],
  templateUrl: './orders-dashboard.component.html',
  styleUrl: './orders-dashboard.component.css',
})
export class OrdersDashboardComponent {
  usersOrders: {
    _id: string;
    products: [{ title: string; adminId: string; quantity: string }];
    total: string;
    createdAt: string;
    userId: string;
    userName: string;
  }[] = [];
  constructor(
    private DashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  adminID = '';

  ngOnInit(): void {
    this.getAllAdminOrders();
  }

  getAllAdminOrders() {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userToken='))
      ?.split('=')[1];

    if (!token) {
      throw new Error('User token not found in cookies');
    }

    const decodedToken = jwtDecode<DecodedToken>(token);
    this.adminID = decodedToken.userID;
    this.DashboardService.getAllAdminOrders(decodedToken.userID).subscribe({
      next: (res) => {
        console.log(res.orders);

        this.usersOrders = res.orders;
        // this.getUserData();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // getUserData() {
  //   for (let i = 0; i < this.usersOrders.length; i++) {
  //     this.DashboardService.getUserById(this.usersOrders[i].userId).subscribe({
  //       next: (res) => {
  //         this.usersOrders[i].userName = res.data[0].username;
  //       },
  //       error: (err) => console.error('Error fetching user:', err),
  //     });
  //   }
  // }

  completeOrder(orderID: string) {
    this.DashboardService.completedOrder(orderID).subscribe({
      next: (res) => {
        console.log(res);
        if (res.status === 'success') {
          this.snackBar.open(res.message, '', {
            duration: 4000,
            panelClass: ['custom-snackbar'],
          });
        }
        this.getAllAdminOrders();
      },
      error: (err) => console.error(err),
    });
  }
}
