<template>
    <div>
        <div class="ckeditor-top" v-if="type!='view'">
            <el-button @click="inset" type="primary" plain style="margin-right:10px">插入站内⽂章</el-button>
            <div>ps:栏⽬标题使用H2标签(标题2)</div>
        </div>
        <ckeditor ref="editor" :config="editorConfig" v-model="editorData">
        </ckeditor>
        <el-dialog title="插入站内⽂章" type="text" :visible.sync="dialogVisible" :modal="false" class="ckeditor-dialog">
            <el-form :model="formState" label-width="150" ref="ValidateForm">
                <el-form-item label="图片链接" prop="imgurl" :rules=" [{ required: true, message: '请输入图片链接', trigger: ['blur','change'] }]">
                    <el-input v-model="formState.imgurl" placeholder="请输入图片链接"></el-input>
                    <el-upload action="#" :auto-upload="false" :on-change="handleChange" style="margin-top: 10px;">
                        <el-button type="">上传图片</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="标题" prop="title" :rules=" [{ required: true, message: '请输入图片链接', trigger: ['blur','change'] }]">
                    <el-input v-model="formState.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="title" :rules=" [{ required: true, message: '请输入图片链接', trigger: ['blur','change'] }]">
                    <el-input v-model="formState.describe" placeholder="请输入描述"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" prop="href" :rules=" [{ required: true, message: '请输入图片链接', trigger: ['blur','change'] }]">
                    <el-input v-model="formState.href" placeholder="请输入跳转链接"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="" @click="sumbit('ValidateForm')" style="margin-top:20px">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <br />
    </div>
</template>
 
<script>

import CKEditor from "ckeditor4-vue";
import { getToken } from '@/utils/auth'

export default {
    name: "Editor",
    components: {

        // Use the <ckeditor> component in this view.
        ckeditor: CKEditor.component
    },
    props: {
        data: {
            type: String
        },
        type: {
            type: String
        }
    },

    computed: {
        editorData: {
            get() {
                return this.data
            },
            set(val) {
                this.$emit('update:data', val)
            }
        },


    },


    data() {
        return {
            dialogVisible: false,
            formState: {

            },

            editorConfig: {
                // baseHref: process.env.VUE_APP_BASE_API,
                fileTools_requestHeaders: {
                    Authorization: 'Bearer ' + getToken()
                },
                height: '500px',
                language: 'zh-cn',
                filebrowserImageUploadUrl: process.env.VUE_APP_BASE_API + '/adminApi/FileObject/UploadFile?a=1',
                font_names: '黑体/黑体;宋体/宋体;楷体/楷体;幼圆/幼圆;微软雅黑/微软雅黑;',
                font_defaultLabel: '微软雅黑',
                cfontSize_defaultLabel: '18px',
                line_height: "0;1em;1.1em;1.2em;1.3em;1.4em;1.5em;1.6em;1.7em;1.8em;1.9em;2em;3em;",

                toolbarGroups: [
                    { name: "document", groups: ["mode", "document", "doctools"] },
                    { name: "clipboard", groups: ["clipboard", "undo"] },
                    {
                        name: "editing",
                        groups: ["find", "selection", "spellchecker", "editing"]
                    },
                    { name: "forms", groups: ["forms"] },
                    { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
                    {
                        name: "paragraph",
                        groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"]
                    },
                    { name: "links", groups: ["links"] },
                    { name: "insert", groups: ["insert"] },
                    { name: "styles", groups: ["styles"] },
                    { name: "colors", groups: ["colors"] },
                    { name: "tools", groups: ["tools"] },
                    { name: "others", groups: ["others"] },
                    { name: "about", groups: ["about"] }
                ],
            },
        };
    },


    methods: {
        handleChange(uploadFile) {
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
                const formData = new FormData();
                formData.append("file", uploadFile.raw);
                this.apiFn({
                    url: '/adminApi/FileObject/UploadFile',
                    method: 'post',
                    data: formData
                }).then(res => {
                    this.$set(this.formState, 'imgurl', res.url)
                    // this.formState.imgurl = 
                })
            }
        },
        sumbit(formName) {
            let a
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    a = true
                }
            });
            if (!a) {
                return false
            }
            CKEDITOR.instances.editor1.insertHtml(`
           
               <div class='article' style="padding: 20px;display: flex;align-items: center;width: 800px;height: 124px;background: #FBFBFB;border-radius: 4px;margin:30px 0">
               <div class='article-top' style="display:flex;width:100%">
                 <img src="${this.formState.imgurl}" alt="" style="width:131px;max-height:84px;margin-right:16px;">
                <div style="flex:1;">
                    <div style="font-size: 16px;font-weight: 400;color: #0C0B22;margin-bottom:10px;   overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            word-wrap: break-word;
            -webkit-box-orient: vertical;
                word-break: break-all;">${this.formState.title}</div>
                    <div style="font-size: 14px;font-weight: 400;color: #9E9EA7;    
                    overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            word-wrap: break-word;
            -webkit-box-orient: vertical;
                word-break: break-all;">${this.formState.describe}</div>
                </div>
               </div>
              
                <a href="${this.formState.href}" target="_blank" style="width: 80px; 
                   text-align: center;
                    margin-left: 30px;
    line-height: 36px;
height: 36px;
border-radius: 4px;
border: 1px solid #0C0B22;font-size: 14px;
font-weight: 400;
color: #0C0B22;">
                    查看
                </a>
            </div>
             
             `);
            this.dialogVisible = false
        },
        inset() {
            this.dialogVisible = true

        },

    },

};
</script>
<style lang="scss" scoped>
    .ckeditor-top {
        margin-bottom: 10px;
        font-size: 12px;
        color: #1890ff;
        display: flex;
        align-items: flex-end;
    }
</style>
<style lang="scss" >
    .ckeditor-dialog {
        .el-form-item--medium {
            padding-bottom: 10px;
        }
        .el-dialog__body {
            margin-bottom: unset !important;
        }
    }
</style>