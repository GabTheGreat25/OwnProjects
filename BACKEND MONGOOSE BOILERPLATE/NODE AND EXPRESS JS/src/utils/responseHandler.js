export function responseHandler(res, data, message, meta = {}) {
  res.send({
    status: !!data,
    data: data || [],
    message: message,
    meta: meta,
  });
}
