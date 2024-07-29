<template>
  <div>
    <!-- heading -->
    <Heading
      title="Video Generation"
      description="Turn your prompt into video."
      icon="lucide:video"
      iconColor="text-orange-700"
      bgColor="bg-orange-700/10"
    >
    </Heading>
    <div class="px-4 lg:px-8">
      <div>
        <form
          @submit.prevent="submitForm"
          class="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
        >
          <div class="col-span-12 lg:col-span-10 flex flex-col justify-center">
            <div class="m-0 p-0">
              <input
                type="text"
                v-model="propmt"
                placeholder="Clown fish swimming in a coral reef, beautiful, 8k, perfect, award winning, national geographic"
                class="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent w-full"
              />
            </div>
          </div>
          <Button
            class="col-span-12 lg:col-span-2"
            type="submit"
            :disabled="!propmt || isLoading"
          >
            Generate
          </Button>
        </form>
      </div>
      <div class="space-y-4 mt-4">
        <div
          v-if="isLoading"
          class="p-8 rounded-lg w-full flex items-center justify-center bg-muted"
        >
          <Loader />
        </div>
        <Empty v-if="!video && !isLoading" label="No video generated." />

        <video
          v-if="video"
          controls
          class="w-full mt-8 rounded-lg border bg-black"
        >
          <source :src="video" />
        </video>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProModal } from "~/store/useProModal";
const store = useProModal();
const propmt = ref("");
const isLoading = ref(false);
const video = ref<string>();

const submitForm = async () => {
  isLoading.value = true;

  const { data, error } = await useFetch<string>("/api/video", {
    method: "POST",
    body: {
      prompt: propmt.value,
    },
  });

  if (data.value) {
    video.value = data.value[0];
    await refreshNuxtData("userData");
  }

  if (error) {
    console.log("[Video_Error]", error.value?.statusMessage);
    if(error.value?.statusCode === 403){
      store.onOpen();
    }
  }
  isLoading.value = false;
  propmt.value = "";
};
</script>
