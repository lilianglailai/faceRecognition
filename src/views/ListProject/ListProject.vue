<template>
    <div class="ListProject">
        <avue-crud :data="data" v-model="form" :option="option" :page.sync="page" :table-loading="loading" :before-open="beforeOpen" @on-load="onLoad" @row-update="rowUpdate" @row-save="rowSave"
                   @row-del="rowDel" @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange">
            <template slot="coverImage" slot-scope="{row}">
                <vimg :src="row.coverImage"></vimg>
            </template>
            <template slot="rating" slot-scope="{row}">
                <div>
                    <img src="@/assets/ListProject/Starrating.png" alt="" srcset="" v-for="(item, index) in row.rating" :key="index">
                </div>
            </template>
            <template slot="tagList" slot-scope="{row}">
                <div class="tagList">
                    <el-tag v-for="(item, index) in row.tagList" :key="index">{{item}}</el-tag>
                </div>
            </template>
            <template slot="tagListForm">
                <div class="tagListForm">
                    <el-input placeholder="回车后添加标签" v-if="type!='view'" v-model="tagValue" @keyup.enter.native="handleLogin"></el-input>
                    <el-tag v-for="(item, index) in form.tagList" closable :key="index" @close="handleClose(index)">{{item}}</el-tag>
                </div>
            </template>
            <template slot="avatar1Form">
                <v-upload :src.sync="form.imgUrl" :obj.sync="form.fileObject" :type="type"></v-upload>
            </template>
            <template slot="ratingForm">
                <el-radio-group v-model="form.rating" class="FormStarrating">
                    <el-radio :label="item" v-for="(item, index) in 5" :key="index">
                        <img src="@/assets/ListProject/Starrating.png" alt="" srcset="" v-for="(item, i) in item" :key="i"></el-radio>
                </el-radio-group>
            </template>
            <template slot="contentForm">
                <ckeditor :data.sync="form.content" :type="type"></ckeditor>
            </template>
        </avue-crud>
    </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import Ckeditor from '@/components/ckeditor/ckeditor.vue'
