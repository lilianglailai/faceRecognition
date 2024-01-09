<template>
    <div class="user">
        <avue-crud :data="data" v-model="form" :option="option" :table-loading="loading" :before-open="beforeOpen" @search-change="searchChange" @on-load="onLoad" @row-update="rowUpdate"
                   @row-save="rowSave" @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @search-reset="searchReset" @row-del="rowDel">
        </avue-crud>
    </div>
</template>

<script>




export default {
    name: 'user',
    data() {
        return {
            form: {},
            query: {},
            loading: true,
            labelWidth: 140,
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
                        label: 'userToken',
                        prop: 'userToken',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                        row: true,
                    },
                    {
                        label: 'appToken',
                        prop: 'appToken',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                        row: true,
                    },

                    {
                        label: '昵称',
                        prop: 'name',
                        rules: [
                            { required: true, message: "请输入昵称", trigger: "blur" }
                        ],
                        search: true,
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
                        alone: true,
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                        row: true,
                        required: true,

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
            let values = {
                ...params,

            };


            this.apiFn({
                url: '/video/getUser',
                method: 'post',
                data: values
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
 
