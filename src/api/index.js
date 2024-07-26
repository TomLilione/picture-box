import { api } from 'src/boot/axios'

import { getBranchApi, accessToken, owner, repo } from '/src/components/FileUpload/config'

//获取分支
export function getBranch() {
    // return api({
    //     method: 'GET',
    //     url: getBranchApi,
    //     params: {
    //         access_token: accessToken,
    //         owner,
    //         repo
    //     }
    // });
}
//新建文件
export function uploadFile(data) {
    // console.log(data)
    // let forms = new FormData();
    // forms.append('access_token', accessToken);
    // forms.append('content', data.file)
    // forms.append('message', 'feat:add')
    // forms.append('branch', 'master')
    // return api({
    //     method: 'POST',
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     },
    //     url: `/uploadApi/api/v5/repos/${owner}/${repo}/contents/img/${data.fileName}`,
    //     data: forms
    // });
}
