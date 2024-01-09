<template>
    <div class="user">
        <div style="margin-bottom: 10px;">
            人员底库总量： <span></span> {{ Sum }}
        </div>
        <avue-crud :data="data" v-model="form" :option="option" :page.sync="page" :table-loading="loading" :before-open="beforeOpen" @search-change="searchChange" @row-update="rowUpdate"
                   @row-save="rowSave" @size-change="sizeChange" @search-reset="searchReset" @row-del="rowDel">
        </avue-crud>
    </div>
</template>

<script> 
import { getToken } from '@/utils/auth'
export default {
    name: 'ListCreator',
    data() {
        return {
            Sum: undefined,
            form: {},
            query: {},
            loading: false,
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
                labelWidth: 140,
                addBtn: false,
                editBtn: false,
                column: [

                    {

                        label: 'idNumber',
                        prop: 'idNumber',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                        hide: true,
                        display: false,
                        search: true


                    },
                    {

                        label: 'cardid',
                        prop: 'cardid',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],


                    },
                    {

                        label: '性别',
                        prop: 'gender',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],


                    },
                    {

                        label: '姓名',
                        prop: 'name',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],


                    },
                    {

                        label: 'position',
                        prop: 'position',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],


                    },

                    {

                        label: '会员身份',
                        prop: 'membership',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],


                    },
                    {

                        label: '类型',
                        prop: 'type',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],


                    },




                    {

                        label: '图片',
                        prop: 'image',
                        type: "img",
                        alone: true,

                    },
                ]
            },
        }
    },
    created() {
        this.faceSum()
    },
    methods: {
        searchReset() {
            this.query = {};
            // this.onLoad(this.page);
        },
        faceSum() {
            this.apiFn({
                url: '/face/faceSum',
                method: 'post',

            }).then(
                (res) => {
                    this.Sum = res.faceSum

                },

            );
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
                url: '/video/add',
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
            //         url: '/alarm/detail',
            //         method: 'post',
            //         data: {
            //             idCode: this.form.idCode
            //         }
            //     }).then((res) => {
            //         this.form = res.alarm;
            //         done();
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
            let url = '/face'
            let values = {
                ...this.query
            };
            if (Object.values(params).length) {

                values = params
            }



            this.apiFn({
                url: url,
                method: 'post',
                data: values
            }).then(res => {
                let data = res;
                this.data = [data.faceInfo]

                this.loading = false;

            });
        },
    },
}
</script>
<style scoped lang='scss'>
</style>
 
