<template>
    <div style="padding: 10px;" v-show="octokitStore.canUpload">
        <input style="display: none;" type="file" ref="inputRef" @change="handleChange" />
        <q-btn :loading="loading" color="primary" label="上传文件" @click="handleSelect"></q-btn>
    </div>
</template>

<script setup>
    import { onMounted, ref, reactive } from 'vue';
    import { api } from 'src/boot/axios'
    import { useQuasar } from 'quasar'
    import { getBranch, uploadFile } from 'src/api/index.js';
    import { useOctokitStore } from 'stores/octokitStore.js'

    const octokitStore = useOctokitStore()
    const $q = useQuasar()
    const props = defineProps({
        repo: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            default: 'main'
        }
    })
    const emit = defineEmits(['onSuccess'])
    let fileList = reactive([]);
    const inputRef = ref();

    const loading = ref(false)
    const dirPath = 'img'

    const handleSelect = (e) => {
        const clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': false
        });
        inputRef.value.dispatchEvent(clickEvent)
    }
    const handleChange = async (e) => {
        loading.value = true;
        const timeStamp = new Date().getTime();
        const splitArr = e.target.files?.[0]?.name.split('.')
        const fileType = splitArr?.[splitArr.length - 1];
        const fileObj = {
            name: "myImg" + timeStamp + '.' + fileType,
            file: e.target.files?.[0],
            id: timeStamp,
            status: 'loading'
        }
        fileList.push(fileObj);
        let res = await fileToBase64(fileObj.file);
        console.log(res)
        if (res.data) {
            let req = await fileUpload({
                base64File: res.data,
                fileName: fileObj.name
            });
        } else {
            fileObj.status = 'error'
        }
        e.target.value = '';
        loading.value = false
    }

    const fileUpload = async ({ base64File, fileName }) => {
        let req = await octokit.request(`PUT /repos/${octokitStore?.gitUserInfo?.name}/${props.repo}/contents/img/${fileName}`, {
            owner: octokitStore?.gitUserInfo?.name,
            repo: props.repo,
            path: `/img/${fileName}`,
            //分支
            branch: props.branch,
            message: `upload:${new Date().getTime()}`,
            committer: {
                name: octokitStore?.gitUserInfo?.name,
                email: octokitStore?.gitUserInfo?.email || `${octokitStore?.gitUserInfo.id}+${octokitStore?.gitUserInfo.name}@users.noreply.github.com`
            },
            content: base64File,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        if (req) {
            let dialog = $q.dialog({
                message: `上传成功`,
                position: 'top'
            });
            let timer = setTimeout(() => {
                dialog.hide();
                emit('onSuccess', 'ok')
                clearTimeout(timer)
            }, 1000);
        }
        loading.value = false
    }
    //file对象转base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                console.log(reader.result.split(',')[0])
                resolve({
                    data: reader.result.split(',')[1]
                })
            }
            reader.onerror = () => {
                resolve({
                    data: false
                });
            }
        })
    }
    const deleteFile = (id) => {
        const index = fileList.findIndex(ele => ele.id == id);
        fileList.splice(index, 1);
        console.log(inputRef.value.files)
    }
</script>

<style scoped lang="scss">
    .item {
        background-color: $secondary;

        &:not(:last-child) {
            border-bottom: 1px solid #e6e6e6;
        }
    }

    .label {
        width: fit-content;
        max-width: 200px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;

    }
</style>