import { Component, OnInit, Inject } from '@angular/core';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {Promotion} from '../shared/promotion';
import {PromotionService} from '../services/promotion.service';
import {Leader} from '../shared/leader';
import {LeadersService} from '../services/leaders.service';
import {flyInOut,expand} from '../animations/app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display:block'
  },
  animations:[
    flyInOut(), expand()
  ]
})
export class HomeComponent implements OnInit {
  dish : Dish;
  dishErrMess: string;
  leaderErrMess:string;
  promotionErrMess:string;
  promotion: Promotion;
  leader: Leader;
  constructor(private dishService : DishService , private promotionService : PromotionService, private leaderService : LeadersService, @Inject('BaseURL') public BaseURL) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
    .subscribe(dish => this.dish = dish, errMess => this.dishErrMess = <any>this.dishErrMess);
    this.promotionService.getFeaturedPromotion()
    .subscribe (promotion => this.promotion = promotion, promotionErrMess => this.promotionErrMess=<any>this.promotionErrMess);
    this.leaderService.getFeatureLeader()
    .subscribe(leader => this.leader = leader, errMes => this.leaderErrMess=<any>this.leaderErrMess);
  }

}
