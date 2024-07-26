const repo = 'a-jie-drawing-bed';//用户名和仓库名
const accessToken = ''
const owner = 'liu-jie11122233'
const baseUrl = import.meta.env.VITE_UPLOAD_API;

const getBranchApi = `${baseUrl}/api/v5/repos/${owner}/${repo}/branches`

export {
    getBranchApi,
    accessToken,
    owner,
    repo,
    baseUrl
}