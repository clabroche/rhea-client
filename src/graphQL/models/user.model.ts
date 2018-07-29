import { Models } from './models.model';

/**
 * Describe an user
 */
export class User extends Models {
    /**
     * Load data into user
     * @param user
     */
    constructor(model: any) {
        super(model);
    }

    /**
     * Get roles with string
     */
    getRoles() {
        const roles = [];
        this['roles'].map(role => {
            if (role) { roles.push(role.name); }
        });
        return roles.join(',');
    }
}
