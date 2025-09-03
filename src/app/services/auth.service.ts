import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageDTO } from '../dtos/responses/message-dto';
import { LoginDTO } from '../dtos/auth/login-dto';
import { ChangePasswordDTO } from '../dtos/auth/change-password-dto';


const AUTH_URL = environment.apiUrl + '/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public sendVerificationCode(email: string): Observable<MessageDTO> {

    const params = new HttpParams().set('email', email);
    return this.http.post<MessageDTO>(AUTH_URL + '/send-verification-code', params);
  }

  public login(login: LoginDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(AUTH_URL + '/login', login);
  }

  public changePassword(changePassword: ChangePasswordDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(AUTH_URL + '/change-password', changePassword);
  }

}