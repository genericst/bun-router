import { match, parseParams, parseURI } from "./core/helpers";
import { HTTPMethod } from "./core/http";
import { Handler } from "./types";

interface Endpoint {
  method: HTTPMethod;
  template: string;
  handler: Handler;
}

export default class Router {
  endpoints: Endpoint[] = [];

  register(method: HTTPMethod, template: string, handler: Handler) {
    this.endpoints.push({ method, template, handler });
  }

  async handle(request: Request): Promise<Response> {
    const { method, url } = request;
    const { query, filters } = parseURI(url);
    const endpoint = this.endpoints.find(
      ({ method: endpointMethod, template }) =>
        endpointMethod === method && match(query, template)
    );
    if (!endpoint) return new Response(null, { status: 404 });
    const body = await request.json();
    const { handler, template } = endpoint;
    const params = parseParams(query, template);
    let result;
    try {
      result = await handler({ body, filters, params, request });
    } catch (error: unknown) {
      const message = (error as Error).message;
      return new Response(message, { status: 500 });
    }
    if (result instanceof Response) return result;
    else if (typeof result === "string") return new Response(result);
    else if (typeof result === "object")
      return new Response(JSON.stringify(result));
    else return new Response();
  }
}
