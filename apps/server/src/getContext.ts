import { ParameterizedContext } from 'koa';
import { getDataloaders } from './modules/loader/loaderRegister';

interface ContextVars {
  ctx?: ParameterizedContext;
}

async function getContext({ ctx }: ContextVars) {
  const dataloaders = getDataloaders();

  return {
    ctx,
    dataloaders,
  } as const;
}

export { getContext };
