import { Injectable } from '@angular/core';
import {Observable , of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http';
import {baseURL} from '../shared/baseurl';
import {ProcessHTTPMsgService} from '../services/process-httpmsg.service';
import {Feedback} from '../shared/feedback';

@Injectable({  
providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient, private ProcessHTTPMsgService: ProcessHTTPMsgService) { }

  getFeedbacks(): Observable<Feedback[]>{
    return this.http.get<Feedback[]>(baseURL + 'feedback')
  }
  
  putFeedback(feedback: Feedback): Observable<Feedback>{
    const httpOptions= {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedback',feedback,httpOptions)
    .pipe(catchError(this.ProcessHTTPMsgService.handleError))
  }
}
