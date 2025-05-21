import { DashboardService } from './../../util/services/dashboard.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Iproduct } from '../../util/interfaces/iproduct';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './products-dashboard.component.html',
  styleUrl: './products-dashboard.component.css',
})
export class ProductsDashboardComponent {
  productList: Iproduct[] = [];
  constructor(
    private DashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.DashboardService.getAllAdminProducts().subscribe({
      next: (res) => {
        this.productList = res.products;
      },
      error: (err) => console.error(err),
    });
  }

  deleteProduct(id: string) {
    this.DashboardService.deleteProduct(id).subscribe({
      next: (res) => {
        this.productList = this.productList.filter(
          (product) => product._id !== id
        );
        this.snackBar.open('Product Deleted Successfully', '', {
          duration: 4000,
          panelClass: ['custom-snackbar'],
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.snackBar.open('Error In Deleted Product', '', {
          duration: 4000,
          panelClass: ['custom-snackbar'],
        });
        console.error(err);
      },
    });
  }

  newProduct: {
    title: string;
    description: string;
    quantity: string;
    price: string;
    imageCover: string;
    category: { name: string };
    images: File[];
  } = {
    title: '',
    description: '',
    quantity: '',
    price: '',
    imageCover: '',
    category: { name: '' },
    images: [],
  };

  isPopupVisible = false;

  openPopup() {
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  serverURL = 'http://localhost:4000/uploads/';

  addProduct() {
    const imageInput = document.getElementById(
      'productImages'
    ) as HTMLInputElement;

    this.newProduct.images = imageInput.files ? [...imageInput.files] : [];

    const formData = new FormData();

    formData.append('title', this.newProduct.title);
    formData.append('description', this.newProduct.description);
    formData.append('price', this.newProduct.price);
    formData.append('quantity', this.newProduct.quantity);
    formData.append('category', this.newProduct.category.name);

    this.newProduct.images.forEach((file: File) => {
      formData.append('images', file);
    });

    this.DashboardService.addProduct(formData).subscribe({
      next: (res) => {
        this.productList.push(res.data);
        this.isPopupVisible = false;
        this.cdr.detectChanges();

        this.addCategory({
          name: this.newProduct.category.name,
        });

        this.newProduct = {
          title: '',
          description: '',
          quantity: '',
          price: '',
          imageCover: '',
          category: { name: '' },
          images: [],
        };
      },
      error: (err) => {
        const errors = err.error.message.errors;

        const firstKey = Object.keys(errors)[0];

        const firstErrorMessage = errors[firstKey].message;

        this.snackBar.open(firstErrorMessage, '', {
          duration: 4000,
          panelClass: ['custom-snackbar'],
        });
        console.error(err);
      },
    });
  }

  addCategory(body: any) {
    this.DashboardService.addCategory(body).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  isPopupForEdit = false;

  productToEdit: Iproduct = {
    _id: '',
    id: '',
    slug: '',
    title: '',
    description: '',
    quantity: 0,
    price: 0,
    imageCover: '',
    category: { _id: '', name: '', slug: '', image: '' },
    sold: 0,
    images: [],
    subcategory: [],
    ratingsQuantity: 0,
    ratingsAverage: 0,
    brand: { _id: '', name: '', slug: '', image: '' },
    createdAt: '',
    updatedAt: '',
  };

  getProductById(id: string) {
    this.DashboardService.getproductById(id).subscribe({
      next: (res) => {
        this.productToEdit = res.product[0];
        this.isPopupForEdit = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  openPopupForEdit(id: string) {
    this.getProductById(id);
  }

  closePopupForEdit() {
    this.isPopupForEdit = false;
  }

  editProduct() {
    const imageInput = document.getElementById(
      'editProductImages'
    ) as HTMLInputElement;

    const images = imageInput.files ? [...imageInput.files] : [];

    if (
      !this.productToEdit.category ||
      !this.productToEdit.category.name ||
      this.productToEdit.category.name.trim().length === 0
    ) {
      this.snackBar.open('Category is required', '', {
        duration: 4000,
        panelClass: ['custom-snackbar'],
      });
      return;
    }

    if (
      this.productToEdit.price === null ||
      this.productToEdit.price === undefined ||
      this.productToEdit.price.toString().trim().length === 0
    ) {
      this.snackBar.open('Price is required', '', {
        duration: 4000,
        panelClass: ['custom-snackbar'],
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', this.productToEdit.title);
    formData.append('description', this.productToEdit.description);
    formData.append('price', this.productToEdit.price.toString());
    formData.append('quantity', this.productToEdit.quantity.toString());
    formData.append('category', this.productToEdit.category.name);

    if (images.length > 0) {
      images.forEach((file: File) => {
        formData.append('images', file);
      });
    }

    this.DashboardService.updateProduct(
      this.productToEdit._id,
      formData
    ).subscribe({
      next: (res) => {
        this.productList = this.productList.map((product) =>
          product._id === this.productToEdit._id ? res.product : product
        );
        this.isPopupForEdit = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errors = err.error.message.errors;

        const firstKey = Object.keys(errors)[0];

        const firstErrorMessage = errors[firstKey].message;

        this.snackBar.open(firstErrorMessage, '', {
          duration: 4000,
          panelClass: ['custom-snackbar'],
        });
        console.error(err);
      },
    });
  }
}
