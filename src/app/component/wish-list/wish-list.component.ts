import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WishlistService } from '../../util/services/wishlist.service';
import { BehaviorSubject, map, Subscription, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarouselModule } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-wish-list',
  imports: [RouterModule, CommonModule, FormsModule, CarouselModule],
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css'],
})
export class WishListComponent implements OnDestroy {
  wishlistService = inject(WishlistService);
  serverURL = 'http://localhost:4000/uploads/';
  private readonly loadData$ = new BehaviorSubject(true);
  wishlistItems = toSignal(this.loadWhishList);
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
        this.wishlistService.loadWishlist().pipe(
          map((res) =>
            res.wishlist.map((product: any) => ({
              ...product,
              ratingsAverage: this.getRandomRating(),
            }))
          )
        )
      )
    );
  }
  wishlistSub: Subscription = new Subscription();
  selectedImageIndex: { [key: string]: number } = {};

  removeItem(productId: string): void {
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.loadData$.next(true);
      },
      error: (err) => {
        console.error('Error removing item:', err);
      },
    });
  }

  isInWishlist(productId: string) {
    // return this.wishlistService.isInWishlist(productId);
  }

  changeImage(productId: string, index: number): void {
    this.selectedImageIndex[productId] = index;
  }

  addToCart(product: any): void {
    console.log(`Added to cart: ${product.title}`);
  }

  // toggleWishlist(product: any): void {
  //   product.isWachList = !product.isWachList;
  // }

  ngOnDestroy(): void {
    this.wishlistSub.unsubscribe();
  }
  getRandomRating(): number {
    const fullStars = Math.floor(Math.random() * 5) + 1;
    const hasHalf = Math.random() < 0.5;
    return hasHalf && fullStars < 5 ? fullStars + 0.5 : fullStars;
  }
}
