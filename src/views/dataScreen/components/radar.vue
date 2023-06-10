<!--
 * @Author: undercurre undercurre@163.com
 * @Date: 2023-06-10 03:03:41
 * @LastEditors: undercurre undercurre@163.com
 * @LastEditTime: 2023-06-11 02:24:53
 * @FilePath: \homfix\src\views\dataScreen\components\radar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="radar"></div>
  <div class="list_box">
    <el-radio-group v-model="curWIFI" class="list">
      <el-radio v-for="item in WIFIList" :key="item.mac" :label="item.mac" size="large">{{
        item.ssid.includes("�") ? item.bssid : item.ssid
      }}</el-radio>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { WiFiNetwork } from "node-wifi";

interface WiFiNetworkWithStatus extends WiFiNetwork {
  status: "connected" | "free";
}

// 当前单选
const curWIFI = ref("");

// Wifi列表
const WIFIList = ref<Array<WiFiNetworkWithStatus>>([]);

function getWifiList() {
  window.api.send("get-wifi-list");

  window.api.on("wifi-list", (event, response) => {
    console.log(event, response);
    if (response.success) {
      // 处理成功获取到的 WiFi 列表
      console.log(response.data);
      WIFIList.value = response.data;
      if (WIFIList.value[0].status === "connected") curWIFI.value = WIFIList.value[0].mac || "";
    } else {
      // 处理错误情况
      console.error(response.error);
    }
  });
}

onMounted(() => {
  if (typeof window.api !== "undefined") {
    getWifiList();
  } else {
    console.error("ipcRenderer is not available in this context.");
  }
});
</script>
<style lang="scss" scoped>
.radar {
  position: relative;
  width: 700px;
  max-width: 700px;
  height: 700px;
  max-height: 700px;
  overflow: hidden;
  background-image: url("@/assets/images/radar.png");
  background-size: 100% 100%;
  border-radius: 50%;
  opacity: 0.3;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    display: block;
    width: 350px;
    height: 350px;
    content: "";
    background-image: linear-gradient(to right, transparent, #9bfdfd);
    border-bottom: 3px solid transparent;
    border-image: linear-gradient(to right, transparent, #5ef2ff);
    border-image-slice: 3;
    transform-origin: 0% 100%;
    animation: rotate-animate 2s linear infinite;
  }

  @keyframes rotate-animate {
    from {
      transform: rotate(0deg) skew(-10deg);
    }
    to {
      transform: rotate(360deg) skew(-10deg);
    }
  }
}
.list_box {
  position: absolute;
  height: 500px;
  max-height: 500px;
  overflow-y: auto;
}
.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  &::v-deep .el-radio__label {
    font-size: 28px;
  }
}
</style>
