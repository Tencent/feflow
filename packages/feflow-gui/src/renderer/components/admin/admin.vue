<template>
    <div class="admin-wrap">
        <div class="title-bar">
            <div class="title">管理中心</div>
        </div>
        <div class="admin-main">
            <el-button
                v-if="!hasConfig"
                @click="createConfig"
            >创建配置</el-button>
            <el-form
                v-else
                ref="form"
                :model="form"
                label-width="100px"
            >
                <el-form-item label="组织名称">
                    <el-input
                        v-model="form.groupname"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="配置脚手架">
                    <el-input v-model="form.scaffold"></el-input>
                </el-form-item>
                <el-form-item label="配置插件">
                    <el-input v-model="form.plugins"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="onCreate"
                    >立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'admin-page',
    data() {
        return {
            isAdmin: true,
            hasConfig: false,

            form: {
                groupname: '',
                scaffold: '',
                plugins: ''
            }
        }
    },
    mounted() {
        if (this.groupName) {
            this.form.groupname = this.groupName;
        }
    },
    computed: {
        ...mapGetters('UserInfo', [
            'groupName'
        ])
    },
    methods: {
        createConfig() {
            this.hasConfig = true;
        },

        onCreate() {
            this.form.groupname = this.groupName;
        }
    }
}
</script>


<style scoped>
.admin-wrap{
  width: 100%;
  padding: 0 50px;
}
.title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 47px;
    margin-bottom: 23px;
}
.title-bar .title {
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    color: #333333;
}
</style>

