export interface CreateProductoDTO {
    nombre: string,
    descripcion: string,
    precio: number,
    stock: number,
    stockMinimo: number,
    categoriaId: number
}
