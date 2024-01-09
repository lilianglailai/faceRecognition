<template>
    <div class="login-container pull-height">
        <div class="login-weaper">
            <div class="login-left animated fadeInLeft">
                <div style="width: 817px;height: 370px"></div>
            </div>
            <div class="login-border animated fadeInRight">
                <el-card class="login-main box-card">
                    <div class="login-title2">后台管理系统登录</div>
                    <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
                        <el-form-item prop="username">
                            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
                                <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                            </el-input>
                        </el-form-item>
                        <el-form-item v-if="captchaEnabled">
                            <div class="box">
                                <div id="_nc2">
                                </div>
                            </div>
                        </el-form-item>
                        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
                        <el-form-item style="width:100%;">
                            <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
                                <span v-if="!loading">登 录</span>
                                <span v-else>登 录 中...</span>
                            </el-button>
                            <div style="float: right;" v-if="register">
                                <router-link class="link-type" :to="'/register'">立即注册</router-link>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-card>
                <!--  底部  -->
            </div>
        </div>
    </div>
</template>

<script>

import Cookies from "js-cookie";



export default {
    name: "Login",
    data() {
        return {
            title: process.env.VUE_APP_TITLE,
            codeUrl: "",
            dataNC: {},
            loginForm: {
                username: "user1",
                password: "",
                rememberMe: false,

                uuid: "",

            },
            loginRules: {
                username: [
                    { required: true, trigger: "blur", message: "请输入您的账号" }
                ],
                password: [
                    { required: true, trigger: "blur", message: "请输入您的密码" }
                ],
                dataNC: [{ required: true, trigger: "change", message: "请滑动验证码" }]
            },
            loading: false,
            // 验证码开关
            captchaEnabled: true,
            // 注册开关
            register: false,
            redirect: undefined
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true
        },

    },
    created() {
        if (process.env.NODE_ENV == 'development') {
            this.loginForm.password = 'pass1'


        }
        this.getCookie();
    },

    methods: {
        send(dataNC) {
            this.dataNC = {
                afsSig: dataNC.sig,
                afsToken: dataNC.token,
                afsScene: dataNC.scene,
                afsSessionId: dataNC.afsSessionId
            }
        },

        loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script')
                script.type = 'text/javascript'
                script.onload = resolve
                script.onerror = reject
                script.src = url
                document.head.appendChild(script)
            })
        },
        getCookie() {
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            const rememberMe = Cookies.get('rememberMe')
            this.loginForm = {
                username: username === undefined ? this.loginForm.username : username,
                password: password === undefined ? this.loginForm.password : password,
                rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
            };
        },
        handleLogin() {

            this.$refs.loginForm.validate(valid => {
                if (valid) {

                    this.loading = true;
                    if (this.loginForm.rememberMe) {
                        Cookies.set("username", this.loginForm.username, { expires: 365 });
                        Cookies.set("password", this.loginForm.password, { expires: 365 });
                        Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 365 });
                    } else {
                        Cookies.remove("username");
                        Cookies.remove("password");
                        Cookies.remove('rememberMe');
                    }


                    this.$store.dispatch("Login", {
                        username: this.loginForm.username,
                        password: this.loginForm.password,

                    }).then(() => {

                        this.$router.push({ path: this.redirect || "/" }).catch(() => { });
                    }).catch((err) => {
                        this.loading = false;

                        if (err.message.includes('验证状态无效')) {
                            this.nc.reset()
                            this.dataNC = {}
                            this.$message({
                                message: '请重新滑动验证',
                                type: 'warning;'
                            })

                        }

                    });
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
    .account-card {
        font-size: 14px;
        margin: 5px 10px;
        width: 160px;
        background-color: #fff;
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0px 10px 20px #ddd;
    }

    .account {
        margin-top: 10px;
    }

    .is-bottom {
        font-size: 12px;
    }

    .login-container {
        width: 100%;
        margin: 0 auto;
    }

    .login-weaper {
        position: absolute;
        top: 45%;
        left: 0;
        width: 100%;
        height: 500px;
        margin-top: -200px;
    }

    .login-container:before {
        z-index: -1024;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: url('../assets/login/login.png') no-repeat;
        background-size: cover;
        /*background-size: 100% auto;*/
    }

    .login-left {
        float: left;
        width: 50%;
        position: relative;
    }
    .animated {
        -webkit-animation-duration: 1s;
        animation-duration: 1s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }
    @-webkit-keyframes fadeInRight {
        0% {
            opacity: 0;
            -webkit-transform: translate3d(100%, 0, 0);
            transform: translate3d(100%, 0, 0);
        }

        to {
            opacity: 1;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
    }

    @keyframes fadeInRight {
        0% {
            opacity: 0;
            -webkit-transform: translate3d(100%, 0, 0);
            transform: translate3d(100%, 0, 0);
        }

        to {
            opacity: 1;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
    }

    .fadeInRight {
        -webkit-animation-name: fadeInRight;
        animation-name: fadeInRight;
    }

    .login-info {
        padding-left: 140px;
    }

    .login-info-title {
        margin-top: -70px;
        line-height: 90px;
        color: rgb(64, 158, 255);
    }

    .login-info-item {
        font-size: 14px;
        line-height: 2.2;
        color: rgb(33, 37, 41);
    }

    .login-border {
        /*margin-top: 50px;*/
        width: 50%;
        float: left;
        box-sizing: border-box;
    }

    .login-main {
        margin: 0 auto;
        width: 444px;
        box-sizing: border-box;
    }

    .login-main > h3 {
        margin-bottom: 20px;
    }

    .login-main > p {
        color: #76838f;
    }

    .login-title {
        margin-bottom: 40px;
        font-weight: 500;
        font-size: 22px;
        text-align: center;
        letter-spacing: 4px;
    }

    .login-menu {
        width: 100%;
        text-align: center;

        a {
            color: rgb(153, 153, 153);
            font-size: 12px;
            margin: 0px 8px;
        }
    }
    .el-card {
        border: 0;
    }

    .login-index {
        margin-top: 40px !important;
        width: 180px;
        height: 48px;
        text-align: center;
        border-radius: 50px !important;
        background: transparent !important;
        color: #333 !important;
        font-size: 16px !important;
        border: 1px solid rgb(152, 22, 244);
    }

    .login-submit {
        display: block !important;
        margin: 40px auto 10px auto !important;
        width: 200px;
        height: 48px;
        font-size: 14px !important;
        text-align: center;
        border-radius: 50px !important;
        border: 0px;
        box-shadow: rgba(152, 22, 244, 0.19) 0px 5px 10px 2px;
    }

    .login-form {
        /*margin: 10px 0;

                                                                                                            i {
                                                                                                              color: #999;
                                                                                                            }

                                                                                                            .el-form-item__content {
                                                                                                              width: 100%;
                                                                                                            }

                                                                                                            .el-form-item {
                                                                                                              margin-bottom: 15px;
                                                                                                            }*/

        .el-input {
            input {
                /*padding-bottom: 10px;*/
                /*text-indent: 5px;*/
                /*background: transparent;*/
                /*border: none;*/
                /*border-radius: 0;*/
                /*color: #333;*/
                /*border-bottom: 1px solid rgb(235, 237, 242);*/
            }

            .el-input__prefix {
                i {
                    padding: 0 5px;
                    font-size: 16px !important;
                }
            }
        }
    }

    .login-code {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin: 0 0 0 10px;
    }

    .login-code-img {
        margin-top: 2px;
        width: 100px;
        height: 38px;
        background-color: #fdfdfd;
        border: 1px solid #f0f0f0;
        color: #333;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 5px;
        line-height: 38px;
        text-indent: 5px;
        text-align: center;
    }

    .login-select {
        input {
            color: #333;
            font-size: 18px;
            font-weight: 400;
            border: none;
            text-align: center;
        }
    }

    .login-page-footer {
        position: fixed;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 48px;
        /*color: white;*/
        font-size: 16px;
        line-height: 48px;
        text-align: center;
        letter-spacing: 5px;
        color: #0c6eb8;
    }

    .login-title2 {
        /*height: 35px;*/
        color: #3372f2;
        font-size: 38px;
        /*line-height: 35px;*/
        text-align: center;
        letter-spacing: 0;
        margin-bottom: 50px;
    }
</style>
 <style lang="scss">
    .stage {
        padding: unset !important;
        .slider {
            left: 0 !important;
            right: 0 !important;
        }
    }
</style>