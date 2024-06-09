export function responseHandler(req, reply, data, message, meta = {}) {
  const response = {
    status: !!data,
    data: data || [],
    message: message,
    meta: meta,
  };

  req.log.info(`Response: ${JSON.stringify(response)}`);

  reply.send(response);
}
