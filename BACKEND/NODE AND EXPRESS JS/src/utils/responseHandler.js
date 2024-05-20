const responseHandler = (res, message, data) => {
  if (!data) {
    res.send({ status: false, message: message, data: [] });
  } else res.send({ status: true, message: message, data });
};

export default responseHandler;
