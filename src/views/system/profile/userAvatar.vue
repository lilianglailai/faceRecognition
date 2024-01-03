<template>
    <div>
        <div class="user-info-head" @click="editCropper()"><img v-bind:src="options.img" title="点击上传头像" class="img-circle img-lg" /></div>
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @opened="modalOpened" @close="closeDialog">
            <el-row>
                <el-col :xs="24" :md="12" :style="{height: '350px'}">
                    <vue-cropper ref="cropper" :img="options.img" :info="true" :autoCrop="options.autoCrop" :autoCropWidth="options.autoCropWidth" :autoCropHeight="options.autoCropHeight"
                                 :fixedBox="options.fixedBox" :outputType="options.outputType" @realTime="realTime" v-if="visible" />
                </el-col>
                <el-col :xs="24" :md="12" :style="{height: '350px'}">
                    <div class="avatar-upload-preview">
                        <img :src="previews.url" :style="previews.img" />
                    </div>
                </el-col>
            </el-row>
            <br />
            <el-row>
                <el-col :lg="2" :sm="3" :xs="3">
                    <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
                        <el-button size="small">
                            选择
                            <i class="el-icon-upload el-icon--right"></i>
                        </el-button>
                    </el-upload>
                </el-col>
                <el-col :lg="{span: 1, offset: 2}" :sm="2" :xs="2">
                    <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
                </el-col>
                <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
                    <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
                </el-col>
                <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
                    <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
                </el-col>
                <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
                    <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
                </el-col>
                <el-col :lg="{span: 2, offset: 6}" :sm="2" :xs="2">
                    <el-button type="primary" size="small" @click="uploadImg()" :disabled="loading" :loading="loading">提 交</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import store from "@/store";
import { VueCropper } from "vue-cropper";
import { debounce } from '@/utils'
import COS from 'cos-js-sdk-v5'
export default {
    components: { VueCropper },
    data() {
        return {
            // 是否显示弹出层
            open: false,
            // 是否显示cropper
            visible: false,
            // 弹出层标题
            title: "修改头像",
            options: {
                img: '',

                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 200, // 默认生成截图框宽度
                autoCropHeight: 200, // 默认生成截图框高度
                fixedBox: true, // 固定截图框大小 不允许改变
                outputType: "png" // 默认生成截图为PNG格式
            },
            loading: false,
            previews: {},
            resizeHandler: null
        };
    },
    created() {
        if (store.getters.userInfo.avatar) {
            this.options.img = this.$imgUrl + store.getters.userInfo.avatar
        }

    },
    methods: {
        // 编辑头像
        editCropper() {
            this.open = true;
        },
        // 打开弹出层结束时的回调
        modalOpened() {
            this.visible = true;
            if (!this.resizeHandler) {
                this.resizeHandler = debounce(() => {
                    this.refresh()
                }, 100)
            }
            window.addEventListener("resize", this.resizeHandler)
        },
        // 刷新组件
        refresh() {
            this.$refs.cropper.refresh();
        },
        // 覆盖默认的上传行为
        requestUpload() {
        },
        // 向左旋转
        rotateLeft() {
            this.$refs.cropper.rotateLeft();
        },
        // 向右旋转
        rotateRight() {
            this.$refs.cropper.rotateRight();
        },
        // 图片缩放
        changeScale(num) {
            num = num || 1;
            this.$refs.cropper.changeScale(num);
        },
        // 上传预处理
        beforeUpload(file) {
            if (file.type.indexOf("image/") == -1) {
                this.$modal.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
            } else {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.options.img = reader.result;
                };
            }
        },
        // 上传图片
        uploadImg() {
            this.loading = true
            this.$refs.cropper.getCropBlob(data => {

                this.RequestUploadFile(data).then(res => {
                    this.apiFn({
                        url: '/adminApi/AdminUser/UpdateAdminUser',
                        method: 'post',
                        data: {
                            userId: store.getters.userInfo.userId,
                            avatarFileId: res,
                            nickName: store.getters.userInfo.nickName,
                            isSuperAdmin: store.getters.userInfo.isSuperAdmin,
                        },
                    }).then(() => {
                        this.$message({
                            type: "success",
                            message: "退出重新登录及看到效果!",
                        });
                        this.open = false;
                        this.loading = false
                    },

                    );
                })
            });
        },
        RequestUploadFile(data) {

            return new Promise((resolve, reject) => {

                this.apiFn({
                    url: '/adminApi/FileObject/RequestUploadFile',
                    method: 'post',
                    data: {
                        fileType: 1,
                        fileExtension: data.type.includes('png') ? 'png' : 'jpeg'
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
                                Body: data // 上传文件对象
                            },
                            (err, data) => {
                                if (err) {
                                    this.loading = false
                                    this.$message({
                                        message: '发送错误请进行系统反馈',
                                        type: 'error'
                                    })
                                    reject()
                                }
                                if (data) {
                                    console.log(fileObj);
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

            })


        },
        // 实时预览
        realTime(data) {
            this.previews = data;
        },
        // 关闭窗口
        closeDialog() {


            this.visible = false;
            window.removeEventListener("resize", this.resizeHandler)
        }
    }
};
</script>
<style scoped lang="scss">
    .user-info-head {
        position: relative;
        display: inline-block;
        height: 120px;
    }

    .user-info-head:hover:after {
        content: '+';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        color: #eee;
        background: rgba(0, 0, 0, 0.5);
        font-size: 24px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        cursor: pointer;
        line-height: 110px;
        border-radius: 50%;
    }
</style>
