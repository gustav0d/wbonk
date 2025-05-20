import Koa from 'koa';
import cors from 'kcors';
import bodyParser from 'koa-bodyparser';
import KoaLogger from 'koa-logger';
import Router from 'koa-router';
import { GraphQLError } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/koa';

import { schema } from '../schema/schema';
import { getContext } from '../get-context';
import { getUser } from '../auth';
import { config, logEnvironments } from '../config';

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

// graphql error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof GraphQLError) {
      if (logEnvironments.includes(config.NODE_ENV)) {
        console.log(error.message);
        console.log(error.locations);
        console.log(error.stack);
      }

      ctx.body = {
        errors: [
          {
            message: error.message,
            locations: error.locations,
            stack:
              config.NODE_ENV === 'dev' || config.NODE_ENV === 'development'
                ? error.stack
                : undefined,
          },
        ],
      };
    } else {
      throw error;
    }
  }
});

const routes = new Router();

const graphqlHandler = createHandler({
  schema,
  context: async (ctx) => {
    const { user } = await getUser(ctx);
    return getContext({ ctx, user });
  },
});

routes.all('/graphql', graphqlHandler);

app.use(routes.routes()).use(routes.allowedMethods());

export { app };
