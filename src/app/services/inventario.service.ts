import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MessageDTO } from '../dtos/responses/message-dto';
import { CreateProductoDTO } from '../dtos/producto/create-producto-dto';
import { UpdateProductoDTO } from '../dtos/producto/update-producto-dto';
import { InventarioDTO } from '../dtos/producto/inventario-dto';
import { CreateCategoriaDTO } from '../dtos/categoria/create-categoria-dto';
import { UpdateCategoriaDTO } from '../dtos/categoria/update-categoria-dto';

const INVENTARIO_URL = environment.apiUrl + '/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  constructor(private http: HttpClient) {}

  // PRODUCTOS
  getAllProductos(): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${INVENTARIO_URL}/productos`);
  }

  getProductoById(id: number): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${INVENTARIO_URL}/productos/${id}`);
  }

  createProducto(data: CreateProductoDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(`${INVENTARIO_URL}/productos`, data);
  }

  updateProducto(data: UpdateProductoDTO): Observable<MessageDTO> {
    return this.http.put<MessageDTO>(`${INVENTARIO_URL}/productos`, data);
  }

  getHistoricoProducto(id: number): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${INVENTARIO_URL}/productos/${id}/historico`);
  }

  getProductosByCategoria(categoriaId: number): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${INVENTARIO_URL}/productos/byCategoria`, { params: { categoriaId } });
  }

  // Entradas, salidas y ajustes de inventario
  registrarEntradaInventario(data: InventarioDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(`${INVENTARIO_URL}/productos/entrada`, data);
  }

  registrarSalidaInventario(data: InventarioDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(`${INVENTARIO_URL}/productos/salida`, data);
  }

  registrarAjusteInventario(data: InventarioDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(`${INVENTARIO_URL}/productos/ajuste`, data);
  }

  // CATEGORIAS
  getAllCategorias(): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${INVENTARIO_URL}/categorias`);
  }

  getCategoriaById(id: number): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${INVENTARIO_URL}/categorias/${id}`);
  }

  createCategoria(data: CreateCategoriaDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(`${INVENTARIO_URL}/categorias`, data);
  }

  updateCategoria(data: UpdateCategoriaDTO): Observable<MessageDTO> {
    return this.http.put<MessageDTO>(`${INVENTARIO_URL}/categorias`, data);
  }

  deleteCategoria(id: number): Observable<MessageDTO> {
    return this.http.delete<MessageDTO>(`${INVENTARIO_URL}/categorias/${id}`);
  }

  getCategoriasByName(nombre: string): Observable<MessageDTO> {
    return this.http.get<MessageDTO>(`${INVENTARIO_URL}/categorias/byName`, { params: { nombre } });
  }
}
