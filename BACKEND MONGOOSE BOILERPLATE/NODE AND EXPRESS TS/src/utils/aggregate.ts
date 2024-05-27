import { PipelineStage } from "mongoose";
import { RESOURCE } from "../constants/index";

const lookup = (
  from: string,
  localField: string,
  as: string,
  pipeline: PipelineStage[]
): PipelineStage => ({
  $lookup: {
    from,
    localField,
    foreignField: RESOURCE.ID,
    as,
    pipeline: pipeline as any[],
  },
});

export default lookup;
