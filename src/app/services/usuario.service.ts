import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UpdateUsuarioDTO } from '../dtos/usuario/update-usuario-dto';
import { Observable } from 'rxjs';
import { MessageDTO } from '../dtos/responses/message-dto';

const STORAGE_URL = environment.apiUrl + '/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  updateUsuario(updateUsuarioDTO: UpdateUsuarioDTO): Observable<MessageDTO> {
    return this.http.put<MessageDTO>(`${STORAGE_URL}`, updateUsuarioDTO);
  }

  getUsuarioById(id: number): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${STORAGE_URL}/${id}`);
  }

  deleteUsuario(id: number): Observable<MessageDTO> {
    return this.http.delete<MessageDTO>(`${STORAGE_URL}/${id}`);
  }
}
