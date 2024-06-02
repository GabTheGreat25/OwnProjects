import { Response } from "express";
import { MetaData } from "../types";

export function responseHandler(
  res: Response,
  data: any,
  message: string,
  meta: MetaData = {},
): void {
  res.send({
    status: !!data,
    data: data || [],
    message: message,
    meta: meta,
  });
}
