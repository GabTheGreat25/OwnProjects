export interface MetaData {
  [key: string]: any;
}

export interface ResponsePayload {
  status: boolean;
  data: any;
  message: string;
  meta: MetaData;
}

export interface UploadImages {
  public_id: string;
  url: string;
  originalname: string;
}

export interface VerifyCode {
  code?: string;
  createdAt?: Date;
}
