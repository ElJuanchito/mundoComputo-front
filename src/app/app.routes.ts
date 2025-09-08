import type { Routes } from "@angular/router"
import { LoginComponent } from "./components/login/login.component"
import { CrearUsuarioComponent } from "./components/crear-usuario/crear-usuario.component"
import { GestionUsuariosComponent } from "./components/gestion-usuarios/gestion-usuarios.component"
import { GestionInventarioComponent } from "./components/gestion-inventario/gestion-inventario.component"
import { GestionCategoriasComponent } from "./components/gestion-categorias/gestion-categorias.component"
import { CrearCategoriaComponent } from "./components/crear-categoria/crear-categoria.component"
import { CrearProductoComponent } from "./components/crear-producto/crear-producto.component"

export const routes: Routes = [
  { path: "", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "auth/login", component: LoginComponent },
  { path: "admin/gestion-usuarios", component: GestionUsuariosComponent },
  { path: "admin/crear-usuario", component: CrearUsuarioComponent },
  { path: "admin/actualizar-usuario/:id", component: CrearUsuarioComponent },
  { path: "inventario/gestion-categorias", component: GestionCategoriasComponent },
  { path: "admin/crear-categoria", component: CrearCategoriaComponent },
  { path: "admin/actualizar-categoria/:id", component: CrearCategoriaComponent },
  { path: "inventario/gestion-inventario", component: GestionInventarioComponent },
  { path: "inventario/crear-producto", component: CrearProductoComponent },
  { path: "inventario/actualizar-producto/:id", component: CrearProductoComponent },
  { path: "**", redirectTo: "/auth/login" },
]
