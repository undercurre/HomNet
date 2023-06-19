<template>
  <div class="container">
    <radar ref="radarRef"></radar>
  </div>
</template>

<script setup lang="ts" name="transmitter">
import { ref, onMounted } from "vue";
import radar from "./components/radar.vue";

const radarRef = ref<InstanceType<typeof radar> | null>(null);

function refreshMethod() {
  console.log("刷新");
  if (radarRef.value) {
    radarRef.value.getWifiList();
  }
}

onMounted(() => {
  refreshMethod();
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-image: linear-gradient(213deg, #616a76 6%, #434852 100%);
}
</style>
