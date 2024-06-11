import { FastifyReply, FastifyRequest } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import createError from "http-errors";
import service from "./service";
import { STATUSCODE } from "../../../constants";
import { responseHandler, multipleImages } from "../../../utils";
import { TestChildModel } from "../../../types";

const getAllTestsChild = async (req: FastifyRequest, reply: FastifyReply) => {
  const data = await service.getAll();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No TestsChild found"
      : "All TestsChild retrieved successfully",
  );
};

const getAllTestsChildDeleted = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = await service.getAllDeleted();

  responseHandler(
    req,
    reply,
    data,
    data?.length === STATUSCODE.ZERO
      ? "No Deleted TestsChild found"
      : "All Deleted TestsChild retrieved successfully",
  );
};

const getSingleTestChild = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const data = await service.getById(req.params.id);

  responseHandler(
    req,
    reply,
    data,
    !data ? "No TestChild found" : "TestChild retrieved successfully",
  );
};

const createNewTestChild = async (
  req: FastifyRequest<{ Body: TestChildModel }>,
  reply: FastifyReply,
) => {
  const uploadedImages = await multipleImages(
    req.files as unknown as MultipartFile[],
    [],
  );

  if (uploadedImages.length === STATUSCODE.ZERO)
    throw createError(STATUSCODE.BAD_REQUEST, "Image is required");

  const data = await service.add({
    ...req.body,
    image: uploadedImages,
  });

  responseHandler(req, reply, [data], "TestChild created successfully");
};

const updateTestChild = async (
  req: FastifyRequest<{ Params: { id: string }; Body: TestChildModel }>,
  reply: FastifyReply,
) => {
  const oldData = await service.getImageById(req.params.id);

  const uploadNewImages = await multipleImages(
    req.files as unknown as MultipartFile[],
    oldData?.image.map((image) => image.public_id) || [],
  );

  const data = await service.update(req.params.id, {
    ...req.body,
    image: uploadNewImages,
  });

  responseHandler(req, reply, [data], "TestChild updated successfully");
};

const deleteTestChild = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const data = await service.deleteById(req.params.id);
  responseHandler(
    req,
    reply,
    data?.deleted ? [] : [data],
    data?.deleted
      ? "TestChild is already deleted"
      : "TestChild deleted successfully",
  );
};

const restoreTestChild = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const data = await service.restoreById(req.params.id);

  responseHandler(
    req,
    reply,
    !data?.deleted ? [] : data,
    !data?.deleted
      ? "TestChild is not deleted"
      : "TestChild restored successfully",
  );
};

const forceDeleteTestChild = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const data = await service.forceDelete(req.params.id);

  const message = !data
    ? "No TestChild found"
    : "TestChild force deleted successfully";

  await multipleImages(
    [],
    data?.image ? data.image.map((image) => image.public_id) : [],
  );

  responseHandler(req, reply, data, message);
};

export {
  getAllTestsChild,
  getAllTestsChildDeleted,
  getSingleTestChild,
  createNewTestChild,
  updateTestChild,
  deleteTestChild,
  restoreTestChild,
  forceDeleteTestChild,
};
