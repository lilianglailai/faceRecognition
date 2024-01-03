<template>
    <div class="app-container">
        <el-dialog title="修改密码" :visible.sync="dialogVisible" :modal-append-to-body="false" :append-to-body="true" :close-on-click-modal="false" width="70%">
            <avue-form ref="formref" :key="formkey" :option="option" v-model="form" @submit="handleSubmit"></avue-form>
        </el-dialog>
    </div>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";
export default {
    name: "userPassword",
    data() {
        const equalToPassword = (rule, value, callback) => {
            if (this.form.newPassword !== value) {
                callback(new Error("两次输入的密码不一致"));
            } else {
                callback();
            }
        };
        return {
            order_active: "1",
            title: "",
            dialogVisible: false,
            formkey: 1,
            isSuperAdmin: false,
            btnLoading: false,
            form: {},
            option: {
                column: [
                    {
                        type: "password",
                        label: "旧密码",
                        span: 24,
                        prop: "oldPassword",

                        rules: [
                            {
                                required: true,
                                message: "请填写旧密码",
                                trigger: "blur",
                            },
                        ],
                    },
                    {
                        type: "password",
                        label: "新密码",
                        span: 24,
                        prop: "newPassword",
                        rules: [
                            {
                                required: true,
                                message: "请填写新密码",
                                trigger: "blur",
                            },
                        ],
                    },
                    {
                        type: "password",
                        label: "确认密码",
                        span: 24,
                        prop: "confirmPassword",
                        rules: [
                            { required: true, validator: equalToPassword, trigger: "blur" }
                        ]
                    },

                ],

                labelPosition: "right",
                labelSuffix: "：",
                labelWidth: 140,
                gutter: 0,

                menuPosition: "center",
            },
        };
    },
    created() { },
    methods: {
        init() {
            this.dialogVisible = true;
            this.formkey++;
            this.get_detail();
        },

        submit() {
            this.$refs.formref.submit();
            this.btnLoading = true;
        },

        get_detail() {

        },
        handleSubmit(form, done) {
            updateUserPwd(form).then(
                () => {
                    this.btnLoading = false;
                    this.$message({
                        type: "success",
                        message: "操作成功!",
                    });
                    this.dialogVisible = false;
                    done();
                },
                (error) => {

                    this.btnLoading = false;
                }
            );
        },
    },
};
</script>

<style></style>
