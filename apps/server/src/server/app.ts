import cors from 'kcors';
import Koa, { ParameterizedContext, Request, Response } from 'koa';
import bodyParser from 'koa-bodyparser';
import { graphqlHTTP } from 'koa-graphql';
import KoaLogger from 'koa-logger';
import Router from 'koa-router';

import { schema } from '@/schema/schema';
import { getContext } from '@/getContext';
import { GraphQLError } from 'graphql';

const app = new Koa();

app.use(cors({ origin: '*' }));
app.use(KoaLogger());
app.use(
  bodyParser({
    onerror(err, ctx) {
      ctx.throw(err, 422);
    },
  })
);

const routes = new Router();

routes.all(
  '/graphql',
  graphqlHTTP(async (_: Request, __: Response, ctx: ParameterizedContext) => {
    return {
      graphiql: process.env.NODE_ENV !== 'production',
      schema,
      context: await getContext({
        ctx,
      }),
      customFormatErrorFn: (error: GraphQLError) => {
        // eslint-disable-next-line
        console.log(error.message);
        // eslint-disable-next-line
        console.log(error.locations);
        // eslint-disable-next-line
        console.log(error.stack);

        return {
          message: error.message,
          locations: error.locations,
          stack: error.stack,
        };
      },
    };
  })
);

app.use(routes.routes());
app.use(routes.allowedMethods());

export { app };
