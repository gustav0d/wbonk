import { ParameterizedContext } from 'koa';
import { getDataloaders } from './modules/loader/loaderRegister';
import { UserDocument } from './modules/user/user-model';

interface ContextVars {
  ctx?: ParameterizedContext;
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
