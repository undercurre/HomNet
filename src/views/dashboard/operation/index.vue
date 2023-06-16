<template>
  <div class="dataVisualize-box">
    <div class="card top-box">
      <div class="top-title">虚拟设备</div>
      <div class="top-content">
        <el-row :gutter="40">
          <el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
            <div class="item-center">
              <div class="device_box">
                <div class="traffic-img">
                  <img class="device_icon" src="@/assets/images/deviceIcon/light.png" alt="" />
                  <img class="power_icon" src="./images/power_on.png" alt="" />
                </div>
                <span class="item-value">灯光</span>
                <span class="traffic-name sle">客厅 | 60%</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="add_device">
      <el-button type="primary" :icon="CirclePlus" round>添加设备</el-button>
      <el-button type="primary" :icon="Remove" round>删除所有</el-button>
      <el-button type="primary" :icon="Remove" round>批量删除</el-button>
    </div>
    <el-dialog title="提示" v-model:visible="addDialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <!-- <span #footer class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="dataVisualize">
import { onMounted, ref } from "vue";
import { CirclePlus, Remove } from "@element-plus/icons-vue";

// const instance = getCurrentInstance();

const addDialogVisible = ref(false);

function handleClose() {
  // instance?.proxy
  //   ?.$confirm("确认关闭？")
  //   .then(_ => {
  //     done();
  //   })
  //   .catch(_ => {});
}

onMounted(() => {});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
