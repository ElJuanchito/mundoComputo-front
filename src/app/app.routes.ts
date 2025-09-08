import type { Routes } from "@angular/router"
import { LoginComponent } from "./components/login/login.component"
import { CrearUsuarioComponent } from "./components/crear-usuario/crear-usuario.component"
import { GestionUsuariosComponent } from "./components/gestion-usuarios/gestion-usuarios.component"

export const routes: Routes = [
  { path: "", redirectTo: "/auth/login", pathMatch: "full" },
  { path: "auth/login", component: LoginComponent },
  { path: "admin/crear-usuario", component: CrearUsuarioComponent },
  { path: "admin/gestion-usuarios", component: GestionUsuariosComponent },
  { path: "**", redirectTo: "/auth/login" },
]
