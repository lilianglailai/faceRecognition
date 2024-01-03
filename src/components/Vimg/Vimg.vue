<template>
    <div>
        <el-image style="width: 100px; height: 100px" :src="getImg" :preview-src-list="srcList" v-if="this.src">
        </el-image>
    </div>
</template>

<script>
export default {
    name: 'Vimg',
    props: {
        src: {
            type: String,

        }
    },
    computed: {
        getImg() {
            return this.src
        },
        srcList() {
            return [this.getImg]
        }
    },
    data() {
        return {

        }
    },
    methods: {},
}
</script>
<style scoped lang='scss'>
</style>
