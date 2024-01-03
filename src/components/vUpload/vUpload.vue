<template>
    <div class="vUpload">
        <el-upload class="avatar-uploader" action="#" :auto-upload="false" :disabled="type=='view'" list-type='picture-card' :show-file-list="false" :on-change="handleChange">
            <div style="position: relative;height:100%" v-if="imgUrl">
                <img :src="imgUrl" class="avatar">
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-delete" @click.stop="deleteMaterial">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
    </div>
</template>

<script>
export default {
    name: 'vUpload',
    props: {
        type: {
            type: String
        },
        src: {
            type: String,

        },
        obj: {
            type: Object,
        }
    },

    computed: {
        imgUrl: {
            get() {

                return this.src
            },
            set(val) {
                this.$emit('update:src', val)
            }
        },
        fileObject: {
            get() {
                return this.obj
            },
            set(val) {

                this.$emit('update:obj', val)
            }
        }
    },
    methods: {
        deleteMaterial() {
            this.fileObject = undefined
            this.imgUrl = undefined

        },
        handleChange(uploadFile, uploadFiles) {
            if (uploadFile.raw.type != 'image/png' && uploadFile.raw.type != 'image/jpeg') {
                this.$message({
                    message: '⽂件格式仅⽀持上传 JPG/PNG!',
                    type: 'warning'
                })
                return false
            } else if (uploadFile.size / 1024 / 1024 > 10) {
                this.$message({
                    message: '上传头像图片⼤⼩不能超过 10MB!',
                    type: 'warning'
                })
                return false
            } else {
                this.fileObject = uploadFile
                this.imgUrl = URL.createObjectURL(uploadFile.raw)
            }

        },
    },
}
</script>
<style scoped lang='scss'>
    .avatar {
        width: 148px;
        height: 148px;
    }
    .el-upload-list__item-actions {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        -webkit-transition: opacity 0.3s;
        transition: opacity 0.3s;
    }

    .el-upload-list__item-actions:after {
        display: inline-block;
        content: '';
        height: 100%;
        vertical-align: middle;
    }
    .el-upload-list__item-actions:hover {
        opacity: 1;
    }
    .el-upload-list__item-delete {
        position: static;
        font-size: inherit;
        color: inherit;
        i {
            color: inherit;
        }
    }
    .el-upload-list__item-actions:hover span {
        display: inline-block;
    }
</style>
