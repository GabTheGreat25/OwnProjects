import { transporter } from "../config/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";
import { ENV } from "../config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mail = path.join(__dirname, "../views/reset.html");
const content = fs.readFileSync(mail, "utf8");

const template = handlebars.compile(content);

export const sendEmail = (email, randomCode) => {
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
