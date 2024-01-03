<template>
    <div>
        <avue-crud :data="data" v-model="form" :option="option" :page.sync="page" :table-loading="loading" :before-open="beforeOpen" @on-load="onLoad" @current-change="currentChange" @row-del="rowDel"
                   @size-change="sizeChange" @refresh-change="refreshChange">
        </avue-crud>
    </div>
</template>

<script>
export default {
    name: 'Feedback',
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
                editBtn: false,
                delBtn: true,
                viewBtn: true,
                column: [
                    {

                        label: 'id',
                        prop: 'id',

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
                        label: "邮箱",
                        prop: "email",
                        width: 150,
                        row: true,
                    },
                    {

                        label: '内容',
                        prop: 'content',
                        rules: [
                            { required: true, message: "请输入内容", trigger: "blur" }
                        ],
                        type: 'textarea'

                    },


                ]
            }
        };

    },
    methods: {
        rowDel(row) {
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                return this.apiFn({
                    url: '/adminApi/Feedback/DeleteFeedback',
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
        beforeOpen(done, type) {
            this.type = type
            // if (["edit", "view"].includes(type)) {
            //     this.apiFn({
            //         url: '/adminApi/User/GetUser',
            //         method: 'get',
            //         params: {
            //             id: this.form.id
            //         }
            //     }).then((res) => {
            //         this.form = res.data;
            //         this.form.imgUrl = this.$imgUrl + this.form.avatar
            //         // this.$set(this.form, 'imgUrl', this.$imgUrl + this.form.avatar)

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

            this.loading = true;
            this.apiFn({
                url: '/adminApi/Feedback/ListFeedback',
                method: 'post',
                data: {
                    pageIndex: page.currentPage,
                    pageSize: page.pageSize
                }
            }).then(res => {
                const data = res.data;
                this.page.total = data.totalCount;
                this.data = data.feedbackList;
                this.loading = false;

            });
        },
    },
}
</script>
<style scoped lang='scss'>
</style>
