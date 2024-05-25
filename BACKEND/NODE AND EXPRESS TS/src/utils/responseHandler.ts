import { Response } from "express";
import { MetaData } from "../types";

export default function responseHandler(
  res: Response,
  message: string,
  data: any,
  meta: MetaData = {}
): void {
  res.send({
    status: !!data,
    message: message,
    data: data || [],
    meta: meta,
  });
}
