import { RESOURCE } from "../constants/index.js";

export const lookup = (from, localField, as, nestedLookup) => ({
  $lookup: {
    from,
    localField,
    foreignField: RESOURCE.ID,
    as,
    pipeline: nestedLookup,
  },
});
