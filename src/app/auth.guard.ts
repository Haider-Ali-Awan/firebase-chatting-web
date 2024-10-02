import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from './services/authService/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    const url = state.url;

    if (url === '/chat') {
      return this.authService.isLoggedIn().pipe(
        map(isLoggedIn => {
          if (isLoggedIn) {
            return true; // User is authenticated
          } else {
            this.router.navigate(['/login']); // Redirect to login if not authenticated
            return false;
          }
        })
      );
    }

    // Return true by default if no specific URL checks are needed
    return true; 
  }
}
