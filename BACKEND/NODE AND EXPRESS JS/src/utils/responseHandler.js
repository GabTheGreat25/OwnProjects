export default function responseHandler(res, message, data, meta = {}) {
  res.send({
    status: !!data,
    message: message,
    data: data || [],
    meta: meta,
  });
}
