import { Component, OnInit, ViewChildren, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { GraphQLService } from '../../../graphQL/providers/graphQL.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CltPassword, CltThemeManagerComponent, CltPopupComponent } from 'ngx-callisto/dist';
import { CommonService } from '../../providers/common.service';
const version = require('../../../../package.json')
@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy{
  accountForm: FormGroup
  passwordForm: FormGroup
  accountCreateForm: FormGroup;
  accounts = []
  version = version.version
  @ViewChild('themeManager') themeManager: CltThemeManagerComponent;
  @ViewChild('accountPopup') accountPopup: CltPopupComponent;
  theme;
  timer; 
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
    this.accountCreateForm = this.fb.group({
      login: ['', Validators.required],
      passphrases: this.fb.group({
        passphrase: ['', [Validators.required, Validators.minLength(6)]],
        recheckPassphrase: ['', Validators.required]
      }, { validator: CltPassword.MatchPassword })
    })
    this.getAllAccounts()
    this.timer = setInterval(() => {
      window.localStorage.setItem('theme', JSON.stringify(this.themeManager.themeService.theme))
    },1000);
  }

  getAllAccounts() {
    this.graphql.query(`
      accounts { login }
    `).then(account => this.accounts = account.accounts)
  }

  ngOnDestroy() {
    clearInterval(this.timer)
  }

  changeAuth() {
    return this.graphql.mutation(`
      accountUpdate(uuid: ${this.auth.me.uuid}, input:${
        this.graphql.stringifyWithoutPropertiesQuote(this.accountForm.value)
      }) {
        uuid
      }
    `)
  }

  createAccount() {
    this.accountCreateForm.reset();
    this.accountPopup.bindForm(this.accountCreateForm).open().subscribe(result=>{
      if(!result) return;
      return this.graphql.mutation(`
        accountCreate(input:${
          this.graphql.stringifyWithoutPropertiesQuote({
            login: this.accountCreateForm.value.login,
            password: this.accountCreateForm.value.passphrases.passphrase
          })
        }) {uuid}`
      ).then(_=>this.getAllAccounts())
    })
  }
}
