<template>
    <div class="user">
        <avue-crud :data="data" v-model="form" :option="option" :table-loading="loading" :before-open="beforeOpen" @on-load="onLoad" @row-update="rowUpdate" @row-save="rowSave"
                   @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @row-del="rowDel">
            <template slot="avatar1Form">
                <v-upload :src.sync="form.imgUrl" :obj.sync="form.fileObject" :type="type"></v-upload>
            </template>
        </avue-crud>
        <userPassword ref="userPassword"></userPassword>
    </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import userPassword from "./userPassword.vue";
import VUpload from '@/components/vUpload/vUpload.vue';
import { mapGetters } from "vuex";
export default {
    name: 'AdminUser',
    components: {
        userPassword,
        VUpload
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    data() {
        return {
            form: {},
            query: {},
            loading: true,
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            type: 'view',
            data: [],
            option: {
                align: 'center',
                viewBtn: true,
                column: [
                    {

                        label: 'cardId',
                        prop: 'cardId',
                        rules: [
                            { required: true, message: "请输入cardId", trigger: "blur" }
                        ],
                        row: true,


                    },
                    {
                        label: '账号',
                        prop: 'userToken',
                        rules: [
                            { required: true, message: "请输入账号", trigger: "blur" }
                        ],
                        row: true,
                    },
                    {
                        label: '密码',
                        prop: 'appToken',
                        rules: [
                            { required: true, message: "请输入账号", trigger: "blur" }
                        ],
                        row: true,
                    },

                    {
                        label: '昵称',
                        prop: 'name',
                        rules: [
                            { required: true, message: "请输入昵称", trigger: "blur" }
                        ],
                        row: true,
                    },
                    {
                        label: "职位",
                        prop: "station",
                        row: true,
                        required: true,
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                    },
                    {
                        label: "类型",
                        prop: "type",
                        row: true,
                        required: true,
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                    },
                    {
                        label: "部门",
                        prop: "organization",
                        row: true,
                        required: true,
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                    },
                    {
                        label: "头像",
                        prop: "imgUrl",
                        type: "img",
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                        row: true,
                        required: true
                    },


                ]
            },
        }
    },

    methods: {
        handlePassword(row) {
            if (this.userInfo.isSuperAdmin) {
                this.$refs.userPassword.option.column[0].display = false
                this.$refs.userPassword.form.userId = row.userId
            }
            this.$refs.userPassword.init()
        },


        RequestUploadFile() {

            return new Promise((resolve, reject) => {

                if (this?.form?.fileObject?.raw && Object.values(this.form?.fileObject?.raw).length) {
                    this.apiFn({
                        url: '/adminApi/FileObject/RequestUploadFile',
                        method: 'post',
                        data: {
                            fileType: 1,
                            fileExtension: this.form?.fileObject?.raw?.type.includes('png') ? 'png' : 'jpeg'
                        },
                    }).then(
                        (res) => {
                            let fileObj = res.data

                            let cos = new COS({
                                SecretId: fileObj.tmpSecretId, //查看cos文档获取
                                SecretKey: fileObj.tmpSecretKey, //查看cos文档获取
                                SecurityToken: fileObj.token
                            })
                            cos.putObject(
                                {
                                    Bucket: fileObj.bucket /* 必须:存储桶 */,
                                    Region: fileObj.region /* 存储桶所在地域，必须字段 */,
                                    Key: fileObj.objectPath /* 必须 :目录/文件名 */,
                                    StorageClass: 'STANDARD', // 上传模式
                                    Body: this.form?.fileObject?.raw // 上传文件对象
                                },
                                (err, data) => {
                                    if (err) {

                                        this.$message({
                                            message: '发送错误请进行系统反馈',
                                            type: 'error'
                                        })
                                        reject()
                                    }
                                    if (data) {

                                        resolve(fileObj.fileId)
                                    }
                                }
                            )

                        },
                        err => {

                            this.$message({
                                message: '请重试',
                                type: 'warning'
                            })
                            reject()
                        }
                    )
                } else {
                    resolve()
                }
            })


        },
        rowDel(row) {
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                return this.apiFn({
                    url: '/adminApi/AdminUser/DeleteAdminUser',
                    method: 'post',
                    data: { IdList: [row.userId] },
                })
            }).then(() => {
                this.onLoad(this.page);
                this.$message({
                    type: "success",
                    message: "操作成功!"
                });
            });
        },
        async rowUpdate(row, index, done, loading) {
            this.RequestUploadFile().then(res => {
                if (res) {
                    row.avatarFileId = res
                } else if (!row.imgUrl) {
                    row.avatarFileId = ""
                }

                this.apiFn({
                    url: '/adminApi/AdminUser/UpdateAdminUser',
                    method: 'post',
                    data: {
                        ...row
                    },
                }).then(
                    () => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!",
                        });
                        done();
                    },
                    (error) => {

                        loading();
                    }
                );
            }).catch(err => {
                loading()
            })
        },
        rowSave(row, done, loading) {
            this.RequestUploadFile().then(res => {
                if (res) {
                    row.avatarFileId = res
                }

                this.apiFn({
                    url: '/video/addUser',
                    method: 'post',
                    data: {
                        ...row
                    },
                }).then(
                    () => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!",
                        });
                        done();
                    },
                    (error) => {
                        window.console.log(error);
                        loading();
                    }
                );
            }).catch(err => {
                loading()
            })
        },
        beforeOpen(done, type) {

            this.type = type

            // if (["edit", "view"].includes(type)) {
            //     this.apiFn({
            //         url: '/adminApi/AdminUser/GetAdminUser',
            //         method: 'get',
            //         params: {
            //             id: this.form.userId
            //         }
            //     }).then((res) => {
            //         this.form = res.data;
            //         if (this.form.avatar) {
            //             this.$set(this.form, 'imgUrl', this.$imgUrl + this.form.avatar)
            //         }
            //     });
            // }
            done();
        },
        currentChange(currentPage) {
            this.page.currentPage = currentPage;
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
        },
        refreshChange() {
            this.onLoad(this.page, this.query);
        },
        onLoad(page, params = {}) {
            let values = {
                ...params,

            };


            this.apiFn({
                url: '/video/getUser',
                method: 'post',

            }).then(res => {
                const data = res;

                this.data = data.users;
                this.loading = false;

            });
        },
    },
}
</script>
<style scoped lang='scss'>
</style>
 
