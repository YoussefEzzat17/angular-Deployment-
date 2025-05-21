import { DashboardService } from './../../util/services/dashboard.service';
import { AuthService } from './../../util/services/auth.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenNib } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../util/interfaces/iproduct';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  edit = faPenNib;

  constructor(
    private AuthService: AuthService,
    private DashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  userInfo: {
    phone?: string;
    username?: string;
    email?: string;
    avatar?: File | string;
    oldPassword?: string;
    newPassword?: string;
  } = {
    phone: '',
    username: '',
    email: '',
  };

  serverURL = 'http://localhost:4000/uploads/';

  ngOnInit(): void {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userToken='))
      ?.split('=')[1];

    if (!token) {
      throw new Error('User token not found in cookies');
    }

    const decodedToken = jwtDecode<DecodedToken>(token);

    this.DashboardService.getUserById(decodedToken.userID).subscribe({
      next: (res) => {
        const user = res.data?.[0];
        if (user) {
          this.userInfo.avatar = user.avatar;
          this.userInfo.phone = user.phone;
          this.userInfo.username = user.username;
          this.userInfo.email = user.email;
        }
        
      },
      error: (err) => console.error('Error fetching user:', err),
    });
  }

  changeUserInfo() {
    const userAvatarInput = document.getElementById(
      'avatar'
    ) as HTMLInputElement;

    const formData = new FormData();


    if (userAvatarInput.files && userAvatarInput.files.length > 0) {
      formData.append('avatar', userAvatarInput.files[0]);
    } else {
      formData.append(
        'oldAvatar',
        (typeof this.userInfo.avatar === 'string'
          ? this.userInfo.avatar
          : '') ?? 'profile.png'
      );
    }

    formData.append('username', this.userInfo.username ?? '');
    formData.append('phone', this.userInfo.phone ?? '');
    formData.append('oldPassword', this.userInfo.oldPassword ?? '');
    formData.append('newPassword', this.userInfo.newPassword ?? '');

    this.AuthService.changeUserInfo(formData).subscribe({
      next: (res: any) => {
        this.userInfo = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }
}
