<template>
  <div>
    <Heading
      title="Settings"
      description="Manage Account Settings."
      icon="lucide:settings"
      iconColor="text-gray-700"
      bgColor="bg-gray-700/10"
    >
    </Heading>
    <!-- SubscriptionButton -->
     <SubscriptionButton />
  </div>
</template>

<script setup lang="ts">
import SubscriptionButton from '~/components/SubscriptionButton.vue';
</script>
