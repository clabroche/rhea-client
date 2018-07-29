
import { Subject } from 'rxjs';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// Apollo
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, from } from 'apollo-link';
import { GraphQLService } from './providers/graphQL.service';
import { DictionnaireService } from './providers/dictionnaire.service';
import { onError, ErrorHandler } from 'apollo-link-error';
import { JwtService } from '../auth/jwt.service';
import { AuthService } from '../auth/auth.service';

const azerty = require('./fragmentTypes.json');
export const GraphQLError = new Subject();


/**
 * Module that provide all GraphQL definition
 */
 @NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: GraphQLModule,
      providers: [
        GraphQLService,
        DictionnaireService
      ]
    };
  }

  afterware = (operation, forward) => {
    return forward(operation).map((response) => {
      return response;
    });
  }

  errorFunction = (handleError) => {
    const networkError = handleError.networkError;
    const graphQLErrors = handleError.graphQLErrors;
    if (networkError) {
      const status = networkError['status'];
      switch (status) {
        case 0:
          this.authService.deconnect();
          GraphQLError.next({
            code: networkError['status'],
            message: {
              title: `Erreur de l'API`,
              detail: `L'API ne semble pas accessible, veuillez contacter l'administrateur du système`
            }, deleteAll: true
          });
        break;
        case 401:
          this.authService.deconnect();
          GraphQLError.next({
            code: networkError['status'],
            message: {
              title: `Erreur d'accès à l'API`,
              detail: `Vous n'êtes pas autorisé(e) à utiliser l'api, veuillez vous reconnecter`
            }, deleteAll: true
          });
        break;
        case 403:
          GraphQLError.next({
            code: networkError['status'],
            message: {
              title: `Erreur d'accès à l'API`,
              detail: `Vous n'avez pas les droits pour faire cette action, veuillez contacter l'administrateur`
            }
          });
        break;
        default:
          GraphQLError.next({
            code: networkError['status'],
            message: {
              title: `Erreur réseau: ${networkError['status']}`,
              detail: 'Un problème est survenu lors de la communication avec l\'API'
            }
          });
        break;
      }
    }
    if (graphQLErrors && graphQLErrors.length) {
      graphQLErrors.map(err => {
        console.error(err);
      });
      GraphQLError.next({
        code: 500,
        message: {
          title: `Erreur API`,
          detail: `Un problème est survenu lors du traitement de l'action dans l'API`
        }
      });
    }
  }

  authMiddleware = (operation, forward) => {
    // add the authorization to the headers
    operation.setContext({
      headers: {
        authorization: 'bearer ' + this.jwtService.getToken(),
      }
    });
    return forward(operation);
  }
  /**
   * Build instance of Apollo
   * @param apollo graphQL conector
   * @param httpLink Module Http to query over network
   */
  constructor(
    apollo: Apollo, httpLink: HttpLink,
    private jwtService: JwtService,
    private authService: AuthService
  ) {
    const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData: azerty });
    // create Apollo
    apollo.create({
      link: from([
        new ApolloLink(this.authMiddleware),
        new ApolloLink(this.afterware),
        onError(<ErrorHandler>this.errorFunction),
        httpLink.create({ uri: window.location.protocol + '//' + window.location.hostname + ':3000/graphql' })
      ]),
      cache: new InMemoryCache({fragmentMatcher})
    });
  }
}
