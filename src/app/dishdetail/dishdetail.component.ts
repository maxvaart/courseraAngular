import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Dish } from '../shared/dish';
import {DishService} from '../services/dish.service';
import {Params , ActivatedRoute} from '@angular/router';
import {getLocaleDateFormat, Location} from '@angular/common';
import {switchMap} from 'rxjs/operators';
import {Comment} from '../shared/comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  @ViewChild('commentaryform') commentaryFormDirectives;
  commentaryForm:FormGroup;
  saved:Comment;
  comment:Comment = {
    'author' : '',
    'rating':0,
    'comment': '',
    'date': Date()
  };
  dish:Dish;
  dishIds: string[];
  prev: string;
  next: string;
  formErrors = {
    'author' : '',
    'rating':'',
    'comment': ''
  };
  validationMessages = {
    'author': {
      'required':'Your name is required.',
      'minlength':'Your name must be at least 2 characters long.'
    },
    'rating': {
    },
    'comment': {
      'required':'Comment is required.'
    }
  };

  constructor(private dishService: DishService, private route : ActivatedRoute, private location : Location, private fb: FormBuilder) {
    this.createForm();
   }

  ngOnInit(): void {
    this.dishService.getDishId().subscribe(dishIds=> this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params)=>this.dishService.getDish(params['id'])))
    .subscribe(dish=>{this.dish = dish; this.setPrevNext(dish.id);})
    
  }

  setPrevNext(dishId: string){
    const index =this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next=this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack ():void{
    this.location.back();
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
  createForm(){
    this.commentaryForm = this.fb.group({
      author:["",[Validators.required, Validators.minLength(2)]],
      rating:[0],
      comment:["",[Validators.required]]
    })
    this.commentaryForm.valueChanges
    .subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?:any){
    if(!this.commentaryForm){return}
    const form = this.commentaryForm;
    for (const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const message = this.validationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field]+= message[key] + '';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.saved = this.commentaryForm.value;
    this.saved.date = Date();
    this.dish.comments.push(this.saved);
    console.log(this.commentaryForm.value);
    this.comment=({
        'author' : '',
        'rating':0,
        'comment': '',
        'date': Date()
    })
    this.commentaryForm.reset({
      author: '',
      rating: '',
      comment: '',
    });
    this.commentaryFormDirectives.resetForm()
  }
}
