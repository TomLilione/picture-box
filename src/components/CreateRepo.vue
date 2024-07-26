<template>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" @click="visible=true">
        <q-btn fab icon="add" color="accent" />
    </q-page-sticky>
    <q-dialog v-model="visible">
        <q-card>
            <q-card-section class="row items-center q-pb-none text-h6">
                创建库
            </q-card-section>
            <div class="q-pa-md input">
                <q-form @submit="handleSave" @reset="handleCancel" class="q-gutter-md">
                    <q-input filled v-model="form.name" label="Repo name *" hint="存储库名称" lazy-rules :rules="[ val => {
                        return !!(/^[A-Za-z0-9]+$/.test(val))||'请输入数字或英文字母'
                    }]" />
                    <q-select :options="options" filled v-model="form.type" label="Repo type *" hint="存储库的类型" lazy-rules
                        :rules="[ val => val || '请选择存储库类型']">
                    </q-select>
                    <q-select :options="op" filled v-model="form.private" label=" Repo Private *" hint="是否私有" lazy-rules
                        :rules="[ val => val || '请选择']">
                    </q-select>
                    <q-input v-if="form.type.value=='normal'" type="textarea" filled v-model="form.description"
                        label="Repo Desc *" hint="" />
                    <div>
                        <q-btn label="Save" type="submit" color="primary" />
                        <q-btn label="Cancel" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                </q-form>
            </div>
        </q-card>
    </q-dialog>
</template>

<script setup>
    import { ref, reactive } from 'vue';
    import { useQuasar } from 'quasar'
    import { useOctokitStore } from 'stores/octokitStore.js'

    const octokitStore = useOctokitStore()

    const visible = ref(false)
    const $q = useQuasar()
    const options = ref([
        {
            label: '图床',
            value: 'pic',
        },
        {
            label: '普通库',
            value: 'normal',
        },
    ])
    const op = [
        {
            label: '是',
            value: true,
        },
        {
            label: '否',
            value: false,
        },
    ]
    const form = reactive({
        name: '',
        type: "",
        private: {
            label: '是',
            value: true,
        },
        // description: ""
    })
    const handleSave = () => {
        $q.loading.show({
            delay: 400 // ms
        })
        createRepoReq().then(res => {
            visible.value = false
            octokitStore.getStoreList()
        }).catch(err => {
            // console.log(err)
            let dialog = $q.dialog({
                message: `未知错误`,
                position: 'top'
            });
            let timer = setTimeout(() => {
                dialog.hide();
                clearTimeout(timer)
            }, 1000);
        }).finally(() => {
            $q.loading.hide()
        })
    }
    const handleCancel = () => {
        initForm()
        visible.value = false
    }
    const initForm = () => {
        form.name = '';
        form.type = '';
        form.description = ''
        form.private = {
            label: '是',
            value: true,
        }
    }
    const createRepoReq = async () => {
        let res = await octokit.request('POST /user/repos', {
            name: form.name,
            description: form.type.value == 'pic' ? JSON.stringify({ type: 'img-box', id: new Date().getTime() }) : form.description,
            homepage: 'https://github.com',
            private: form.private.value,
            is_template: true,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })

        return res
    }
</script>

<style scoped>
    .input {
        min-width: 500px;
    }

    @media screen and (max-width: 600px) {
        .input {
            min-width: 320px;

        }
    }
</style>