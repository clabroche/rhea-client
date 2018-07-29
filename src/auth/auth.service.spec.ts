import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';


describe('AuthService', () => {
  let service: AuthService;
  let httpClient: HttpClient;

  beforeEach(async () => {
    const CommonService = jasmine.createSpyObj('CommonService', ['getValue']);
    CommonService.refreshTokenInterval = 300;

    const JwtService = jasmine.createSpyObj('JwtService', ['saveToken', 'getToken']);
    JwtService.saveToken.and.returnValue('aaaaa');

    const GraphQLService = jasmine.createSpyObj('GraphQLService', ['query']);
    GraphQLService.query.and.returnValue({a: 'a'});

    service = new AuthService(
      CommonService,
      JwtService,
      GraphQLService,
      httpClient
    );
  });
  it('should be instanciate correctly', async function () {
    clearInterval(service.tokenRefresh);
  });
});
