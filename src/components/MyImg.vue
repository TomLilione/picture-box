<template>
    <div>
        <img style="width: 30px;height: 30px;" :src="src" alt="">
    </div>
</template>
<script setup>
    import { ref, watch, onUpdated, toRefs } from 'vue'

    defineOptions({
        name: 'MyImg'
    });

    const props = defineProps({
        baseSrc: {
            type: String,
        }
    });
    const toRefProp = toRefs(props)
    const src = ref('');
    watch(() => toRefProp, (newVal, oldVal) => {
        if (newVal.baseSrc.value) {
            console.log(oldVal, newVal)
            fetch(newVal.baseSrc.value).then(res => {
                return res.json()
            }).then(data => {
                src.value = 'data:image/jpeg;base64,' + data.content
            })
        }
    }, {
        deep: true,
        immediate: true
    });

</script>
<style>

</style>