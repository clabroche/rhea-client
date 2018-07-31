import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { cloneDeep } from 'lodash';

import { DictionnaireService } from './dictionnaire.service';

/**
 * CRUD from graphQL API
 */
@Injectable()
export class GraphQLService {

  /**
   * import apollo to deal with graphQL
   * @param apollo
   */
  constructor(
    private apollo: Apollo,
    private dictionnaire: DictionnaireService
  ) {}

  /**
   * Get all
   */
  async query(query, fragments?): Promise<any> {
    return this.apollo.query({
      query: gql`
        query {
          ${query}
        }
        ${fragments || ''}`,
      fetchPolicy: 'network-only'
    }).toPromise().catch(() => undefined)
    .then(result => {
        if (!result) return {};
        if (result.hasOwnProperty('errors')) return Promise.reject(result.errors);
        return this.transform(cloneDeep(result.data));
      });
  }

  /**
   * Launch mutation
   */
  async mutation(mutation): Promise<any> {
    const mutationPromise = this.apollo.mutate({
      mutation: gql`
        mutation {
          ${mutation}
        }`
      }).toPromise().catch(() => undefined);

      return mutationPromise.then(result => {
        if (!result) return {};
        if (result.hasOwnProperty('errors')) return Promise.reject(result.errors);
        return this.transform(JSON.parse(JSON.stringify(result.data)));
      });
  }

  /**
   * Transform a GraphQL object to angular classes
   * @param data
   */
  transform(data): any {
    if (data && data !== null) {
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object')
          this.transform(data[key]);
        data[key] = this.dictionnaire.load(key, data[key]) || data[key];
      });
    }
    return data;
  }

  promiseTimeout = function (ms, promise) {

    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject('Timed out in ' + ms + 'ms.');
      }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
      promise,
      timeout
    ]);
  };


  /**
   * stringifyWithoutPropertiesQuote
   */
  stringifyWithoutPropertiesQuote(obj) {
    return JSON.stringify(obj)
      .replace(/(\{ *"enum" *\: *")([a-z A-Z 0-9]*)" *}/gm, '$2')
      .replace(/\\"/g, '\uFFFF')
      .replace(/\"([^"]+)\":/g, '$1:')
      .replace(/\uFFFF/g, '\\"');
  }

}
