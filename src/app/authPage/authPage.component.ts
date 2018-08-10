import { Component, ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CltNotificationsService } from 'ngx-callisto/dist';

/**
 * It's the Home main component
 */
@Component({
  selector: 'auth-page',
  templateUrl: './authPage.component.html',
  styleUrls: ['./authPage.component.scss']
})
export class AuthPageComponent implements OnInit {
  form: FormGroup;
  credentials = {}
  @ViewChild('password') password;

  /**
   * load dependencies
   * @param authService
   */
  constructor(private authService: AuthService, public notificationService: CltNotificationsService, private fb: FormBuilder) {}

  ngOnInit() {
    const credentials = window.localStorage.getItem('credentials') ? JSON.parse(window.localStorage.getItem('credentials')) : {login:'', password:''}
    this.form = this.fb.group({
      login: [credentials.login, [Validators.required]],
      password:  [credentials.password, [Validators.minLength(6), Validators.required]],
    });
  }
  /**
   * Connect user with credentials
   * @param formResult
   */
  async connect() {
    if  (this.form.valid) {
      await this.authService.login(this.form.value).then(_ => this.form.reset()).catch(err => {
        this.notificationService.add('Impossible de se connecter ', 'Utilisateur ou mot de passe inconnus');
      });
    } else {
      this.notificationService.add('Impossible de se connecter ', 'Utilisateur ou mot de passe inconnus');
    }
  }
}

