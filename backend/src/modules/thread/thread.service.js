import { Thread } from "./thread.model";

const getOperation = async ({ id }) => {
  const result = await Thread.find({ _id: id }, "", {
    populate: {
      path: "messages",
    },
  });

  return { result };
};

export const ThreadService = { getOperation };
