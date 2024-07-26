<template>
    <div>
        <q-dialog v-model="rProps.visible">
            <q-card>
                <q-card-section class="row items-center q-pb-none text-h6">
                    github
                </q-card-section>

                <q-card-section>
                    <q-input label="请输入github令牌" style="width: 300px;" v-model="auth"></q-input>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn @click="onok" flat label="登陆" color="primary" />
                    <q-btn @click="onclose" flat label="取消" color="primary" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue';
    import { useRouter } from 'vue-router';
    import { useOctokitStore } from 'stores/octokitStore.js'

    const emit = defineEmits(['close', 'ok'])
    const router = useRouter()
    const octokit = useOctokitStore();

    defineOptions({
        name: 'LoginDialog'
    });

    const props = defineProps({
        visible: {
            type: Boolean,
            default: false
        },

    });
    const rProps = reactive(props);
    const auth = ref(' ')
    const onok = () => {

        octokit.setOctokit({
            key: auth.value
        }).then(res => {
            console.log(res)
            if (res.login) {
                octokit.getStoreList()
                router.replace('/');
                emit('ok', 'ok')
            }
        })
    }
    const onclose = () => {
        emit('close', 'close')
    }
    const initGit = () => {

    }
</script>

<style scoped></style>