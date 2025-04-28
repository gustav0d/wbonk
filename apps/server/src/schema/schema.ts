import { GraphQLSchema } from 'graphql';
import { QueryType } from './query-type';
import { MutationType } from './mutation-type';

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
