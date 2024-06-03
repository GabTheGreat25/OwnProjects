import { Logger } from "@nestjs/common";
import { MetaData, ResponsePayload } from "src/types";

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
