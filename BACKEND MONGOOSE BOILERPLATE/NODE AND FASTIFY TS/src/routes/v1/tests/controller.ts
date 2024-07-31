import { FastifyReply, FastifyRequest } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import createError from "http-errors";
import service from "./service";
import { STATUSCODE } from "../../../constants";
import { responseHandler, multipleImages } from "../../../utils";
import { TestModel } from "../../../types";
import { ClientSession } from "mongoose";

let session: ClientSession | null = null;

const getAllTests = async (req: FastifyRequest, reply: FastifyReply) => {
  const data = await service.getAll();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Tests found"
      : "All Tests retrieved successfully",
  );
};

const getAllTestsDeleted = async (req: FastifyRequest, reply: FastifyReply) => {
  const data = await service.getAllDeleted();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted Tests found"
      : "All Deleted Tests retrieved successfully",
  );
};

const getSingleTest = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    req,
    reply,
    data,
    !data ? "No Test found" : "Test retrieved successfully",
  );
};

const createNewTest = async (
  req: FastifyRequest<{ Body: TestModel }>,
  reply: FastifyReply,
) => {
  const uploadedImages = await multipleImages(
    req.files as unknown as MultipartFile[],
    [],
  );

  if (uploadedImages.length === STATUSCODE.ZERO)
    throw createError(STATUSCODE.BAD_REQUEST, "Image is required");

  const data = await service.add(
    {
      ...req.body,
      image: uploadedImages,
    },
    session,
  );

  responseHandler(req, reply, [data], "Test created successfully");
};

const updateTest = async (
  req: FastifyRequest<{ Params: { id: string }; Body: TestModel }>,
  reply: FastifyReply,
) => {
  const oldData = await service.getById(req.params.id);

  const uploadNewImages = await multipleImages(
    req.files as unknown as MultipartFile[],
    oldData?.image.map((image: any) => image.public_id) || [],
  );

  const data = await service.update(
    req.params.id,
    {
      ...req.body,
      image: uploadNewImages,
    },
    session,
  );

  responseHandler(req, reply, [data], "Test updated successfully");
};

const deleteTest = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const data = await service.deleteById(req.params.id, session);

  responseHandler(
    req,
    reply,
    data?.deleted ? [] : [data],
    data?.deleted ? "Test is already deleted" : "Test deleted successfully",
  );
};

const restoreTest = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const data = await service.restoreById(req.params.id, session);

  responseHandler(
    req,
    reply,
    !data?.deleted ? [] : [data],
    !data?.deleted ? "Test is not deleted" : "Test restored successfully",
  );
};

const forceDeleteTest = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const data = await service.forceDelete(req.params.id, session);

  const message = !data ? "No Test found" : "Test force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image: any) => image.public_id) : [],
  );

  responseHandler(req, reply, [data], message);
};

export {
  getAllTests,
  getAllTestsDeleted,
  getSingleTest,
  createNewTest,
  updateTest,
  deleteTest,
  restoreTest,
  forceDeleteTest,
};
