<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated v-ripple>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> </q-toolbar-title>
        <!-- <q-btn flat round dense>
          <q-icon name="more_vert" />
        </q-btn> -->
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-item header style="padding: 20px 10px">
        <q-item-section side>
          <q-avatar size="58px" rounded color="primary" text-color="white">
            <span v-if="!octokitStore?.gitUserInfo?.avatar_url"> LJ</span>
            <img v-else :src="octokitStore?.gitUserInfo?.avatar_url" />
          </q-avatar>
        </q-item-section>
        <q-item-section
          top
          style="padding: 10px 0"
          v-if="!octokitStore?.gitUserInfo"
        >
          <q-item-label @click="handleLogin" style="cursor: pointer"
            >登陆</q-item-label
          >
          <q-item-label caption v-show="octokitStore?.gitUserInfo?.id">
            id:{{ octokitStore?.gitUserInfo?.id || "-" }}
          </q-item-label>
        </q-item-section>
        <q-item-section top style="padding: 10px 0" v-else>
          <q-item-label style="cursor: pointer">{{
            octokitStore?.gitUserInfo?.name
          }}</q-item-label>
          <q-item-label caption v-show="octokitStore?.gitUserInfo?.id">
            id:{{ octokitStore?.gitUserInfo?.id || "-" }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-separator inset />
      <q-list style="margin-top: 10px">
        <div @click="handleLogin" v-if="octokitStore?.gitUserInfo">
          <EssentialLink title="切换账号" />
        </div>
        <div @click="handleSetting">
          <EssentialLink title="设置" />
        </div>
      </q-list>
      <!-- <q-icon class="setting-btn" size="24px" name="settings"></q-icon> -->
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <CreateRepo />
    <LoginDialog :visible="visible" @ok="handleOk" @close="handleCancel" />
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useOctokitStore } from "stores/octokitStore.js";
import CreateRepo from "components/CreateRepo.vue";

import EssentialLink from "components/EssentialLink.vue";
import LoginDialog from "components/LoginDialog.vue";

const router = useRouter();

defineOptions({
  name: "MainLayout",
});
const octokitStore = useOctokitStore();

const visible = ref(false);
const isLogin = ref(false);
const linksList = [
  {
    title: "Change Account",
    caption: "切换账号",
  },
  {
    title: "Setting",
    caption: "设置",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
function handleLogin() {
  visible.value = true;
}
function handleCancel() {
  visible.value = false;
}
function handleOk() {
  visible.value = false;
}
function handleSetting() {
  router.push("/setting");
}
</script>
<style scoped>
.setting-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>