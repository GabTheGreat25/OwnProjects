export function responseHandler(app, reply, data, message, meta = {}) {
  const response = {
    status: !!data,
    data: data || [],
    message: message,
    meta: meta,
  };

  app.log.info(`Response: ${JSON.stringify(response)}`);

  reply.send(response);
}
