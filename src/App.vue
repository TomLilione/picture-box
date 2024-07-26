<template>
  <router-view />
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useOctokitStore } from 'stores/octokitStore.js'

  defineOptions({
    name: 'App'
  });

  const octokit = useOctokitStore();
  onMounted(() => {
    let key = localStorage.getItem('gitKey');
    if (key) {
      key = window.atob(key);
      octokit.setOctokit({
        key
      }).then(res => {
        if (res.login) {
          octokit.getStoreList()
        }
      })
    }
  })
</script>