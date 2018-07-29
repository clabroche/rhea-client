import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonService } from './providers/common.service';
import { CltNavigationsModule, CltOverlayModule, CltFormsModule } from 'ngx-callisto/dist';
import { GraphQLModule } from '../graphQL/graphQL.module';
import { AuthModule } from '../auth/auth.module';
import { AuthPageComponent } from './authPage/authPage.component';
import { AuthService } from '../auth/auth.service';
import { RheaSdkModule } from './rhea-sdk/rhea-sdk.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CltNavigationsModule.forRoot(),
    CltOverlayModule.forRoot(),
    RheaSdkModule,
    CltFormsModule,
    RouterModule.forRoot([
      { path: '', resolve: { authService: AuthService }, children: [
          { path: '', redirectTo: '/shoppingLists', pathMatch: 'full'},
          { path: 'shoppingLists', loadChildren: 'src/app/shopping-list/shopping-list.module#ShoppingListModule'}
        ]
      }
    ]),
    GraphQLModule.forRoot(),
    AuthModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
