import { DashboardService } from './../../util/services/dashboard.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../util/interfaces/iproduct';

@Component({
  selector: 'app-customers-dashboard',
  imports: [],
  templateUrl: './customers-dashboard.component.html',
  styleUrl: './customers-dashboard.component.css',
})
export class CustomersDashboardComponent {
  customersAllOrders = [
    {
      _id: '',
      products: [{ title: '', adminId: '' }],
      userDetails: {
        _id: '',
        username: '',
        avatar: '',
        phone: '',
        email: '',
      },
      total: '',
      createdAt: '',
      userId: '',
    },
  ];

  constructor(
    private DashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  serverURL = 'http://localhost:4000/uploads/';
  adminID = '';

  ngOnInit(): void {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userToken='))
      ?.split('=')[1];

    if (!token) {
      throw new Error('User token not found in cookies');
    }

    const decodedToken = jwtDecode<DecodedToken>(token);
    this.adminID = decodedToken.userID;

    this.DashboardService.getAllAdminCustomers(decodedToken.userID).subscribe({
      next: (res) => {
        console.log(res.customers);
        this.customersAllOrders = res.customers;
        this.getAllUserData();
      },
      error: (err) => console.error(err),
    });
  }

  uniqueUserID: string[] = [];

  customersDetails: {
    avatar: string;
    username: string;
    phone: string;
    email: string;
  }[] = [];

  getAllUserData(): void {
    for (const customer of this.customersAllOrders) {
      const userId = customer.userDetails._id;
      if (userId !== undefined && !this.uniqueUserID.includes(userId)) {
        this.uniqueUserID.push(userId);
        this.customersDetails.push(customer.userDetails);
      }
    }

    console.log(this.uniqueUserID);
    console.log(this.customersDetails);

    let count = 0;
    for (let userID of this.uniqueUserID) {
      this.DashboardService.getUserById(userID).subscribe({
        next: (res) => {
          console.log(res);

          this.customersDetails[count++] = res.data[0];
        },
        error: (err) => console.error(err),
      });
    }
  }
}
