import type { Request } from 'graphql-http';
import type { IncomingMessage } from 'node:http';
import type { RequestContext } from 'graphql-http/lib/use/koa';
import { getDataloaders } from './modules/loader/loaderRegister';
import { UserDocument } from './modules/user/user-model';

export type RequestGraphQLContext = Request<IncomingMessage, RequestContext>;

interface ContextVars {
  ctx?: RequestGraphQLContext;
  user: UserDocument | null;
}

async function getContext({ ctx, user }: ContextVars) {
  const dataloaders = getDataloaders();

  return {
    ctx,
    dataloaders,
    user,
  } as const;
}

export { getContext };
