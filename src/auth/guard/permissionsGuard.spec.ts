import { PermissionsGuard } from "./permissionsGuard";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { DefiNotificationsService } from "ngx-defi-core/dist";


describe('PermissionGuard', function(){
    let permissionsGuard: PermissionsGuard;
    let router = {navigate: jasmine.createSpy('navigate')};
    let authService = {me:{},permissions:[]};
    let notifsService = {add: jasmine.createSpy('add')};

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                PermissionsGuard,
                { provide: AuthService, useValue: authService },
                { provide: DefiNotificationsService, useValue: notifsService },
                { provide: Router, useValue: router }
            ]
        }).compileComponents();
    });

    it('should activate or not', async () => {
        permissionsGuard = TestBed.get(PermissionsGuard)
        let route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['constructor']);
        route.data =  {permissions: ['create user']}
        
        let result = await permissionsGuard.canActivate(route)
        expect(result).toEqual(false)
        
        permissionsGuard['userService'].permissions = ['create user']
        result = await permissionsGuard.canActivate(route)
        expect(result).toEqual(true)
    });
})