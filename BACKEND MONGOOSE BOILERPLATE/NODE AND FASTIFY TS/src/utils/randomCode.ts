import { STATUSCODE } from "../constants";

export const generateRandomCode = () => {
  const length = 6;

  let code = "";

  for (let i = STATUSCODE.ZERO; i < length; i++)
    code += Math.floor(Math.random() * 10);

  return code;
};
