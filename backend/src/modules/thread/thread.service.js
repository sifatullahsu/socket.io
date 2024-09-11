import { Thread } from "./thread.model";

const getOperation = async ({ id }) => {
  const result = await Thread.find({ _id: id }, "", {
    populate: [
      {
        path: "messages",
        populate: {
          path: "sender",
          select: "_id name image",
        },
      },
    ],
  });

  return { result };
};

export const ThreadService = { getOperation };
