import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { HttpResponse } from '@app/shared/models/http-response';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  upload(file: FormData): Observable<HttpResponse> {
    let headers = new HttpHeaders();
    let token = JSON.parse(localStorage.getItem('user-token'));
    headers = headers.set('Authorization', `Bearer ${token.accessToken}`);
    return this.http.post<HttpResponse>(`${environment.api_server}upload/`, file, { headers });
  }
}
