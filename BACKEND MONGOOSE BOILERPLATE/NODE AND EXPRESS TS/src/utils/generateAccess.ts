import generateToken from "./generateToken";

export default function generateAccess(payload: any = {}): { access: string } {
  const accessToken = generateToken(payload, "7d");
  return {
    access: accessToken,
  };
}
