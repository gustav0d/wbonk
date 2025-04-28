import { GraphQLContext } from '@/graphql/context';
import { nodeField, nodesField } from '@/modules/node/typeRegister';
// import { SomethingLoader } from '@/modules/something/something-loader';
// import { SomethingConnection } from '@/modules/something/something-type';
import { GraphQLObjectType } from 'graphql';
import { connectionArgs } from 'graphql-relay';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    // something: {
    //   type: SomethingConnection.connectionType,
    //   args: {
    //     ...connectionArgs,
    //   },
    //   resolve: async (_, args, context: GraphQLContext) =>
    //     await SomethingLoader.loadAll(context, args),
    // },
  }),
});
