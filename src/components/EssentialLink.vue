<template>
  <q-item style="cursor: pointer;" v-ripple>
    <q-item-section style="flex: .9;">
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
    <q-item-section style="flex: .1;">
      <q-icon name="arrow_forward_ios"></q-icon>
    </q-item-section>
  </q-item>
</template>

<script setup>
  defineOptions({
    name: 'EssentialLink'
  })

  const props = defineProps({
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  })
</script>