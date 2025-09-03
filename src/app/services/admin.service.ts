import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreateUsuarioDTO } from '../dtos/usuario/create-usuario-dto';
import { UpdateUsuarioDTO } from '../dtos/usuario/update-usuario-dto';
import { MessageDTO } from '../dtos/responses/message-dto';

const ADMIN_URL = environment.apiUrl + '/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getAllUsuarios(): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${ADMIN_URL}/usuarios`);
  }

  // Obtener usuario por ID
  getUsuarioById(id: number): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${ADMIN_URL}/${id}`);
  }

  // Crear usuario
  createUsuario(data: CreateUsuarioDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(`${ADMIN_URL}`, data);
  }

  // Actualizar usuario
  updateUsuario(data: UpdateUsuarioDTO): Observable<MessageDTO> {
    return this.http.put<MessageDTO>(`${ADMIN_URL}`, data);
  }

  // Eliminar usuario
  deleteUsuario(id: number): Observable<MessageDTO> {
    return this.http.delete<MessageDTO>(`${ADMIN_URL}/${id}`);
  }

  // Obtener usuarios por rol
  getUsuariosByRol(rol: string): Observable<MessageDTO> {
    const params = new HttpParams().set('rol', rol);
    return this.http.get<MessageDTO>(`${ADMIN_URL}/byRol`, {
      params
    });
  }

  // Obtener usuarios por nombre
  getUsuariosByNombre(nombre: string): Observable<MessageDTO> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<MessageDTO>(`${ADMIN_URL}/byNombre`, {
      params
    });
  }

  // Obtener usuarios por estado
  getUsuariosByEstado(estado: string): Observable<MessageDTO> {
    const params = new HttpParams().set('estado', estado);
    return this.http.get<MessageDTO>(`${ADMIN_URL}/byEstado`, {
      params
    });
  }

  // Obtener roles
  getRoles(): Observable<MessageDTO> {
    const url = ADMIN_URL + '/roles';
    return this.http.get<MessageDTO>(url);
  }
}
