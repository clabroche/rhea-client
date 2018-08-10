import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";
import { AuthService, AuthError } from "../auth.service"
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private userService: AuthService, private router: Router) { };

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let permissions = route.data["permissions"] as Array<string>;
        let redirect = route.data["redirect"] as Array<string>;
        let authorized = false
        return this.checkPermissions(permissions).then(authorized=>{
            if (!authorized) {
                this.router.navigate(redirect || ['/'])
                AuthError.next({ code: 403, message: { title: 'Accès non autorisé', detail: 'Contactez votre administrateur pour pouvoir accéder à cette section'}})
            }
            return authorized
        })
    }

    async checkPermissions(permissions){
        if (!this.userService.me) return this.userService.loadMe().then(_=>this.checkPermissions(permissions)).catch(_=>{})
        return permissions.reduce((prev, perm) => {
            if (prev) return true
            return this.userService.permissions.includes(perm)
        }, false) ? Promise.resolve(true) : Promise.resolve(false)
    }
}