import { IfStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Feedback,ContactType} from '../shared/feedback';
import {flyInOut, visibility,expand} from '../animations/app.animations';
import {FeedbackService} from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':'display:block'
  },
  animations:[
    flyInOut(),expand()
  ]
})
export class ContactComponent implements OnInit {
  @ViewChild('fform') feedbackFormDirectives;
  feedbackForm: FormGroup;
  feedback: Feedback;
  formHidden: boolean = false;
  feedbackCopy:Feedback = {
      firstname: "",
      lastname: "",
      telnum: 0,
      email:"",
      agree: false,
      contacttype: 'None',
      message:''
  };
  feedbacksBase:Feedback[];
  feedbackNow:Feedback;
  contactType = ContactType;
  errMess:string;
  formErrors = {
    'firstname' : '',
    'lastname': '',
    'telnum': '',
    'email':''
  };
  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };
  constructor( private fb : FormBuilder, private FeedbackService: FeedbackService) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      firstname: ["", [Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      lastname: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email:["", [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message:''
    })
    this.feedbackForm.valueChanges
    .subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();
  }

  onSubmit(){
    this.formHidden = true;
    this.feedback = this.feedbackForm.value;
    this.FeedbackService.putFeedback(this.feedback)
    .subscribe(feedback=>{
      this.feedback = feedback;
      this.feedbackCopy =  this.feedback;
    },errMess => {this.feedback= null; this.errMess = <any>errMess})
    console.log(this.feedback);
    this.FeedbackService.getFeedbacks()
    .subscribe(feedbacks=> this.feedbacksBase = feedbacks )
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    setTimeout(()=>{this.feedbackCopy = {
      firstname: null,
      lastname: "",
      telnum: 0,
      email:"",
      agree: false,
      contacttype: 'None',
      message:''} , 
      this.formHidden = false;
    } ,5000);
    this.feedbacksBase = null;
  }
    

  onValueChanged(data?:any){
    if(!this.feedbackForm){return};
    const form = this.feedbackForm;
    for (const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid){
            const messages = this.validationMessages[field];
            for(const key in control.errors){
              if (control.errors.hasOwnProperty(key)){
                this.formErrors[field]+= messages[key] + '';
              }
            }
        }
      }
    }
  }
  
}
