import { Dataloaders } from '@/modules/loader/loaderRegister';
import { ParameterizedContext } from 'koa';

interface GraphQLContext {
  ctx: ParameterizedContext;
  dataloaders: Dataloaders;
}

export type { GraphQLContext };
