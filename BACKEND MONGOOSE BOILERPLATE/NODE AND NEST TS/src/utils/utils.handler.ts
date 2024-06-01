import { MetaData, ResponsePayload } from "src/types";
import { Logger } from "@nestjs/common";

const logger = new Logger("ResponseHandler");

export function responseHandler(
  data: any,
  message: string,
  meta: MetaData = {},
): ResponsePayload {
  const response = {
    status: !!data,
    data: data || [],
    message: message,
    meta: meta,
  };

  logger.log(`Response: ${JSON.stringify(response)}`);

  return response;
}
