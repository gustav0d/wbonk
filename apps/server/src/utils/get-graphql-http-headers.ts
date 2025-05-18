import { Request } from 'graphql-http';
import { RequestContext } from 'graphql-http/lib/use/koa';
import { IncomingMessage } from 'node:http';
import { LooseAutocomplete } from './loose-autocomplete-type';

type HeaderKeyType = LooseAutocomplete<'authorization'>;

export function getGraphQLHttpHeaders(
  ctx: Request<IncomingMessage, RequestContext>,
  headerKey: HeaderKeyType
) {
  if (typeof ctx.headers.get === 'function') {
    return ctx.headers.get(headerKey);
  }

  if (typeof ctx.headers === 'object') {
    const header = (
      ctx.headers as Record<string, string | string[] | undefined>
    )[headerKey];
    if (Array.isArray(header)) {
      return header[0] ?? null;
    } else if (typeof header === 'string') {
      return header;
    }
  }

  return null;
}
