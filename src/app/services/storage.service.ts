import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageDTO } from '../dtos/responses/message-dto';

const STORAGE_URL = environment.apiUrl + '/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<MessageDTO> {

    const formData = new FormData();
    formData.append('file', file);

    // El backend devuelve la URL pública como texto plano
    return this.http.post<MessageDTO>(STORAGE_URL + '/upload', formData);
  }
  
}
