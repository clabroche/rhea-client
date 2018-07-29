import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql } from 'graphql';
import { async } from '@angular/core/testing';
import { GraphQLService } from './graphQL.service';

import { fromPromise } from 'rxjs/observable/fromPromise';

describe('GraphQLService', () => {
  let service: GraphQLService;
  let query;
  let mutation;
  const Dictionnaire = jasmine.createSpyObj('Dictionnaire', ['load']);
  const Apollo = jasmine.createSpyObj('Apollo', ['query', 'mutation']);
  beforeEach(() => {
    // mock apolloquery to deliver mock data specify by query variable
    Apollo.query = data => fromPromise(graphql(mockInterface(), query));
    Apollo.mutate = data => fromPromise(graphql(mockInterface(), mutation));

    service = new GraphQLService(Apollo, Dictionnaire);
  });

  describe('#query', () => {
    it('should query', async () => {
      query = `query tasksForUser { person(id:2){ id, name } }`;
      const data = await service.query(query);
      expect(data.person.id).toEqual('2');
      expect(data.person.name).toEqual('billy');

      query = `query tasksForUser { pers { id, name } }`;
      await service.query(query)
        .then(result => {
          console.error(result);
        })
        .catch(errs => {
          errs.map(err => {
            expect(err.hasOwnProperty('message')).toEqual(true);
          });
        });
    });
  });
  describe('#transform', () => {
    it('should transform', async () => {
      // tslint:disable:no-shadowed-variable
      const Dictionnaire = jasmine.createSpyObj('Dictionnaire', ['load']);
      const service = new GraphQLService(Apollo, Dictionnaire);

      const data = await service.transform({ a: 123 });
      expect(data.hasOwnProperty('a')).toEqual(true);
      expect(data.a).toEqual(123);

      function MockPerson(prop) { this.a = prop.a; }

      Dictionnaire.load.and.returnValue(new MockPerson({ a: 123 }));
      const transformed = await service.transform({ a: 123 });
      expect(transformed.a.constructor.name).toEqual('MockPerson');
    });
  });
  describe('#mutation', () => {
    it('should mutate', async(() => {
      mutation = `mutation test { createPerson(name:"test") { id,name}}`;
      return service.mutation(mutation)
        .then(data => {
          expect(data.hasOwnProperty('createPerson')).toBeTruthy();
        }).catch(err => {
          expect(true).toBeFalsy('shouldn\'t pass here');
        });
    }));
    it('should not mutate', () => {
      mutation = `mutation test { createPerso(name:"test") { id,name}}`;
      service.mutation(mutation)
        .then(data => {
          expect(true).toBeFalsy('shouldn\'t pass here');
        })
        .catch(errs => {
          errs.map(err => {
            expect(err.hasOwnProperty('message')).toEqual(true);
          });
        });
    });
  });
});


function mockInterface () {
  const baseSchema = `
        type Query {
            persons: [Person]
            person(id: ID): Person
        }
        type Person {
          id: ID
          name: String
        }
        type Mutation {
          createPerson(name:String): Person
        }
        schema {
          query: Query
          mutation: Mutation
        }`;


  const persons = [
    { id: 1, name: 'toto' },
    { id:  2,  name : 'billy'}
  ];
  const resolvers = {
    Mutation: {
      createPerson(_, { name }) {
        return {id:  8, name};
      },
    },
    Query: {
      person(_, { id }) {
        const a = persons.filter(person => person.id  === person.id);
        return a.pop();
      }
    }
  };


  const options = {
    typeDefs: [baseSchema],
    resolvers
  };
  const executableSchema = makeExecutableSchema(options);

  addMockFunctionsToSchema({
    schema: executableSchema,
    preserveResolvers:  true
  });
  return executableSchema;
}
