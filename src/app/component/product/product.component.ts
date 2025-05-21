import { Component, inject, Input } from '@angular/core';
import { ProductService } from '../../util/services/product.service';
import { DecodedToken, Iproduct } from '../../util/interfaces/iproduct';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { WishlistService } from '../../util/services/wishlist.service';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { jwtDecode } from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../util/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, CarouselModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  @Input() productListLength: number = 0;
  productList: Iproduct[] = [];
  filteredProductList: Iproduct[] = [];
  searchQuery: string = '';

  carouselOptions = {
    items: 1,
    dots: true,
    nav: false,
    loop: true,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 4000,
    margin: 10,
  };
  private wishlistService = inject(WishlistService);
  private productService = inject(ProductService);
  private cookieService = inject(CookieService);
  private readonly loadData$ = new BehaviorSubject(true);
  wishlistItems = toSignal(this.loadWhishList);

  constructor(
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private router: Router,
  ) {}




  get loadWhishList() {
    return this.loadData$.pipe(
      switchMap(() =>
        this.wishlistService.loadWishlist().pipe(map((res) => res.wishlist))
      )
    );
  }

  serverURL = 'http://localhost:4000/uploads/';
  isAdmin: boolean = false;

  token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('userToken='))
    ?.split('=')[1];

  randomIndexesOfProducts: number[] = [];

  getRandomIndexesOfProducts(productList: Iproduct[]) {
    this.randomIndexesOfProducts = [];

    let count;
    if (productList.length > 12) {
      if (location.pathname === '/home') {
        count = 12;
      } else {
        count = productList.length;
      }
    } else {
      count = productList.length;
    }

    while (this.randomIndexesOfProducts.length < count) {
      const randomNum = Math.floor(Math.random() * productList.length);
      if (!this.randomIndexesOfProducts.includes(randomNum)) {
        this.randomIndexesOfProducts.push(randomNum);
      }
    }
    console.log(this.randomIndexesOfProducts);
  }

  ngOnInit(): void {
    const user = jwtDecode<DecodedToken>(this.token as string);
    if (user.role === 'admin') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.productList = res.products.map((product: any) => ({
          ...product,
          ratingsAverage: this.getRandomRating(),
        }));

        this.filteredProductList = [...this.productList];
        this.getRandomIndexesOfProducts(this.productList);
      },
      error: (err) => console.error(err),
    });
  }

  filterProducts(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredProductList = [...this.productList];
    } else {
      this.filteredProductList = this.productList.filter((product) =>
        product.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.getRandomIndexesOfProducts(this.filteredProductList);
  }

  onSearchChange(): void {
    this.filterProducts();
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

  getRandomRating(): number {
    const fullStars = Math.floor(Math.random() * 5) + 1;
    const hasHalf = Math.random() < 0.5;
    return hasHalf && fullStars < 5 ? fullStars + 0.5 : fullStars;
  }
}

