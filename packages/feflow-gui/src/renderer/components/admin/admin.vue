<template>
    <div class="admin-wrap">
        <div class="title-bar">
            <div class="title">管理中心</div>
        </div>
        <div class="admin-main">
            <el-button
                v-if="showConfigButton"
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
                    <el-input
                        v-model="form.scaffold"
                        :disable="!isAdmin"
                    ></el-input>
                </el-form-item>
                <el-form-item label="配置插件">
                    <el-input v-model="form.plugins"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="onCreate"
                        :disabled="!canCreate"
                    >提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import apiAuthorize from '@/api/authorize';

export default {
    name: 'admin-page',
    data() {
        return {
            showConfigButton: true,

            form: {
                groupname: '',
                scaffold: '',
                plugins: ''
            }
        }
    },
    created() {
        this.showConfigButton = !this.isAdmin && !this.hasConfig;
    },
    mounted() {
        if (this.groupName) {
            this.form.groupname = this.groupName;
            this.form.scaffold = this.scaffold;
            this.form.plugins = this.plugins;
        }
    },
    computed: {
        ...mapState('UserInfo', [
            'username',
            'isAdmin',
            'scaffold',
            'plugins',
            'hasConfig'
        ]),

        ...mapGetters('UserInfo', [
            'groupName'
        ]),

        canCreate() {
            return this.form.scaffold || this.form.plugins;
        }
    },
    methods: {
        createConfig() {
            this.showConfigButton = false;
        },

        async onCreate() {
            this.form.groupname = this.groupName;

            let params = {
                username: this.username,
                ...this.form
            };

            let result = await apiAuthorize.createConfig(params);

            if (result && result.errcode === 0) {
                this.$message({
                    message: '提交成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: result.errmsg,
                    type: 'error'
                });
            }
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

