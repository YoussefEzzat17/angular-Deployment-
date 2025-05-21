import { ProductService } from '../../util/services/product.service';
import { faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../util/interfaces/iproduct';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../util/services/cart.service';
import { DashboardService } from '../../util/services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WishlistService } from '../../util/services/wishlist.service';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-detail',
  imports: [
    FontAwesomeModule,
    CarouselModule,
    RouterModule,
    CommonModule,
    FormsModule,
  ],
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [ProductService, DashboardService],
})
export class ProductDetailComponent implements OnInit {
  faHeart = faHeart;
  faPaperPlane = faPaperPlane;
  private wishlistService = inject(WishlistService);
  private readonly loadData$ = new BehaviorSubject(true);
  wishlistItems = toSignal(this.loadWhishList);
  get loadWhishList() {
    return this.loadData$.pipe(
      switchMap(() =>
        this.wishlistService.loadWishlist().pipe(map((res) => res.wishlist))
      )
    );
  }

  mainCarouselOptions = {
    items: 1,
    dots: true,
    nav: false,
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 4000,
    margin: 10,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
    },
  };

  productDetails: {
    _id: string;
    title: string;
    category: { name: string };
    images: string[];
    price: number;
    description: string;
    quantity: number;
  } = {
    _id: '',
    title: '',
    category: { name: '' },
    images: [],
    price: 0,
    description: '',
    quantity: 0,
  };

  productComments: {
    _id: string;
    userId: string;
    comment: string;
    userName: string;
    createdAt: Date;
    avatar: string;
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private ProductService: ProductService,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  user: {
    userID?: string;
    userName?: string;
    avatar?: string;
    role?: string;
  } = {};

  serverURL = 'http://localhost:4000/uploads/';

  getAllComments() {
    const productId = this.route.snapshot.params['id'];

    this.ProductService.getAllComments(productId).subscribe({
      next: (res) => {
        this.productComments = res.data.Comments;
        this.getAvatarForEveryUser();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  getProductDetails() {
    const productId = this.route.snapshot.params['id'];

    this.ProductService.getSpecificProduct(productId).subscribe({
      next: (res) => {
        this.productDetails = res.product[0];
      },
      error: (err) => console.error(err),
    });
  }

  isAdmin: boolean = false;

  ngOnInit(): void {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userToken='))
      ?.split('=')[1];

    this.user = jwtDecode<DecodedToken>(token as string);

    if (this.user.role === 'admin') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.getProductDetails();
    this.getAllComments();
  }

  userComment = '';

  addComment() {
    const productId = this.route.snapshot.params['id'];

    const comment = {
      userId: this.user.userID,
      userName: this.user.userName,
      comment: this.userComment,
      createdAt: new Date(),
    };

    this.ProductService.addComment(productId, comment).subscribe({
      next: (res) => {
        this.productComments = [...res.data.Comments];
        this.userComment = '';
        this.getAvatarForEveryUser();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  getAvatarForEveryUser() {
    const newProductComments = this.productComments.map((comment) => {
      this.dashboardService.getUserById(comment.userId).subscribe({
        next: (res) => {
          comment.avatar = res.data[0].avatar;
          comment.userName = res.data[0].username;
        },
        error: (err) => console.error(err),
      });
    });
  }

  deleteComment(productId: string, commentId: string) {
    this.ProductService.deleteComment(productId, commentId).subscribe({
      next: (res) => {
        this.productComments = res.data;
        this.getAvatarForEveryUser();
      },
      error: (err) => console.error(err),
    });
  }

  editPopupIsOpened = false;

  commentIdForEdit = '';
  editPopupIsOpen(commentId: string) {
    this.commentIdForEdit = commentId;

    const myComment = this.productComments.filter(
      (comment) => comment._id === commentId
    );

    this.newComment = myComment[0]?.comment || '';
    this.editPopupIsOpened = true;
  }

  editPopupIsClosed() {
    this.editPopupIsOpened = false;
  }

  newComment = '';
  editComment(productId: string) {
    this.ProductService.editComment(
      productId,
      this.commentIdForEdit,
      this.newComment
    ).subscribe({
      next: (res) => {
        this.productComments = res.data;
        this.editPopupIsOpened = false;
        this.newComment = '';
        this.getAvatarForEveryUser();
      },
      error: (err) => console.error(err),
    });
  }

  addToCart(productId: string) {
    this.cartService.addToCart(productId).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.snackBar.open('Product added to cart!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.router.navigate(['/cart']);
        }
      },
      (error) => {
        if (error.error.message === 'Product already in cart') {
          this.snackBar.open('Product is already in your cart!', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-warning'],
          });
        } else {
          this.snackBar.open('Something went wrong!', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error'],
          });
          console.error('Add to cart error:', error);
        }
      }
    );
  }
  toggleWishlist(id: string): void {
    const action = this.isItemInWhishlist(id)
      ? this.removeFromWhishlist
      : this.addToWhishlist;

    action.call(this, id);
  }

  isItemInWhishlist(id: string) {
    return this.wishlistItems()?.find((item) => item._id === id);
  }

  removeFromWhishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.loadData$.next(true);
      },
      error: (err) => {
        console.error('Error removing item:', err);
      },
    });
  }
  addToWhishlist(productId: string): void {
    this.wishlistService.addToWishlist(productId).subscribe({
      next: () => {
        this.loadData$.next(true);
      },
      error: (err) => {
        console.error('Error removing item:', err);
      },
    });
  }
}
