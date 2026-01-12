<script setup>
const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'accent' }
});

</script>

<template>
  <button :type="type" :class="`btn btn-${variant}`" >
    <slot />
  </button>
</template>