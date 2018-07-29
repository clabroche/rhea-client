import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AuthPageComponent } from './authPage.component';
import { APP_BASE_HREF } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { DefiFormsModule, DefiOverlayModule, DefiCoreModule } from 'ngx-defi-core/dist';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '../../auth/auth.module';
import { GraphQLModule } from '../../graphQL/graphQL.module';

describe('AuthPageComponent', () => {
  let app: AuthPageComponent;
  let fixture: ComponentFixture<AuthPageComponent>;
  let mockLogin
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DefiFormsModule,
        DefiCoreModule.forRoot(),
        GraphQLModule.forRoot(),
        DefiOverlayModule.forRoot(),
        AuthModule
      ],
      declarations: [AuthPageComponent],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthPageComponent);
    app = fixture.componentInstance;
    mockLogin = spyOn(fixture.debugElement.injector.get(AuthService), 'login')
  });

  it('should create the app', () => {
    fixture.detectChanges();
    expect(app).toBeTruthy();
  });

  it('login field validity', () => {
    fixture.detectChanges();
    app.form.controls['login'].setValue('test');
    expect(app.form.controls['login'].valid).toBeTruthy();
    app.form.controls['login'].setValue('');
    expect(app.form.controls['login'].valid).toBeFalsy();
  });

  it('password field validity', () => {
    fixture.detectChanges();
    validators(app.form.controls['password'], '12345 6789@Adl ek²3\"de/*ù', (actualErrors, currentString, indexOfLetter) => {
      if (indexOfLetter > 0 && indexOfLetter < 6) {
        expect(actualErrors['minlength']).toBeTruthy(currentString);
      } else {
        expect(actualErrors['minlength']).toBeFalsy(currentString);
      }
      if (indexOfLetter === 0) {
        expect(actualErrors['required']).toBeTruthy(currentString);
      } else {
        expect(actualErrors['required']).toBeFalsy(currentString);
      }
    });
  });

  it('submit correctly', async () => {
    fixture.detectChanges();
    expect(app.form.valid).toBeFalsy();
    const user = {
      login: 'test@test.test',
      password: '123456789',
    };
    app.form.controls['login'].setValue(user.login);
    app.form.controls['password'].setValue(user.password);

    expect(app.form.valid).toBeTruthy();
    mockLogin.and.returnValue(Promise.resolve());
    spyOn(app.notificationService, 'add');

    await app.connect();

    expect(app['authService'].login).toHaveBeenCalledWith(user);
    expect(app.notificationService.add).toHaveBeenCalledTimes(0);
  });

  it('shouln\'t submit correctly', async () => {
    fixture.detectChanges();
    expect(app.form.valid).toBeFalsy();
    const user = {
      login: 'test@test.test',
      password: '123456789',
    };
    app.form.controls['login'].setValue(user.login);
    app.form.controls['password'].setValue(user.password);

    expect(app.form.valid).toBeTruthy();

    mockLogin.and.returnValue(Promise.reject('error'));
    spyOn(app.notificationService, 'add');
    await app.connect();

    expect(app['authService'].login).toHaveBeenCalledWith(user);
    expect(app.notificationService.add).toHaveBeenCalledWith('Impossible de se connecter ', 'Utilisateur ou mot de passe inconnus');
  });
});

function validators(fields, string, jasminefun) {
  for (let i = 0; i < string.length + 1; i++) {
    const element = string.slice(0, i);
    fields.setValue(element);
    const errors = fields.errors || {};
    jasminefun(errors, element, i);
  }
}
