import { PipelineStage } from "mongoose";
import { RESOURCE } from "src/constants";

export const lookup = (
  from: string,
  localField: string,
  as: string,
  pipeline: PipelineStage[],
): PipelineStage => ({
  $lookup: {
    from,
    localField,
    foreignField: RESOURCE._ID,
    as,
    pipeline: pipeline as any[],
  },
});
