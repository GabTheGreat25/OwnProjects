import generateAccess from "./generateAccess.js";

export default async (session, operations, action) => {
  let data;

  return await session
    .withTransaction(async () => {
      const temp = await operations();
      data = !Array.isArray(temp) ? [temp] : temp;
    })
    .then(() => {
      return {
        data,
        status: "success",
        message: `${action} success`,
        meta: {
          access: generateAccess(),
        },
      };
    })
    .catch((e) => {
      return {
        data: [],
        status: "fail",
        message: `${e} failed`,
        meta: {
          access: generateAccess(),
        },
      };
    })
    .finally(() => {
      session.endSession();
    });
};
