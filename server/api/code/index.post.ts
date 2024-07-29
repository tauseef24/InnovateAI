import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkApiLimit, incrementApiLimit, isUserPro, protectedRoute } from "~/server/utils";
import { User } from "~/server/types";

const config = useRuntimeConfig();

const genAI = new GoogleGenerativeAI(config.geminiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: [
    {
      codeExecution: {},
    },
  ],
});

export default defineEventHandler(async (event) => {
  await protectedRoute(event);
  const user = event.context.user as User;

  const { prompt } = await readBody(event);

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Messages are required",
    });
  }

  // const prompt = "Implement Binary Search Trees in C++";

  const freeTrial = await checkApiLimit(user.id);
  const isPro = await isUserPro(user.id);

  if (!freeTrial && !isPro) {
    throw createError({
      statusCode: 403,
      statusMessage: "Free trial has expired. Please upgrade to pro.",
    });
  }

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  await incrementApiLimit(user.id);

  return text;
});
