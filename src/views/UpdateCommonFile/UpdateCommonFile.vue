<template>
    <div>
        <div class="margin-b">
            文件类型
        </div>
        <el-select v-model="value" placeholder="请选择文件类型" class="margin-b" clearable>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <div>
            <el-upload action="#" :auto-upload="false" :file-list="list" :on-change="handleChange" :disabled="!value" v-loading="loading">
                <el-button size="small" type="primary" @click="uploadBefore">点击上传</el-button>
            </el-upload>
        </div>
        <div class="fileList">
            <div v-if="getPdf(obj.contactUs)">
                <a :href="getPdf(obj.contactUs)" target="_blank">联系我们</a>
            </div>
            <div v-if="getPdf(obj.privacyPolicy)">
                <a :href="getPdf(obj.privacyPolicy)" target="_blank">隐私策略</a>
            </div>
            <div v-if="getPdf(obj.userAgreement)">
                <a :href="getPdf(obj.userAgreement)" target="_blank">用户协议</a>
            </div>
        </div>
    </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
    name: 'UpdateCommonFile',
    data() {
        return {
            value: '',
            list: [],
            loading: false,
            obj: {

            },
            options: [
                {
                    value: "contact_us",
                    label: "联系我们"
                }, {
                    value: "privacy_policy",
                    label: "隐私策略"
                }, {
                    value: "user_agreement",
                    label: "用户协议"
                }
            ]
        }
    },
    created() {
        this.getBaseInfo()
    },

    methods: {
        getPdf(value) {
            if (value) {
                return this.$imgUrl + value
            }

        },
        getBaseInfo() {
            this.apiFn({
                url: '/adminApi/Project/BaseInfo',
                method: 'post',

            }).then(res => {
                this.obj = {
                    contactUs: res.data.contactUs,
                    privacyPolicy: res.data.privacyPolicy,
                    userAgreement: res.data.userAgreement,

                }
            })

        },
        uploadBefore() {
            if (!this.value) {
                this.$message({
                    message: '请选择文件类型',
                    type: 'warning'
                })
            }
        },
        async handleChange(uploadFile) {
            let uploadType = uploadFile.raw.type
            if (this.value == 'contact_us') {
                if (uploadType != 'image/png' && uploadType != 'image/jpeg') {
                    this.$message({
                        message: '联系我们仅⽀持上传图片，png或jpeg',
                        type: 'warning'
                    })
                    this.list.splice(-1)
                    return false
                }

            } else if (uploadType != 'application/pdf') {

                this.$message({
                    message: '⽂件格式仅⽀持上传PDF文件类型',
                    type: 'warning'
                })
                this.list.splice(-1)
                return false
            }
            let id = await this.apiFn({
                url: '/adminApi/FileObject/RequestUploadFile',
                method: 'post',
                data: {
                    fileType: 2,
                    fileExtension: uploadType == 'image/png' ? 'png' : uploadType == 'image/jpeg' ? 'jpeg' : 'pdf'
                },
            }).then(
                (res) => {
                    let fileObj = res.data
                    let cos = new COS({
                        SecretId: fileObj.tmpSecretId, //查看cos文档获取
                        SecretKey: fileObj.tmpSecretKey, //查看cos文档获取
                        SecurityToken: fileObj.token
                    })
                    return new Promise((resolve, reject) => {
                        cos.putObject(
                            {
                                Bucket: fileObj.bucket /* 必须:存储桶 */,
                                Region: fileObj.region /* 存储桶所在地域，必须字段 */,
                                Key: fileObj.objectPath /* 必须 :目录/文件名 */,
                                StorageClass: 'STANDARD', // 上传模式
                                Body: uploadFile?.raw // 上传文件对象
                            },
                            (err, data) => {
                                if (err) {

                                    this.$message({
                                        message: '发送错误请进行系统反馈',
                                        type: 'error'
                                    })
                                    this.loading = false
                                    return reject()
                                }
                                if (data) {
                                    return resolve(fileObj.fileId)

                                }
                            }
                        )
                    })

                },
                err => {
                    this.loading = false

                }
            )
            console.log(id);
            if (!id) {
                return false
            }
            this.apiFn({
                url: '/adminApi/FileObject/UpdateCommonFile',
                method: 'post',
                data: {
                    fileType: this.value,
                    fileId: id
                },
            }).then(res => {
                this.$message({
                    message: '上传成功',
                    type: 'success'
                })
                this.value = ""
                this.loading = false
                this.getBaseInfo()
            },
                err => this.loading = false
            )
        }
    },
}
</script>
<style scoped lang='scss'>
    .margin-b {
        margin-bottom: 10px;
    }
    .fileList {
        > div {
            margin-top: 30px;
            a {
                color: -webkit-link;
                text-decoration: underline !important;
            }
        }
    }
</style>
