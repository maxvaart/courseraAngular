import { Injectable } from '@angular/core';
import {Leader} from '../shared/leader';
import {of , Observable} from 'rxjs';
import {baseURL} from '../shared/baseurl';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProcessHTTPMsgService} from '../services/process-httpmsg.service';
import {catchError, map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LeadersService {

  constructor(private http: HttpClient, private ProcessHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders() : Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.ProcessHTTPMsgService.handleError))
  } 
  getLeader(id : number) : Observable<Leader>{
    return this.http.get<Leader>(baseURL+'leadership/'+ id)
    .pipe(catchError(this.ProcessHTTPMsgService.handleError))
  }
  getFeatureLeader() : Observable<Leader>{
    return this.http.get<Leader>(baseURL+'leadership?featured=true')
    .pipe(map(leaders=>leaders[0]))
    .pipe(catchError(error=>error))
  }
}
