<template>
  <div class="q-pa-sm">
    <div class="bg-primary text-white">
      <q-breadcrumbs gutter="none" active-color="white" style="font-size: 16px">
        <q-breadcrumbs-el
          @click="navigateToHome"
          style="cursor: pointer"
          label="/"
          icon="home"
        />
      </q-breadcrumbs>
    </div>
    <q-devider />
    <div class="box">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-toggle
          v-model="form.isSaveTokenToLocal"
          label="是否保存token到本地"
        />
        <div>
          <q-btn label="确认" type="submit" color="primary" />
          <q-btn
            label="取消"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  isSaveTokenToLocal: false,
});
const navigateToHome = () => {
  router.push("/");
};
</script>

<style scoped lang='scss'>
.box {
  padding: 20px 0;
  text-align: center;
  min-height: 60vh;
}
</style>