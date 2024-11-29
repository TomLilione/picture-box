import { defineStore } from 'pinia';
import { EncryptStorage } from 'encrypt-storage'
import { Octokit, App } from "https://esm.sh/octokit";

const formatData = (val) => {
    let res = {
        type: 'normal',
        message: val
    }
    console.log(val)
    if (val) {
        try {
            res = JSON.parse(val)
        } catch (err) {
            console.log(err)
            res = {
                type: 'normal',
                message: val
            }
        }
    }
    console.log(res)
    return res
}

export const encryptStorage = new EncryptStorage('sdfdfdsfdcxcsdfsddsfdsfdscdl12#', {
    stateManagementUse: true,
    storageType: 'sessionStorage'
})

export const useOctokitStore = defineStore('octokitStore', {
    state: () => ({
        storeList: [],
        gitUserInfo: null,
        canUpload: false
    }),
    getters: {
    },

    actions: {
        async setOctokit(payload,) {
            window.octokit = new Octokit({
                auth: payload.key
            });
            const {
                data,
            } = await window.octokit.rest.users.getAuthenticated();
            this.gitUserInfo = data;
            this.key = payload.key;
            localStorage.setItem('gitKey', window.btoa(payload.key));
            return data;
        },
        //获取store
        async getStoreList() {
            let res = await window.octokit.request(`GET /user/repos`, {
                // username: this.gitUserInfo?.name,
                type: 'all',
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            });
            if (res.status == 200) {
                this.storeList = res.data.map(ele => {
                    return {
                        ...ele,
                        percent: Number((ele.size / 1048576) * 100).toFixed(2),
                        description: formatData(ele.description)
                    }
                });
            }
        },
        //修改上传状态
        async changeUploadStatus(payload) {
            this.canUpload = (payload == 'img-box')
        }
    },
    persist: {
        enabled: true,
        key: 'sha-ockit',
        // key: 'base',//如果需要对存储的密钥key进行命名
        storage: encryptStorage,
        // storage: localStorage, //如果不使用加密处理
        paths: ['gitUserInfo', 'canUpload', 'storeList']
    }
});
