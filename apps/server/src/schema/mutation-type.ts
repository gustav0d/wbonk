// import { somethingMutations } from '@/modules/something/mutations';
import { GraphQLObjectType } from 'graphql';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // ...somethingMutations,
  }),
});
