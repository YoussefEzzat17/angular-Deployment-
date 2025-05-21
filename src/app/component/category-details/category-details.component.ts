import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService } from '../../util/services/category.service';
import { Subscription } from 'rxjs';
import { DecodedToken, Iproduct } from '../../util/interfaces/iproduct';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { WishlistService } from '../../util/services/wishlist.service';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-category-details',
  imports: [RouterModule, CommonModule, FormsModule, CarouselModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css',
})
export class CategoryDetailsComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  CategoryService = inject(CategoryService);
  categoryID: string | null = null;
  categoryList: any[] = [];
  private wishlistService = inject(WishlistService);
  private readonly loadData$ = new BehaviorSubject(true);
  wishlistItems = toSignal(this.loadWhishList);
  serverURL = 'http://localhost:4000/uploads/';
  // Owl Carousel Options
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
  get loadWhishList() {
    return this.loadData$.pipe(
      switchMap(() =>
        this.wishlistService.loadWishlist().pipe(map((res) => res.wishlist))
      )
    );
  }

  isAdmin: boolean = false;

  token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('userToken='))
    ?.split('=')[1];

  getSpecificProductsub: Subscription = new Subscription();
  selectedImageIndex: { [key: string]: number } = {};
  ngOnInit(): void {
    const user = jwtDecode<DecodedToken>(this.token as string);
    if (user.role === 'admin') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.categoryID = this.route.snapshot.params['id'];
    this.getSpecificProductsub = this.CategoryService.getSpecificCategory(
      this.categoryID
    ).subscribe({
      next: (res) => {
        this.categoryList = res.category.map((product: any) => ({
          ...product,
          ratingsAverage: this.getRandomRating(),
        }));
      },

      error: (err) => {
        console.log('🚀 ~ CategoryDetailsComponent ~ ngOnInit ~ err:', err);
      },
    });
  }
  changeImage(productId: string, index: number): void {
    this.selectedImageIndex[productId] = index;
  }

  addToCart(product: Iproduct): void {
    console.log(`Added to cart: ${product.title}`);
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

  ngOnDestroy(): void {
    this.getSpecificProductsub.unsubscribe();
  }
  getRandomRating(): number {
    const fullStars = Math.floor(Math.random() * 5) + 1;
    const hasHalf = Math.random() < 0.5;
    return hasHalf && fullStars < 5 ? fullStars + 0.5 : fullStars;
  }
}
