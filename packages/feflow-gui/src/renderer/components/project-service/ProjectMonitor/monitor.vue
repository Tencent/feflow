  <template> 
   <div class="project-monitor"> 
    <div class="no-project" v-if="!hasAegisProject">
        <div class="content">
            <div class="no-project-logo"></div>
            <div class="desc">该项目未接入aegis（点击<a href="javascript:;" @click="goToAegis"  class="jump-button">这里</a>跳转）或者项目的.feflowrc文件中未配置，</div>
        </div>
    </div> 
    <div class="aegis-project-wrap" v-if="hasAegisProject"> 
     <!-- tabs--> 
     <el-tabs v-model="activeName" @tab-click="handleClick" class="menu-route"> 
      <el-tab-pane label="PV&amp;UV" name="pvuv" class="first-label"> 
      </el-tab-pane> 
      <el-tab-pane label="日常监控" name="jserror"> 
      </el-tab-pane> 
     </el-tabs> 
     <div class="tab-container first-label" v-show="activeName ==='pvuv'"> 
      <div class="project-monitor-header"> 
       <div class="form-item"> 
        <div class="form-label"> 
         <span>页面:</span> 
        </div> 
        <div class="form-input"> 
         <el-select v-model="pvAegisId" placeholder="请选择"> 
          <el-option v-for="item in pvOptions" :key="item.value" :label="item.label" :value="item.value"> 
          </el-option> 
         </el-select> 
        </div> 
       </div> 
       <div class="form-item"> 
        <div class="form-label"> 
         <span>开始时间：</span> 
        </div> 
        <div class="form-input"> 
         <el-date-picker v-model="startDate" type="date" placeholder="选择日期"> 
         </el-date-picker> 
        </div> 
       </div> 
       <div class="form-item"> 
        <div class="form-label"> 
         <span>结束时间：</span> 
        </div> 
        <div class="form-input"> 
         <el-date-picker v-model="endDate" type="date" placeholder="选择日期"> 
         </el-date-picker> 
        </div> 
       </div> 
       <el-button type="primary" size="mini" @click="searchPvUvData">
        查询
       </el-button> 
      </div> 
      <div class="project-monitor-content"> 
       <div class="chart-wrap" v-if="echartData.length"> 
        <div class="chart-content" name="echarts" > 
         <chart :echartData="echartData"  /> 
        </div> 
       </div> 
       <div v-if="!echartData.length" class="no-echart-data">该查询条件暂无pv&uv 数据</div>
      </div> 
     </div> 
     <div class="tab-container second-label" v-show="activeName ==='jserror'"> 
      <div class="project-monitor-header"> 
       <div class="form-item"> 
        <div class="form-label"> 
         <span>页面:</span> 
        </div> 
        <div class="form-input"> 
         <el-select v-model="jsErrorAegisId" placeholder="请选择"> 
          <el-option v-for="item in jsErrorOptions" :key="item.value" :label="item.label" :value="item.value"> 
          </el-option> 
         </el-select> 
        </div> 
       </div> 
       <div class="form-item"> 
        <div class="form-label"> 
         <span>选择日期：</span> 
        </div> 
        <div class="form-input"> 
         <el-date-picker v-model="jsErrorStartDate" type="date" placeholder="选择日期"> 
         </el-date-picker> 
        </div> 
       </div> 
       <el-button type="primary" size="mini" @click="searchJsError">
        查询
       </el-button> 
      </div> 
      <div class="project-monitor-content"> 
       <div class="table-wrap"> 
        <div class="table-content" name="table"> 
         <el-table :data="jsErrorData" style="width: 100%"> 
          <el-table-column prop="total" label="出现次数" width="80"> 
          </el-table-column> 
          <el-table-column prop="title" label="错误内容"> 
          </el-table-column> 
         </el-table> 
        </div> 
       </div> 
      </div> 
     </div> 
     <div class="project-monitor-footer" v-show="showFooter"> 
      <span>查看更多数据请前往<span><a href="javascript:;" @click="goToAegis" class="jump-button">aegis 官网</a> </span></span>
     </div> 
    </div> 
   </div> 
  </template>
