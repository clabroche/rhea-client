import {GraphQLModule, GraphQLError} from './graphQL.module';
import { DefiCommonService } from 'ngx-defi-core/dist';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { JwtService } from '../auth/jwt.service';
import { map } from 'bluebird';

describe('GraphQL Module', () => {

  it('#errorFunction', async () => {
    const authService = jasmine.createSpyObj('AuthService', ['deconnect']);
    authService.auth = true;
    authService.deconnect = function () { this.auth = false; };

    jasmine.createSpyObj('NotificationsService', ['construct']);

    const graph = new GraphQLModule(
      new Apollo(),
      new HttpLink(jasmine.createSpyObj('HttpClient', ['construct'])),
      new JwtService(),
      authService,
    );


    await new Promise((resolve, reject) => {
      const subscribe = GraphQLError.subscribe(({ message, code }) => {
        expect(message).not.toBeUndefined();
        expect(code).toEqual(401);
        subscribe.unsubscribe();
        resolve();
      });
      graph.errorFunction({
        graphQLErrors: null,
        response: null,
        networkError: {
          status: 401
        },
      });
    });
    const checkNetworkCodes = async _codes => {
      await map(_codes, _code => {
        return new Promise((resolve, reject) => {
          // tslint:disable-next-line:no-shadowed-variable
          const subscribe = GraphQLError.subscribe(({ message, code }) => {
            expect(message).not.toBeUndefined();
            expect(_code).toEqual(code);
            subscribe.unsubscribe();
            resolve();
          });
          graph.errorFunction({
            networkError: {
              status: _code
            },
            graphQLErrors: null,
            response: null,
          });
        });
      });
    };
    await checkNetworkCodes([401, 403]);

    await new Promise((resolve, reject) => {
      const subscribe = GraphQLError.subscribe(({ message, code }) => {
        expect(message).not.toBeUndefined();
        expect(code).toEqual(500);
        subscribe.unsubscribe();
        resolve();
      });
      graph.errorFunction({
        graphQLErrors: ['error!'],
        networkError: null,
        response: null,
      });
    });
  });
});
