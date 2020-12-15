import { Component, OnInit, Inject } from '@angular/core';
import {Leader} from '../shared/leader';
import {LeadersService} from '../services/leaders.service';
import {flyInOut, expand} from '../animations/app.animations';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display:block'
  },
  animations:[
    flyInOut(),expand()
  ]
})
export class AboutComponent implements OnInit {
  errMess: string;
  leaders: Leader[];
  constructor( private leaderservice : LeadersService, @Inject('BaseURL') public BaseURL) { }

  ngOnInit(): void {
    this.leaderservice.getLeaders()
    .subscribe(leaders => this.leaders = leaders, error=>this.errMess = <any>this.errMess);
  }

}
