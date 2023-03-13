/**
 *
 * @param  {Request} request
 * @param  {Env} env
 * @param  {ExecutionContext} ctx
 * @returns Promise
 */
export default {
  async fetch(
    request: Request,
    env: {},
    ctx: ExecutionContext
  ): Promise<Response> {
    return await new Response("Hello World");
  },
};
