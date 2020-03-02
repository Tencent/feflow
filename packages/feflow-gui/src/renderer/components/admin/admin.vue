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
                :rules="rules"
            >
                <el-form-item label="组织名称">
                    <el-input
                        v-model="form.groupname"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="配置脚手架"
                    prop="scaffold"
                >
                    <el-input
                        v-model="form.scaffold"
                        placeholder="输入 scaffold 名称，以 ; 号分隔"
                        :disable="!isAdmin"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="配置插件"
                    prop="plugins"
                >
                    <el-input
                        v-model="form.plugins"
                        placeholder="输入 plugins 名称，以 ; 号分隔"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="onCreate('form')"
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
        const validateNPM = async (rule, value, callback) => {
            if (value) {
                let arr = value.split(';').map(item => item.trim());

                if (!arr || !arr.length) callback();

                for (let i = 0; i < arr.length; i++) {
                    let hasInNPM = await this.checkNPM(arr[i]);

                    if (!hasInNPM) {
                        callback(new Error(`${arr[i]} 不存在于 tnpm`));
                        break;
                    }
                }

                callback();
            } else {
                callback();
            }
        };
        return {
            showConfigButton: true,

            form: {
                groupname: '',
                scaffold: '',
                plugins: ''
            },

            rules: {
                scaffold: [
                    { validator: validateNPM, trigger: 'blur' }
                ],
                plugins: [
                    { validator: validateNPM, trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.showConfigButton = !this.hasConfig;
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
            'hasConfig'
        ]),

        ...mapGetters('UserInfo', [
            'groupName',
            'scaffold',
            'plugins'
        ]),

        canCreate() {
            return this.isAdmin && (this.form.scaffold || this.form.plugins);
        }
    },
    methods: {
        createConfig() {
            this.showConfigButton = false;
        },

        strToJSON(str) {
            let arr = str.split(';').map(item => item.trim());

            if (arr && arr.length) {
                return JSON.stringify(arr);
            } else {
                return '{}';
            }
        },

        async checkNPM(pkg) {
            let url = `http://r.tnpm.oa.com/${pkg}`;
            let result = await this.$http.get(url);

            if (result && result.errcode !== 404) {
                return true;
            }

            return false;
        },

        onCreate(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (!valid) {
                    return false;
                };

                let scaffold = this.strToJSON(this.form.scaffold);
                let plugins = this.strToJSON(this.form.plugins);

                let params = {
                    username: this.username,
                    groupname: this.groupName,
                    scaffold,
                    plugins
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
            });
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

