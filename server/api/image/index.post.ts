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
  "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

export default defineEventHandler(async (event) => {
  await protectedRoute(event);
  const user = event.context.user as User;

  const { prompt, amount } = await readBody(event);

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Propmt is required",
    });
  }
  // const prompt = "An astronaut riding a rainbow unicorn, cinematic, dramatic";

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
      num_outputs: amount,
    },
  });

  await incrementApiLimit(user.id);

  return output;
});
