import {Component, Input, OnInit} from '@angular/core';
import {Product} from '@app/shared/models/product';

@Component({
  selector: 'app-dashboard-feature-project-product',
  templateUrl: './dashboard-feature-project-product.component.html',
  styleUrls: ['./dashboard-feature-project-product.component.scss']
})
export class DashboardFeatureProjectProductComponent implements OnInit {
  @Input() product: Product;
  @Input() name: string;
  @Input() productName: string;
  isProdName: boolean;

  constructor() { }

  ngOnInit() {
    if(this.productName === undefined || this.productName === null){
      this.isProdName = false;
    }
    else{
      this.isProdName = true;
    }
  }
}
