export function responseHandler(res, message, data, meta = {}) {
  res.send({
    status: !!data,
    data: data || [],
    message: message,
    meta: meta,
  });
}
