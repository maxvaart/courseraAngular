import { Injectable } from '@angular/core';
import {Promotion} from '../shared/promotion';
import {catchError, map} from 'rxjs/operators';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {ProcessHTTPMsgService} from './process-httpmsg.service';
import {baseURL} from '../shared/baseurl';
import {of , Observable, from} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient, private ProcessHTTPMsgService: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]>{
    return this.http.get<Promotion[]>(baseURL+'promotions')
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
}
  getPromotion(id:number): Observable<Promotion>{
    return this.http.get<Promotion>(baseURL+'promotions'+ id)
    .pipe(catchError(this.ProcessHTTPMsgService.handleError))
  } 
  getFeaturedPromotion() : Observable<Promotion>{
    return this.http.get<Promotion>(baseURL+'promotions?featured=true')
    .pipe(map(promotions=>promotions[0]))
    .pipe(catchError(error=>error))
  }
}
