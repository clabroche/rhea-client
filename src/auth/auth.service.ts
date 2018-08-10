import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { GraphQLService } from '../graphQL/providers/graphQL.service';
import * as jwt_decode from 'jwt-decode';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Resolve } from '@angular/router';
import { environment } from '../environments/environment';

/**
 * Describe type Permission
 */
interface Permission {
  name;
}
/**
 * Describe type Role
 */
interface Role {
  uuid?;
  name?;
  permissions?: Array<Permission>;
}

/**
 * Describe type Me
 */
export interface Me {
  uuid?;
  login?;
  avatar?;
  givenName?;
  familyName?;
  role?: Role;
}

export const AuthError = new Subject();

/**
 * Authentification stuff
 */
@Injectable()
export class AuthService implements Resolve<any> {
  /**
   * Auth boolean that describe if user is authenticated or not
   */
  auth = true;

  /**
   * Reflect authenticated user infos
   */
  me: Me;

  role: Array<string>;

  /**
   * Reflect authenticated user permissions in one array
   */
  permissions: Array<string>;

  /**
   * Interval of the refreshToken
   */
  tokenRefresh;

  /**
   * Import dependencies instances, load me user, and set the cycle of refreshToken
   *
   * @param common
   * @param jwtService
   * @param graphQLService
   * @param notifService
   */
  constructor(
    private jwtService: JwtService,
    private graphQLService: GraphQLService,
    private http: HttpClient
  ) {
    this.tokenRefresh = setInterval(() => { // refresh all token
      if (!this.auth) { return; }
      http.post(environment.apiUrl + ':3000/refresh', '', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'authorization': 'bearer ' + this.jwtService.getToken()
        })
      }).toPromise().then((response: any) => {
        if (response.message === 'ok') {
          this.jwtService.saveToken(response.token);
          this.auth = true;
        }
      }).catch(err => this.deconnect());
    }, (1000 * 3600));
  }

  resolve() {
    return this.loadMe().catch(err => {});
  }


  /**
   * Login an User
   * @param {Object} user
   * @property {Object} user.login login of user
   * @property {Object} user.password password of user
   */
  async login(user) {
    const response: any = await this.http.post(
      environment.apiUrl + ':3000/login',
      { login: user.login, password: user.password }
    ).toPromise().catch(err => {
      AuthError.next({
        code: 401,
        message: {
          title: 'Problème de communication avec l\'API',
          detail: 'Vérifiez que l\'API est démarrée'
        },
        deleteAll: true
      });
    });
    if (response.message === 'ok') {
      window.localStorage.setItem('credentials', JSON.stringify({
        login: user.login,
        password: user.password
      }));

      this.jwtService.saveToken(response.token);
      const result = await this.loadMe().catch(err => {
        return 'err';
      });
      if (result !== 'err') {
        this.auth = true;
      }
    }
  }

  /**
   * Load user authenticated
   */
  loadMe() {
    if (!this.jwtService.getToken()) {
      this.auth = false;
      return Promise.reject('No token');
    }
    const token = jwt_decode(this.jwtService.getToken());
    return this.graphQLService.query(`
      accountById(uuid:"${token.uuid}") {
        uuid, login, avatar, givenName, familyName,
        role {
          uuid, name
          permissions {uuid, name, description}
        }
      }`).then(({ accountById }) => {
        this.permissions = accountById.role.permissions.map(permission => permission.name);
        this.role = accountById.role;
        this.me = accountById;
        if (!this.me.avatar) {
          this.me.avatar = 'assets/img/user.png';
        }
        return accountById;
      });
  }

  /**
   * Manage deconnection workflow
   */
  deconnect() {
    this.auth = false;
    window.localStorage.removeItem('jwtToken');
    AuthError.next({
      code: 401,
      message: {
        title: 'Erreur de connexion à l\'API',
        detail: 'Vous n\'êtes plus autorisé(e) à utiliser l\'api, veuillez vous reconnecter'
      }
    });
  }
}
