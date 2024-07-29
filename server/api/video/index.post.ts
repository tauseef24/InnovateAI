import Replicate from "replicate";
import {
  checkApiLimit,
  incrementApiLimit,
  isUserPro,
  protectedRoute,
} from "~/server/utils";
import { User } from "~/server/types";

const config = useRuntimeConfig();

const replicate = new Replicate({
  auth: config.replicateKey,
});

const model =
  "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351";

export default defineEventHandler(async (event) => {
  await protectedRoute(event);
  const user = event.context.user as User;

  const { prompt } = await readBody(event);

  if (!replicate.auth) {
    throw createError({
      statusCode: 500,
      statusMessage: "replicate key is not configured",
    });
  }

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Propmt is required",
    });
  }
  // const prompt = "Clown fish swimming in a coral reef, beautiful, 8k, perfect, award winning, national geographic";

  const freeTrial = await checkApiLimit(user.id);
  const isPro = await isUserPro(user.id);

  if (!freeTrial && !isPro) {
    throw createError({
      statusCode: 403,
      statusMessage: "Free trial has expired. Please upgrade to pro.",
    });
  }

  const output = await replicate.run(model, {
    input: {
      prompt: prompt,
    },
  });

  await incrementApiLimit(user.id);

  return output;
});
