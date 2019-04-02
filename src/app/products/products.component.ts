import { Component, OnInit } from '@angular/core';
import { Product, ProductsQuery, ProductsService } from './state';
import { Observable, combineLatest } from 'rxjs';
import { CartService } from '../cart/state';
import { FormControl } from '@angular/forms';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  providers: [],
  templateUrl: `./products.component.html`
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  search = new FormControl();
  sortControl = new FormControl('title');

  constructor(private productsService: ProductsService,
              private cartService: CartService, private productsQuery: ProductsQuery) {}

  ngOnInit() {
    this.productsService.get().subscribe();
    this.loading$ = this.productsQuery.selectLoading();

    this.products$ = combineLatest(this.search.valueChanges.pipe(startWith('')), this.sortControl.valueChanges.pipe(startWith('title'))).pipe(
      switchMap(([term, sortBy]) => this.productsQuery.getProducts(term, sortBy as keyof Product))
    );
  }


  addProductToCart({ id }: Product) {
    this.cartService.addProductToCart(id);
  }


  subtract({ id }: Product) {
    this.cartService.subtract(id);
  }
}
