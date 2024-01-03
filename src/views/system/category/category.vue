
<template  >
    <div>
        <avue-crud :data="data" v-model="form" :option="option" :page.sync="page" :table-loading="loading" :before-open="beforeOpen" @on-load="onLoad" @row-update="rowUpdate" @row-save="rowSave"
                   @row-del="rowDel" @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange">
        </avue-crud>
    </div>
</template>


<script>
export default {
    data() {
        return {
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
                viewBtn: true,
                column: [
                    {

                        label: 'id',
                        prop: 'id',

                        row: true,
                        display: false,
                    },
                    {

                        label: '排序',
                        prop: 'sequence',
                        type: 'number',
                        rules: [
                            { required: true, message: "请输入排序", trigger: "blur" }
                        ],
                        row: true,
                        value: 9999
                    },
                    {

                        label: '名称',
                        prop: 'name',
                        rules: [
                            { required: true, message: "请输入名称", trigger: "blur" }
                        ],
                        row: true,

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
                    url: '/adminApi/ProjectCategory/DeleteProjectCategory',
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
        async rowUpdate(row, index, done, loading) {



            this.apiFn({
                url: '/adminApi/ProjectCategory/UpdateProjectCategory',
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
        },
        rowSave(row, done, loading) {

            this.apiFn({
                url: '/adminApi/ProjectCategory/AddProjectCategory',
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

            if (["edit", "view"].includes(type)) {
                this.apiFn({
                    url: '/adminApi/ProjectCategory/GetProjectCategory',
                    method: 'get',
                    params: {
                        id: this.form.id
                    }
                }).then((res) => {
                    this.form = res.data;

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
                url: '/adminApi/ProjectCategory/ListProjectCategory',
                method: 'get',
                data: {
                    pageIndex: page.currentPage,
                    pageSize: page.pageSize
                }
            }).then(res => {
                const data = res.data;
                this.page.total = data.totalCount;
                this.data = data.projectCategoryList;
                this.loading = false;

            });
        },
    }
}
</script>