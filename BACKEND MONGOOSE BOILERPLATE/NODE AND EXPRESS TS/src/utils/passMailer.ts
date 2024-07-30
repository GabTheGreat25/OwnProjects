import { transporter, ENV } from "../config";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const mail = path.join(__dirname, "../views/reset.html");
const content = fs.readFileSync(mail, "utf8");

const template = handlebars.compile(content);

export const sendEmail = (email: string, randomCode: string) => {
  const replacement = {
    randomCode: randomCode,
  };

  const index = template(replacement);

  return transporter.sendMail({
    from: ENV.EMAIL,
    to: `${email}`,
    subject: "Reset Account Password",
    html: index,
  });
};
