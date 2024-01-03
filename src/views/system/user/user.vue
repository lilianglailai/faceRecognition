
<template  >
    <div>
        <avue-crud :data="data" v-model="form" :option="option" :page.sync="page" :table-loading="loading" :before-open="beforeOpen" @on-load="onLoad" @row-update="rowUpdate"
                   @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange">
            <template slot="avatar" slot-scope="{row}">
                <vimg :src="row.avatar"></vimg>
            </template>
            <template slot="avatar1Form">
                <v-upload :src.sync="form.imgUrl" :obj.sync="form.fileObject" :type="type"></v-upload>
            </template>
        </avue-crud>
    </div>
</template>


<script>
import VUpload from '@/components/vUpload/vUpload.vue';
import COS from 'cos-js-sdk-v5'
export default {
    name: "user",
    components: {
        VUpload
    },
    data() {
        return {
            type: '',
            form: {},
            query: {},
            loading: true,
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            data: [],
            option: {
                align: 'center',
                addBtn: false,
                delBtn: false,
                viewBtn: true,
                column: [
                    {

                        label: 'id',
                        prop: 'id',

                        row: true,
                        display: false,
                    },
                    {

                        label: '昵称',
                        prop: 'nickName',
                        rules: [
                            { required: true, message: "请输入昵称", trigger: "blur" }
                        ],
                        row: true,

                    },
                    {

                        label: '手机号',
                        prop: 'phone',
                        rules: [
                            { required: true, message: "请输入昵称", trigger: "blur" }
                        ],
                        row: true,

                    },
                    {
                        label: "头像",
                        prop: "avatar",
                        width: 150,
                        display: false
                    },
                    {
                        label: "头像",
                        hide: true,
                        span: 24,
                        prop: "avatar1",
                        formslot: true
                    },
                ]
            }
        };
    },
    methods: {
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
        async rowUpdate(row, index, done, loading) {
            this.RequestUploadFile().then(res => {
                if (res) {
                    row.avatarFileId = res
                } else if (!row.imgUrl) {
                    row.avatarFileId = ""
                }

                row.UserId = row.id
                this.apiFn({
                    url: '/adminApi/User/UpdateUser',
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
                )
            })
        },

        beforeOpen(done, type) {
            this.type = type
            if (["edit", "view"].includes(type)) {
                this.apiFn({
                    url: '/adminApi/User/GetUser',
                    method: 'get',
                    params: {
                        id: this.form.id
                    }
                }).then((res) => {
                    this.form = res.data;
                    this.form.imgUrl = this.$imgUrl + this.form.avatar
                    // this.$set(this.form, 'imgUrl', this.$imgUrl + this.form.avatar)

                });
            }
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

            this.loading = true;
            this.apiFn({
                url: '/adminApi/User/ListUser',
                method: 'post',
                data: {
                    pageIndex: page.currentPage,
                    pageSize: page.pageSize
                }
            }).then(res => {
                const data = res.data;
                this.page.total = data.totalCount;
                this.data = data.userList;
                this.loading = false;

            });
        },
    }
}
</script>