import { systemObj } from "@/utils/prototype.js";
import VUpload from '@/components/vUpload/vUpload.vue';
export default {
    name: 'ListProject',
    components: { Ckeditor, VUpload },
    data() {
        return {
            imageUrl: "",

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
            tagValue: "",

            option: {
                labelWidth: 120,
                align: 'center',
                viewBtn: true,
                dialogWidth: "80%",
                column: [
                    {
                        label: 'ID',
                        prop: 'id',
                        display: false,
                    },
                    {
                        label: '标题',
                        prop: 'title',
                        rules: [
                            { required: true, message: "请输入标题", trigger: "blur" }
                        ]
                    },

                    {
                        label: '描述',
                        span: 24,
                        prop: 'description',
                        type: "textarea"
                    },
                    {
                        label: "封面图",
                        prop: "coverImage",
                        display: false,
                        width: 150,
                    },
                    {
                        label: "封面图",
                        hide: true,
                        span: 24,
                        prop: "avatar1",
                        formslot: true
                    },
                    {
                        prop: "estimatedHourlySalary",
                        label: "预估时薪",
                        min: 1,
                        type: 'number',
                        html: true,
                        formatter: (val) => {
                            return '<span style="font-size: 14px;font-weight: 600;color: #E6B141;">￥' + val.estimatedHourlySalary + '</span>'
                        },
                        span: 12,
                        placeholder: '- -'
                    },
                    {
                        label: '工作时间',
                        prop: 'workTimeCategory',
                        type: 'radio',
                        props: {
                            label: 'name',
                            value: 'id'
                        },
                        hide: true,
                        dicData: systemObj.workTimeCategory,
                        span: 12,
                        value: -1
                    },
                    {
                        prop: "rating",
                        label: "项目前景",
                        type: 'number',
                        min: 1,
                        max: 5,

                        formslot: true,
                        span: 24
                    },
                    {
                        label: '投资金额',
                        prop: 'investmentAmountLevel',
                        type: 'radio',
                        props: {
                            label: 'name',
                            value: 'id'
                        },
                        dicData: systemObj.investmentAmountLevelList,
                        span: 24,
                        hide: true,
                        value: -1
                    },
                    {
                        label: '场景分类',
                        prop: 'sceneCategory',
                        type: 'radio',
                        props: {
                            label: 'name',
                            value: 'id'
                        },
                        hide: true,
                        dicData: systemObj.sceneCategory,
                        span: 12,
                        value: -1
                    },
                    {
                        type: 'select',
                        label: '分类',
                        span: 12,
                        hide: true,
                        props: {
                            label: 'name',
                            value: 'id',

                        },
                        prop: 'categoryId',
                        cascader: [],
                        dicUrl: '/adminApi/ProjectCategory/ListProjectCategory',
                        dicMethod: 'get',
                        dicFormatter: (res) => {
                            return systemObj.categoryId.concat(res.data.projectCategoryList)
                        },
                        value: "-1"
                    },


                    {
                        prop: "tagList",
                        label: "标签",
                        formslot: true,
                        span: 24,
                        width: 160,

                    },
                    {
                        type: 'select',
                        label: '创作者',
                        span: 12,
                        hide: true,
                        props: {
                            label: 'nickName',
                            value: 'id',

                        },
                        prop: 'creatorId',
                        cascader: [],
                        dicUrl: '/adminApi/Creator/ListCreator',
                        dicMethod: 'post',
                        dicFormatter: (res) => {
                            return res.data.userList
                        },

                    },
                    {
                        prop: "views",
                        label: "阅读量",
                        display: false
                    },
                    {
                        title: '分割线',
                        component: 'el-divider',
                        span: 24,
                        hide: true,
                        labelWidth: '0px',
                        params: {
                            html: '<h3">内容正文</h3>',
                            contentPosition: 'left'
                        },

                    },
                    {
                        prop: "content",

                        hide: true,
                        labelWidth: 0,
                        span: 24,
                        rules: [
                            { required: true, message: "请输入内容正文", trigger: "blur" }
                        ]
                    }
                ]
            },
        }
    },
    methods: {
        rowDel(row) {
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                return this.apiFn({
                    url: '/adminApi/Project/DeleteProject',
                    method: 'post',
                    data: { IdList: [row.id] },
                })
            }).then(() => {
                this.onLoad(this.page);
                this.$message({
                    type: "success",
                    message: "操作成功!"
                });
            });
        },


        handleClose(index) {

            this.form.tagList.splice(index, 1)
            console.log(this.form.tagList);
        },
        handleLogin(e) {
            if (!this.form.tagList) {
                this.form.tagList = []
            }
            this.form.tagList.push(this.tagValue)
        },

        RequestUploadFile() {

            return new Promise((resolve, reject) => {
                if (this?.form?.fileObject?.raw && Object.values(this.form?.fileObject?.raw).length) {
                    this.apiFn({
                        url: '/adminApi/FileObject/RequestUploadFile',
                        method: 'post',
                        data: {
                            fileType: 1,
                            fileExtension: this.form?.fileObject?.raw.type.includes('png') ? 'png' : 'jpeg'
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
                    row.coverImageFileId = res
                } else if (!row.imgUrl) {
                    row.coverImageFileId = ""
                }

                this.apiFn({
                    url: '/adminApi/Project/UpdateProject',
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
                    row.coverImageFileId = res
                }

                this.apiFn({
                    url: '/adminApi/Project/AddProject',
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
            if (["edit", "view"].includes(type)) {
                this.apiFn({
                    url: '/adminApi/Project/GetProject',
                    method: 'get',
                    params: {
                        id: this.form.id
                    }
                }).then((res) => {
                    this.form = res.data;
                    if (this.form.coverImage) {
                        this.form.imgUrl = this.$imgUrl + this.form.coverImage

                    }
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
                url: '/adminApi/Project/ListProject',
                method: 'post',
                data: {
                    pageIndex: page.currentPage,
                    pageSize: page.pageSize
                }
            }).then(res => {
                const data = res.data;
                this.page.total = data.totalCount;
                this.data = data.projectList;
                this.loading = false;

            });
        },
    },

}
</script>
<style  scoped lang='scss'>
    .tagList {
        overflow-x: auto;
        display: flex;
        padding-bottom: 3px;
        .el-tag:not(:last-child) {
            margin-right: 10px;
        }
    }
</style>
<style lang='scss'>
    .tagListForm {
        display: flex;
        flex-wrap: wrap;
        .el-tag:not(:last-child) {
            margin-right: 10px;
        }
        .el-tag {
            margin-bottom: 5px;
        }
        .el-input {
            width: 160px;
            height: 28px;
            margin-right: 10px;
        }
        .el-input__inner {
            display: block;
            height: 28px !important;
        }
    }
    .FormStarrating {
        img {
            margin-bottom: -3px;
        }
    }
</style>
