import { Component, HostListener } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen: boolean = false;
  title: string;
  nombreUsuario: string = "";
  isLogged = false;
  email: string = "";
  userImageUrl: string | null = null;
  activeNav: 'inventario' | 'categorias' | 'usuarios' | null = null;

  /**
   * Constructor de la clase HeaderComponent
   * @param tokenService tokenService para gestionar el token de autenticación
   * @param router router para navegar entre rutas
   */
  constructor(private tokenService: TokenService, private router: Router) {
    this.title = 'Tienda Sana';
    this.isLogged = this.tokenService.isLogged();
    if (this.isLogged) {
      this.email = this.tokenService.getEmail();
      this.nombreUsuario = this.tokenService.getNombre();
      this.userImageUrl = this.tokenService.getUserImageUrl ? this.tokenService.getUserImageUrl() : null;
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const urlTree = this.router.parseUrl(event.urlAfterRedirects);
      if (event.urlAfterRedirects === '/' || event.urlAfterRedirects.startsWith('/?')) {
        const view = urlTree.queryParams['view'];

        if (view === 'inventario') {
          this.activeNav = 'inventario';
        } else if (view === 'categorias') {
          this.activeNav = 'categorias';
        } else if (view === 'usuarios') {
          this.activeNav = 'usuarios';
        } else {
          this.activeNav = null;
        }
      } else {
        this.activeNav = null;
      }
    });
  }

  /**
   * Método para deslogar al usuario
   */
  public logout() {
    this.tokenService.logout();
  }

  /**
   * Método para navegar en la aplicación
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const header = document.querySelector('.main-header');
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  mostrarInventario(): void {
    // this.activeNav = 'inventario';
    // this.router.navigate([''], { queryParams: { view: 'inventario' } });
    this.router.navigate(['/inventario/gestion-inventario']);
  }

  mostrarCategorias(): void {
    // this.activeNav = 'categorias';
    // this.router.navigate([''], { queryParams: { view: 'categorias' } });
    this.router.navigate(['/inventario/gestion-categorias']);
  }

  mostrarUsuarios(): void {
    // this.activeNav = 'usuarios';
    // this.router.navigate([''], { queryParams: { view: 'usuarios' } });
    this.router.navigate(['/admin/gestion-usuarios']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goHome(event: Event) {
    event.preventDefault();
    if (this.activeNav === 'inventario') {
      this.router.navigate(['/'], { queryParams: { view: 'inventario', reset: true } });
    } else if (this.activeNav === 'categorias') {
      this.router.navigate(['/'], { queryParams: { view: 'categorias', reset: true } });
    } else if (this.activeNav === 'usuarios') {
      this.router.navigate(['/'], { queryParams: { view: 'usuarios', reset: true } });
    } else {
      this.router.navigate(['/'], { queryParams: { reset: true } });
      this.activeNav = null;
    }
  }

}