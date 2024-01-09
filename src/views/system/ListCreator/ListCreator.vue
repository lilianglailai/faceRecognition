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
    name: 'ListCreator',
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
                labelWidth: 140,
                editBtn: false,
                column: [
                    {

                        label: 'idCode',
                        prop: 'idCode',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],


                    },
                    {
                        type: 'datetime',
                        label: '报警时间',
                        prop: 'alarmTime',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],
                        format: 'yyyy-MM-dd HH:mm:ss',
                        valueFormat: 'yyyy-MM-dd HH:mm:ss',


                    },
                    {

                        label: '报警类型',
                        prop: 'alarmType',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],


                    },
                    {

                        label: '设备名称',
                        prop: 'deviceName',
                        rules: [
                            { required: true, trigger: "blur" }
                        ],


                    },
                    {
                        label: 'appToken',
                        prop: 'appToken',

                        hide: true,
                    },
                    {
                        label: 'userToken',
                        prop: 'userToken',
                        display: false,
                        hide: true,
                        valule: getToken()
                    }
                    ,
                    {
                        label: 'deviceId',
                        prop: 'deviceId',

                        hide: true,
                    },
                    {

                        label: 'deviceId',
                        prop: 'deviceId',

                        hide: true,
                    },
                    {

                        label: 'videoUrl',
                        prop: 'videoUrl',

                        hide: true,
                    },
                    {

                        label: 'alarmId',
                        prop: 'alarmId',

                        hide: true,
                    },
                    {

                        label: 'name',
                        prop: 'name',

                        hide: true,
                    },
                    {

                        label: '数量',
                        prop: 'level',

                        hide: true,
                    },
                    {

                        label: '图片',
                        prop: 'image',
                        type: "img",
                        alone: true,
                        hide: true,
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

            if (["edit", "view"].includes(type)) {
                this.apiFn({
                    url: '/alarm/detail',
                    method: 'post',
                    data: {
                        idCode: this.form.idCode
                    }
                }).then((res) => {
                    this.form = res.alarm;
                    done();
                });
            }

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
            let url = '/alarm/live'
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
                    this.data = data.alarms;

                }


                this.loading = false;

            });
        },
    },
}
</script>
<style scoped lang='scss'>
</style>
 
