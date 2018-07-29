import { Injectable } from '@angular/core';

/**
 * Manage Token against localStorage
 */
@Injectable()
export class JwtService {

    /**
     * Get the Token from localStorage
     */
    getToken(): String {
        return window.localStorage['jwtToken'] || "";
    }

    /**
     * Save the token in localStorage
     * @param token 
     */
    saveToken(token: String) {
        window.localStorage['jwtToken'] = token;
    }

    /**
     * Delete the token in localStorage
     */
    destroyToken() {
        window.localStorage.removeItem('jwtToken');
    }

}