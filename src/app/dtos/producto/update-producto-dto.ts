export interface UpdateProductoDTO {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stockMinimo: number;
    categoriaId: number;
}
