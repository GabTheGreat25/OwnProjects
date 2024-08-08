import { transporter, ENV } from "src/config";
import * as fs from "fs";
import * as path from "path";
import * as handlebars from "handlebars";

const mailTemplatePath = path.join(__dirname, "../views/reset.html");
const templateContent = fs.readFileSync(mailTemplatePath, "utf8");
const template = handlebars.compile(templateContent);

export const sendEmail = async (email: string, randomCode: string) => {
  const replacement = {
    randomCode: randomCode,
  };

  const htmlContent = template(replacement);

  await transporter.sendMail({
    from: ENV.EMAIL,
    to: email,
    subject: "Reset Account Password",
    html: htmlContent,
  });
};
