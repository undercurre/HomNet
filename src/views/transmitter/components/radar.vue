<!--
 * @Author: undercurre undercurre@163.com
 * @Date: 2023-06-10 03:03:41
 * @LastEditors: undercurre undercurre@163.com
 * @LastEditTime: 2023-06-11 22:57:14
 * @FilePath: \homfix\src\views\dataScreen\components\radar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="radar"></div>
  <div class="list_box">
    <el-radio-group v-model="curWIFI" class="list" @change="wifiChange">
      <el-radio v-for="item in WIFIList" :key="item.mac" :label="item.mac" size="large">{{
        item.ssid.includes("�") ? item.bssid : item.ssid
      }}</el-radio>
    </el-radio-group>
  </div>
  <el-dialog v-model="dialogVisible" title="wifi密码" width="30%" :before-close="handleClose">
    <el-input v-model="password" placeholder="Please input" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="tap2Cancel">Cancel</el-button>
        <el-button type="primary" @click="tap2Confirm"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { WiFiNetwork } from "node-wifi";
import { ElMessageBox } from "element-plus";

interface WiFiNetworkWithStatus extends WiFiNetwork {
  status: "connected" | "free";
}

// 当前单选
const curWIFI = ref("");

// wifi密码
const preWIFI = ref("");
const password = ref("");

function tap2Cancel() {
  curWIFI.value = preWIFI.value;
  password.value = "";
  dialogVisible.value = false;
}

function tap2Confirm() {
  const curSelect = WIFIList.value.find(item => item.mac === curWIFI.value);
  if (curSelect) {
    connectNewWifi(curSelect.ssid, password.value);
    password.value = "";
    dialogVisible.value = false;
  }
}

// Wifi列表
const WIFIList = ref<Array<WiFiNetworkWithStatus>>([]);

function getWifiList() {
  if (typeof window.api !== "undefined") {
    window.api.send("get-wifi-list");

    window.api.on("wifi-list", (event, response) => {
      console.log(event, response);
      if (response.success) {
        // 处理成功获取到的 WiFi 列表
        console.log(response.data);
        WIFIList.value = response.data;
        if (WIFIList.value[0].status === "connected") {
          curWIFI.value = WIFIList.value[0].mac || "";
          preWIFI.value = WIFIList.value[0].mac || "";
        }
      } else {
        // 处理错误情况
        console.error(response.error);
      }
    });
  } else {
    console.error("ipcRenderer is not available in this context.");
  }
}

function connectNewWifi(ssid: string, password: string) {
  window.api.send("connect-wifi", { ssid, password });
  window.api.on("connect-result", (event, response) => {
    console.log(event, response);
    if (response.success) {
      // 处理成功
      getWifiList();
      console.log(response.data);
    } else {
      // 处理错误情况
      curWIFI.value = preWIFI.value;
      console.error(response.error);
    }
  });
}

function wifiChange() {
  dialogVisible.value = true;
}

const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      tap2Cancel();
      done();
    })
    .catch(() => {
      // catch error
    });
};

defineExpose({
  getWifiList
});
</script>
<style lang="scss" scoped>
.radar {
  position: relative;
  width: 1000px;
  height: 1000px;
  overflow: hidden;
  background-image: url("@/assets/images/radar.png");
  background-size: 100% 100%;
  border-radius: 50%;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    display: block;
    width: 500px;
    height: 500px;
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
  height: 500px;
  max-height: 500px;
  margin-left: 60px;
  overflow-y: auto;
}
.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  &::v-deep .el-radio__label {
    font-size: 28px;
    color: #ffffff;
  }
}
</style>
