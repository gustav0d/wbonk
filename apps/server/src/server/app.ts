import cors from 'kcors';
import Koa, { ParameterizedContext, Request, Response } from 'koa';
import bodyParser from 'koa-bodyparser';
import { graphqlHTTP, OptionsData } from 'koa-graphql';
import KoaLogger from 'koa-logger';
import Router from 'koa-router';

import { schema } from '@/schema/schema';
import { getContext } from '@/getContext';
import { GraphQLError } from 'graphql';
import { getUser } from '@/auth';
import { config, logEnvironments } from '@/config';

const app = new Koa();

app.use(cors({ origin: '*' }));
if (logEnvironments.includes(config.NODE_ENV)) {
  app.use(KoaLogger());
}
app.use(
  bodyParser({
    onerror(err, ctx) {
      ctx.throw(err, 422);
    },
  })
);

const routes = new Router();

const graphqlSettingsPerReq = async (
  _: Request,
  __: Response,
  ctx: ParameterizedContext
) => {
  const { user } = await getUser(ctx);
  return {
    graphiql: process.env.NODE_ENV !== 'production',
    schema,
    context: await getContext({
      ctx,
      user,
    }),
    customFormatErrorFn: (error: GraphQLError) => {
      if (logEnvironments.includes(config.NODE_ENV)) {
        // eslint-disable-next-line
        console.log(error.message);
        // eslint-disable-next-line
        console.log(error.locations);
        // eslint-disable-next-line
        console.log(error.stack);
      }
      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  } as OptionsData;
};

routes.all('/graphql', graphqlHTTP(graphqlSettingsPerReq));

app.use(routes.routes()).use(routes.allowedMethods());

export { app };
