export interface HistoricoInventarioDTO {
    id: number,
      nombreProducto: string,
      productoId: number,
      fecha: Date,
      cantidadAnterior: number,
      cantidadNueva: number,
      tipoMovimiento: string,
      nombreUsuario: string,
      usuarioId: number,
      comentario: string
}
