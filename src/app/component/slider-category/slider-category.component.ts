import {
  Component,
  inject,
  OnInit,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CategoryService } from '../../util/services/category.service';
import { Icategory } from '../../util/interfaces/icategory';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-slider-category',
  imports: [CarouselModule, RouterModule],
  templateUrl: './slider-category.component.html',
  styleUrl: './slider-category.component.css',
})
export class SliderCategoryComponent implements OnInit {
  categoryOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 5,
      },
    },
    nav: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
  };
  private CategoryService = inject(CategoryService);
  categoryList: Icategory[] = [];
  ngOnInit(): void {
    this.CategoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res.data;
      },
      error: (error) => {
        console.log(
          '🚀 ~ SliderCategoryComponent ~ this.CategoryService.getAllCategories ~ error:',
          error
        );
      },
    });
  }
}
