<template>
    <q-page class="container">
        <q-breadcrumbs separator=" / " active-color="white" gutter="none" class="breadcrumbs">
            <q-breadcrumbs-el icon="home" @click="navigateToIndex" />
            <q-breadcrumbs-el v-for="(item,index) in filePath" :label="item" :key="index"
                @click="navigateToPath(item,index)" />
        </q-breadcrumbs>
        <q-list class="flex file-box" v-if="fileList.length>0">
            <div class="item-box" v-for="item in fileList" :key="item?.name" draggable="true"
                @dragstart="handleDragStart(item,$event)" @dragend="handleDragEnd">
                <div class="item" v-if="item.type=='dir'" style="height: fit-content;" @click="handleDeep(item,index)">
                    <q-icon style="font-size: 52px;" :name="item.icons" color="primary"></q-icon>
                    <q-item-label class="label">{{item.name}}</q-item-label>
                </div>
                <div class="item" v-if="item.type=='img'" style="height: fit-content;" @click="handleCopyUrl(item)">
                    <img :draggable="false" class="img" :src="item.icons" alt="">
                    <q-item-label class="label">{{item.name}}</q-item-label>
                </div>
                <div class="item" v-if="item.type=='unknow'" style="height: fit-content;" @click="handleCopyUrl(item)">
                    <q-icon style="font-size: 52px;" :name="item.icons" color="grey" />
                    <q-item-label class="label">{{item.name}}</q-item-label>
                </div>
            </div>
        </q-list>
        <q-list v-if="errMsg" class="flex justify-center align-center ">
            <q-banner dense :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
                <template v-slot:avatar>
                    <q-icon name="signal_wifi_off" color="primary" />
                </template>
                err:{{errMsg}}
            </q-banner>
        </q-list>
        <div class="box">
            <FileUpload @onSuccess="onSuccess" :repo="$route.query.repo" />
        </div>
        <q-page-sticky position="top-right" :offset="[48, 48]" v-show="visible">
            <q-btn round color="red" icon="delete" @drop="handleDropIn" @dragenter.prevent="handleDragEnter"
                @dragover.prevent="handleDragOver" />
        </q-page-sticky>
    </q-page>
