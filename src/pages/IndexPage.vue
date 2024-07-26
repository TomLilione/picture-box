<template>
  <q-page class="container">
    <div class="row">
      <q-item
        class="item"
        v-for="item in octokitStore.storeList"
        :key="item.id"
      >
        <q-card class="col-auto-sm my-card" @click="handleDetail(item)">
          <q-chip
            size="sm"
            v-show="item.visibility == 'private'"
            color="red"
            text-color="white"
            icon="event"
            class="clip"
          >
            私有
          </q-chip>
          <q-chip
            size="sm"
            v-show="item.visibility == 'public'"
            color="primary"
            text-color="white"
            icon="event"
            class="clip"
          >
            公开
          </q-chip>
          <q-img
            style="height: 180px"
            src="https://cdn.quasar.dev/img/parallax1.jpg"
          >
            <div class="absolute-bottom" style="padding: 0; background: none">
              <div style="padding: 0 10px">
                <div class="text-h6 title">{{ item.name }}</div>
                <div class="text-subtitle2 path">
                  <span v-if="item.description?.type != 'img-box'">
                    {{ item.description?.message || "-" }}
                  </span>
                  <q-chip
                    color="primary"
                    size="sm"
                    square
                    text-color="white"
                    icon="star"
                    v-else
                    >图床</q-chip
                  >
                </div>
              </div>
              <q-card-actions
                style="
                  justify-content: space-between;
                  padding: 10px;
                  background-color: #0000005e;
                "
              >
                <q-item-section style="margin-right: 10px">
                  <q-item-section class="font-size-12;"
                    >存储库大小:{{ formatSize(item.size) }}</q-item-section
                  >
                  <div class="text-red font-size-12">
                    (建议不要超过1G，可能面临封号风险)
                  </div>
                </q-item-section>
                <q-knob
                  show-value
                  font-size="12px"
                  :value="item?.percent"
                  size="50px"
                  :thickness="0.22"
                  color="teal"
                  track-color="grey-3"
                >
                  {{ item?.percent }}%
                </q-knob>
              </q-card-actions>
            </div>
          </q-img>
          <q-card-actions>
            <q-btn
              color="red"
              flat
              label="删除"
              @click="deleteRepo(item, $event)"
            ></q-btn>
            <q-btn
              color="primary"
              flat
              label="导出"
              @click="exportRepo(item, $event)"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-item>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { useOctokitStore } from "stores/octokitStore.js";
import FileUpload from "components/FileUpload/FileUpload.vue";

defineOptions({
  name: "IndexPage",
});
const $q = useQuasar();
const storeList = ref([]);
const route = useRoute();
const router = useRouter();
const octokitStore = useOctokitStore();

const formatSize = (size) => {
  if (size < 1024) {
    return size + "k";
  }
  if (size > 1024 && size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + "M";
  }
  if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(1) + "G";
  }
};
const handleDetail = (item) => {
  octokitStore.changeUploadStatus(item.description.type);
  router.push({
    path: `/detail`,
    query: {
      id: item.id,
      owner: item.owner.login,
      repo: item.name,
    },
  });
};
const deleteRepo = (item, e) => {
  e.stopPropagation();
  $q.dialog({
    dark: true,
    title: "警告",
    message: "该操作极其危险，请确认是否删除改库！！！",
  })
    .onOk(() => {
      $q.loading.show({
        delay: 400, // ms
      });
      octokit
        .request(`DELETE /repos/${item.owner.login}/${item.name}`, {
          owner: item.owner.login,
          repo: item.name,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        })
        .then((res) => {
          octokitStore
            .getStoreList()
            .then((res) => {})
            .catch((err) => {
              let dialog = $q.dialog({
                message: `未知错误`,
                position: "top",
              });
              let timer = setTimeout(() => {
                dialog.hide();
                clearTimeout(timer);
              }, 1000);
            });
        })
        .finally(() => {
          $q.loading.hide();
        })
        .catch((err) => {
          let dialog = $q.dialog({
            message: `删除失败`,
            position: "top",
          });
          let timer = setTimeout(() => {
            dialog.hide();
            clearTimeout(timer);
          }, 1000);
        });
    })
    .onCancel(() => {})
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
const exportRepo = async (item, e) => {
  e.stopPropagation();
  window.open(
    `https://api.github.com/repos/${item.owner.login}/${item.name}/zipball/main?owner=${item.owner.login}&repo=${item.name}&ref=main`
  );
};
onMounted(() => {});
</script>
<style scoped lang='scss'>
.my-card {
  width: 240px;
  position: relative;
}

.title {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: no-wrap;
}

.path {
  max-width: 200px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.font-size-12 {
  font-size: 10px;
}

.clip {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 12;
}

@media screen and (max-width: 600px) {
  .item {
    margin: 0 auto;
    width: 100%;
    .my-card {
      width: 100%;
    }
  }
}
</style>