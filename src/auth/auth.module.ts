import { NgModule } from '@angular/core'
import { AuthService } from './auth.service'
import { JwtService } from './jwt.service'
import { PermissionsGuard } from '../auth/guard/permissionsGuard';

/**
 * Manage authentification with JWT
 */
@NgModule({
  declarations: [],
  providers: [
    AuthService,
    JwtService,
    PermissionsGuard
  ]
})
export class AuthModule { }