</template>
<script setup>
    import { onMounted, ref, reactive } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useQuasar } from 'quasar'
    import { useOctokitStore } from 'stores/octokitStore.js'
    import FileUpload from 'components/FileUpload/FileUpload.vue'
    import MyImg from 'components/MyImg.vue'

    const $q = useQuasar()
    const octokitStore = useOctokitStore();
    defineOptions({
        name: 'DetialPage'
    });

    const route = useRoute();
    const his = useRouter();
    const fileList = ref([])
    const filePath = ref([''])
    const errMsg = ref('')
    const visible = ref(false)
    const onSuccess = () => {
        const filePathStr = filePath.value.join('/')
        getDetail(filePathStr)
    }
    const handleDeep = (item) => {
        if (item.type != 'dir') {
            return
        }
        filePath.value = item.path.split('/')
        getDetail(item.path)
    }
    const handleDropIn = (e) => {
        e.preventDefault();
        console.log('drop', e)
        let imgItem = JSON.parse(e.dataTransfer.getData('imgItem'));
        deleteFile(imgItem.path, imgItem.sha)
    }
    const handleDragStart = (item, $event) => {
        console.log(item, $event)
        if (visible.value) {
            return
        }
        visible.value = true;
        $event.dataTransfer.setData('imgItem', JSON.stringify(item))
    }
    const handleDragEnd = () => {
        visible.value = false
    }
    const handleDragOver = (e) => {
        // console.log('over', e)
    }
    const handleDragEnter = (e) => {
        // console.log('enter', e)
    }
    const getDetail = async (filePathStr) => {
        $q.loading.show({
            delay: 400 // ms
        })
        const { id, owner, repo } = route.query
        try {
            let res = await octokit.request(`GET /repos/${owner}/${repo}/contents/${filePathStr}`, {
                owner: owner,
                repo,
                path: "",
                branch: 'master',
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            })
            if (res.status == 200) {
                fileList.value = res.data.map(ele => {
                    let obj = ele
                    if (ele.type == 'dir') {
                        obj = {
                            ...ele,
                            icons: 'folder',
                            type: 'dir'
                        }
                    } else if (ele.type == 'file') {
                        const dealfileLs = ele.name.split('.');
                        const fileTypeList = ['png', 'webp', 'svg', 'png', 'jpg', 'jpeg', 'gif'];
                        let fileType = dealfileLs?.[dealfileLs?.length - 1];
                        if (fileTypeList.indexOf(fileType) != -1) {
                            obj = {
                                ...ele,
                                icons: ele.download_url,
                                type: 'img'
                            }
                        } else {
                            obj = {
                                ...ele,
                                icons: 'help',
                                type: 'unknow'
                            }
                        }
                    } else {
                        obj = {
                            ...ele,
                            icons: 'help',
                            type: 'unknow'
                        }
                    }
                    console.log(obj)
                    return obj
                })
            }
            $q.loading.hide();
            errMsg.value = ''
        } catch (err) {
            $q.loading.hide();
            console.log(err)
            errMsg.value = err
        }
    }
    //删除文件
    const deleteFile = async (path, sha) => {
        const { id, owner, repo } = route.query;
        let res = await octokit.request(`DELETE /repos/${owner}/${repo}/contents/${path}`,
            {
                owner,
                repo,
                path,
                message: 'delete it',
                committer: {
                    name: octokitStore?.gitUserInfo?.name,
                    email: octokitStore?.gitUserInfo?.email || `${octokitStore?.gitUserInfo.id}+${octokitStore?.gitUserInfo.name}@users.noreply.github.com`
                },
                sha,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            }
        )
        if (res.status == 200) {
            dialogShow(`删除成功`)
            const filePathStr = filePath.value.join('/')
            getDetail(filePathStr)
        }
    }
    const dialogShow = (message) => {
        let dialog = $q.dialog({
            message,
            position: 'top'
        });
        let timer = setTimeout(() => {
            dialog.hide();
            clearTimeout(timer)
        }, 1000);
    }
    const navigateToIndex = () => {
        his.replace('/')
    }
    const navigateToPath = (pathname, index) => {
        // console.log(path, index)
        const pathLs = filePath.value.slice(0, index + 1);
        const path = pathLs.join('/');
        filePath.value = pathLs;
        getDetail(path)
    }
    const handleCopyUrl = (item) => {
        const url = item.download_url;
        navigator.clipboard.writeText(url);
        const dialog = $q.dialog({
            message: "文件地址已复制"
        });
    }
    onMounted(() => {
        const filePathStr = filePath.value.join('/')
        getDetail(filePathStr)
    })

</script>
<style scoped lang="scss">
    .container {
        position: relative;
        padding: 10px;
    }

    .box {
        position: absolute;
        right: 0;
        left: 0;
        margin: auto;
        top: 80vh;
        width: fit-content;
    }

    .item {
        /* background-color: $primary; */
        color: #fff;
        padding: 10px;
        width: fit-content;
        text-align: center;
        cursor: pointer;
        transition: all .5s;
        margin: 0 auto;

        &:hover {
            opacity: .5;
        }

        .label {
            font-size: 12px;
            color: #5a5a5a;
        }
    }

    .breadcrumbs {
        padding: 4px 10px;
        background-color: $primary;
        color: #fff
    }

    .file-box {
        padding: 20px 10px;
    }

    .img {
        width: 52px;
        height: 42px;
        margin: 4px auto 0;
    }

    .label {
        max-width: 60px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    @media screen and (max-width: 500px) {
        .box {
            right: 0;
            left: 0;
            margin: auto;
        }

        .item-box {
            width: 25%;
        }
    }

    @media screen and (max-width: 900px) {
        .item-box {
            width: 20%;
        }
    }
</style>