<template>
    <div class="user">
        <avue-crud :data="data" v-model="form" :option="option" :page.sync="page" :table-loading="loading" :before-open="beforeOpen" @search-change="searchChange" @on-load="onLoad"
                   @row-update="rowUpdate" @row-save="rowSave" @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @search-reset="searchReset" @row-del="rowDel">
        </avue-crud>
    </div>
</template>

<script>



import { getToken } from '@/utils/auth'
export default {

    name: 'AdminUser',
    data() {
        return {
            form: {},
            query: {},
            loading: true,
            page: {
                pageSize: 999,
                currentPage: 1,
                total: 0,
            },
            type: 'view',
            data: [],
            option: {
                align: 'center',
                viewBtn: true,
                delBtn: false,

                editBtn: false,
                column: [
                    {

                        label: '频道号码',
                        prop: 'channelNumber',
                        rules: [
                            { required: true, message: "请输入cardId", trigger: "blur" }
                        ],
                        row: true,
                        search: true
                    },
                    {
                        label: '账号',
                        prop: 'username',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                        row: true,
                    },
                    {
                        label: '密码',
                        prop: 'password',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                        row: true,
                    },
                    {
                        label: '地址',
                        prop: 'address',

                        row: true,
                    },
                    {
                        label: 'dataPath',
                        prop: 'dataPath',

                        row: true,
                    },
                    {
                        label: '连接方式',
                        prop: 'connectionMethod',

                        row: true,
                    },

                    {
                        label: "类型",
                        prop: "type",
                        row: true

                    },



                ]
            },
        }
    },

    methods: {
        searchReset() {
            this.query = {};
            this.onLoad(this.page);
        },

        rowDel(row) {
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                return this.apiFn({
                    url: '/video/deleteUser',
                    method: 'post',
                    data: {
                        "userToken": row.userToken,
                        "appToken": row.appToken,
                        "name": row.name,
                        "cardId": row.cardId
                    },
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
            this.apiFn({
                url: '/video/updateUser',
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

        },
        rowSave(row, done, loading) {

            this.apiFn({
                url: '/access/add',
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
        searchChange(params, done) {
            this.query = params;
            this.page.currentPage = 1;
            this.onLoad(this.page, params);
            done();
        },
        onLoad(page, params = {}) {
            this.loading = true;
            let url = '/access'
            let values = {
                page: page.currentPage,
                limit: page.pageSize
            };
            if (Object.values(params).length) {
                url = '/access/source'
                values = params
            }



            this.apiFn({
                url: url,
                method: 'post',
                data: values
            }).then(res => {
                let data = res;
                if (Object.values(params).length) {
                    this.data = [data.accessSource]
                } else {
                    this.data = data.access;

                }


                this.loading = false;

            });
        },
    },
}
</script>
<style scoped lang='scss'>
</style>
 
