import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CltPassword, CltThemeManagerComponent } from 'ngx-callisto/dist';
import { CommonService } from '../../providers/common.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  accountForm: FormGroup
  passwordForm: FormGroup
  @ViewChild('themeManager') themeManager: CltThemeManagerComponent;
  theme;
  constructor(
    public auth: AuthService,
    private graphql: GraphQLService,
    private fb: FormBuilder,
    private common: CommonService
  ) { }

  ngOnInit() {
    const generatePassword = CltPassword.GeneratePassword();
    this.accountForm = this.fb.group({
      login: [this.auth.me.login, Validators.required],
    })
    this.passwordForm = this.fb.group({
      passphrase: [generatePassword, [Validators.required, Validators.minLength(6)]],
      recheckPassphrase: [generatePassword, Validators.required]
    }, { validator: CltPassword.MatchPassword })
    setInterval(() => {
      window.localStorage.setItem('theme', JSON.stringify(this.themeManager.themeService.theme))
    },1000);
  }

  changeAuth() {
    this.graphql.mutation(`
      accountUpdate(uuid: ${this.auth.me.uuid}, input:${
        this.graphql.stringifyWithoutPropertiesQuote(this.accountForm)
      })
    `)
  }

}
