import { createTransport } from "nodemailer";
import { RESOURCE } from "src/constants";
import { ENV } from "src/config";

export const transporter = createTransport({
  service: RESOURCE.GMAIL,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.EMAIL_PASSWORD,
  },
});