<script>
import { getUrlParam } from '@/common/utils'
import { openBrowser } from '@/common/native'
import Chart from './chart';
import { getCredential, getPvByDate, getUvByDate, getJsError } from './index.js';
import {loadFeflowConfigFile, loadProjectFeflowConfigFile} from '../../../bridge'
export default {
    name: 'projec-monitor',
    data() {
        return {
            credential: {},
            hasAegisProject: true,
            showFooter: false,
            projectName: '',
            jsErrorStartDate: '',
            jsErrorAegisId: '',
            jsErrorOptions: [],
            echartData: [],
            pvOptions: [],
            pvAegisId: '',
            pvTabActive: true,
            activeName: 'pvuv',
            value: '',
            startDate: '',
            endDate: '',
            credentialPromise: '',
            jsErrorData: []
        }
    },
    components: {
        Chart
    },
    async mounted() {
        this.projectName = getUrlParam('name')
        this.jsErrorOptions = this.getProjectAegiesList() || [];
        this.pvOptions = this.getProjectAegiesList() || [];
        this.checkHasProject();
        if (this.hasAegisProject) {
            this.credential = await getCredential();
            this.startDate = this.time2string(this.getYesterdayDate(), '-');
            this.endDate = this.time2string(new Date(), '-');
            this.searchPvUvData();
        }
    },
    methods: {
        checkHasProject() {
            if (!this.pvOptions || !this.pvOptions.length) {
                this.hasAegisProject = false;
            }
        },
        goToAegis() {
            openBrowser('https://aegis.ivweb.io/#/');
        },
        async handleClick(tab, event) {
            if (tab === 'pvuv') {
                this.pvTabActive = true;
            } else {
                await this.searchJsError();
            }
        },
        getProjectAegiesList() {
            let projectPath = ''
            let doc = loadFeflowConfigFile();
            if (this.projectName && doc.projects && doc.projects[this.projectName]) {
               projectPath = doc.projects[this.projectName]['path'];
            }
            const feflowrcJSON = loadProjectFeflowConfigFile(projectPath)
            const { pageMap = {} } = feflowrcJSON['aegis-plugin']
            let options = [];
            for (let key in pageMap) {
                if (pageMap[key]) {
                   options.push({
                       label: key,
                       value: pageMap[key].id
                   })
               }
           }
           return options;
        },
        async searchPvUvData() {
            this.pvAegisId = this.pvAegisId || (this.pvOptions[0] && this.pvOptions[0].value) || '528';
            /* 相关接口文档http://aegis.oa.com/open-api/#pv */
            const pvData = await getPvByDate(this.pvAegisId, this.time2string(this.startDate), this.time2string(this.endDate));
            const uvData = await getUvByDate(this.pvAegisId, this.time2string(this.startDate), this.time2string(this.endDate));
            let xAxis = [];
            let pvDataList = [];
            let uvDataList = [];
            let echartData = [];

            if (pvData.data && pvData.data.length) {
                for (let pv of pvData.data) {
                    xAxis.push(pv.date);
                    pvDataList.push(pv.pv);
                }
                echartData.push({
                    text: 'pv',
                    color: '#456ef4', // 折线图颜色
                    dataLsit: pvDataList, // 折线图数值
                    getXAxis: xAxis
                });
            }
            if (uvData.data && uvData.data.length) {
                for (let uv of uvData.data) {
                    uvDataList.push(uv.uv);
                }
                echartData.push({
                    text: 'uv',
                    color: '#3fe0c2',
                    dataLsit: uvDataList,
                    getXAxis: xAxis
                })
            }
            this.echartData = echartData;
            if (this.echartData.length) {
                this.showFooter = true;
            } else {
                this.showFooter = false;
            }
        },
        async searchJsError() {
            this.jsErrorAegisId = this.jsErrorAegisId || this.jsErrorOptions[0].value || '528';
            this.jsErrorStartDate = this.time2string(this.jsErrorStartDate, '-');
            let result = await getJsError(this.jsErrorAegisId, this.jsErrorStartDate);
            this.jsErrorData = result && result.data[0] && result.data[0].content;
            if (this.jsErrorData && this.jsErrorData.length) {
                this.showFooter = true;
            } else {
                this.showFooter = false;
            }
        },
        getYesterdayDate() {
            let date = +new Date(); // 获取当前日期时间戳
            let before = date - 1000 * 60 * 60 * 24;// 当前日期时间戳减去一天时间戳
            return new Date(before);// 将时间戳转化为Date对象
        },
        time2string(t, symbol = '') {
            let date = t ? new Date(t) : new Date();
            return (
            date.getFullYear() +
            symbol +
            ('00' + (date.getMonth() + 1)).slice(-2) +
            symbol +
            ('00' + date.getDate()).slice(-2));
        }
    }
}
</script>
<style>
#tab-pvuv {
    padding-left: 10px;
}
.project-monitor {
    height: 100%;
}
.project-monitor .route-menu {
    position: fixed;
    width: 100%;
}
.tab-container {
    margin-left: 10px;
    min-height: 400px;
}
.project-monitor-header {
    margin-top: 20px;
}
.project-monitor-header, .project-monitor-header .form-item {
    display: flex;
}
.form-item {
    /* flex: auto; */
    /* justify-content: center; */
    align-items: center;
    margin-left: 10px;
}
.form-item:first-child {
    margin-left: 2px;
}
.form-label {
    font-size: 10px;
    color: #434650;
}
.form-input {
    width: 140px;
    margin-left: 4px;
}
.project-monitor-header .el-date-editor.el-input, .project-monitor-header .el-date-editor.el-input__inner {
    width: 140px;
}
.project-monitor-content{
    margin-left: 6px;
    margin-top: 6px;
}
.first-label .no-echart-data{
    margin-top: 150px;
    text-align: center;
    font-size: 12px;
    color: #8A92AF;
}

.second-label .info-label-wrap {
    width: 120px;
    display: flex;
    padding: 12px;
    background: #F3F4F5;
    border-radius: 5px;
    justify-content: space-between;
    margin-right: 10px;
}
.second-label .info-label-wrap .info-label-value {
    font-size: 12px;
    color: #2F8AFF; 
}

.project-monitor-footer {
    font-size: 10px;
    color: #8A92AF;
    margin: 22px 0 10px 20px;
}
.jump-button {
    font-size: 10px;
    color: #409eff;
    line-height: 14px;
    margin-left: 4px;
    display: inline-block;
}
.project-monitor .no-project{
    height: 100%;
}
.project-monitor .no-project{
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
}
.project-monitor .no-project .no-project-logo {
  background: #353740;
  background: url(../../../assets/img/no-aegis-project.png) center center no-repeat;
  background-size: cover;
  width: 184px;
  height: 124px;
}
.project-monitor .no-project .content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 40px;
}
.project-monitor .no-project .desc{
    font-size: 10px;
    color: #8A92AF;
}
</style>