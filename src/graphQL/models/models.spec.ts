import { async } from '@angular/core/testing';
import { Models } from './models.model';
import { Structure } from './structure.model';
import { User } from './user.model';

describe('Models', () => {
  describe('#constructor', () => {
    it('should repect structure of input object and references', async(() => {
      const object = {
        a: 'b',
        c: ['a', 'b', {
          a: 'a',
          c: 'c',
          d: 'd'
        }]
      };
      const models = new Models(object);
      expect(models.constructor.name === 'Models').toBe(true);
      expect(models.hasOwnProperty('a')).toBe(true);
      expect(models['a'] === 'b').toBe(true);
      expect(models.hasOwnProperty('c')).toBe(true);
      expect(models['c'] === object.c).toBe(true);
    }));
  });
});

describe('Structure Model', () => {
  describe('#constructor', () => {
    it('should construct', async(() => {
      const struct = new Structure({ name: 'Lala Corp.' });
      expect(struct instanceof Models).toEqual(true);
      expect(struct instanceof Structure).toEqual(true);
      expect(struct.hasOwnProperty('name')).toEqual(true);
      expect(struct['name'] === 'Lala Corp.').toEqual(true);
    }));
  });
});

describe('User Model', () => {
  describe('#constructor', () => {
    it('should construct', async(() => {
      const struct = new User({ name: 'Beth Rave' });
      expect(struct instanceof Models).toEqual(true);
      expect(struct instanceof User).toEqual(true);
      expect(struct.hasOwnProperty('name')).toEqual(true);
      expect(struct['name'] === 'Beth Rave').toEqual(true);
    }));
  });
  describe('#getRoles', () => {
    it('should construct', async(() => {
      const struct = new User({ name: 'Beth Rave', roles: [{ name: 'Jardinier' }, { name: 'Cuisiniere' }] });
      expect(struct.getRoles()).toEqual('Jardinier,Cuisiniere');
    }));
  });
});
