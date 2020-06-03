<template>
<div class="project-monitor">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="menu-route">
      <el-tab-pane label="PV&UV" name="pvuv" class="first-label">
      </el-tab-pane>
      <el-tab-pane label="日常监控" name="jserror">
      </el-tab-pane>
      
  </el-tabs>
  <div class="tab-container first-label" v-show="activeName ==='pvuv' ">
      <div class="project-monitor-header">
          <div class="form-item">
              <div class="form-label">
                  <span>页面:</span>
              </div>
              <div class="form-input">
                <el-select v-model="pvAegisId" placeholder="请选择">
                <el-option
                v-for="item in pvOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
                </el-select>
              </div>
          </div>
          <div class="form-item">
              <div class="form-label">
                  <span>开始时间：</span>
              </div>
              <div class="form-input">

                <el-date-picker
                v-model="startDate"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
              </div>
          </div>
           <div class="form-item">
              <div class="form-label">
                  <span>结束时间：</span>
              </div>
              <div class="form-input">

                <el-date-picker
                v-model="endDate"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
              </div>
          </div>
          <el-button type="primary" size="mini" @click="searchPvUvData">查询</el-button>

      </div>
      <div class="project-monitor-content">
          <div class="chart-wrap">
              <!-- <div class="chart-head">
                  <div class="title">PV&UV</div>
                  <div class="tip">
                      <div class="pv-tip"><span></span><span>pv</span></div>
                      <div class="uv-tip"><span></span><span>uv</span></div>
                  </div>
              </div> -->
              <div class="chart-content" name="echarts">
                  <Chart :echartData="echartData" v-if="echartData.length"/>
              </div>
          </div>
      </div>
  </div>

    <div class="tab-container second-label"  v-show="activeName ==='jserror'">
      <!-- <div class="project-monitor-header">
          <div class="info-label-wrap">
              <div class="info-label-name">
                  <span>错误数:</span>
              </div>
              <div class="info-label-value">
               <span>325</span>
              </div>
          </div>
      </div> -->
        <div class="project-monitor-header">
          <div class="form-item">
              <div class="form-label">
                  <span>页面:</span>
              </div>
              <div class="form-input">
                <el-select v-model="jsErrorAegisId" placeholder="请选择">
                <el-option
                v-for="item in jsErrorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
                </el-select>
              </div>
          </div>
          <div class="form-item">
              <div class="form-label">
                  <span>选择日期：</span>
              </div>
              <div class="form-input">

                <el-date-picker
                v-model="jsErrorStartDate"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
              </div>
          </div>
          <el-button type="primary" size="mini" @click="searchJsError">查询</el-button>

      </div>
      <div class="project-monitor-content ">
          <div class="table-wrap">
              <div class="table-content" name="table">
                      <el-table
                    :data="jsErrorData"
                    style="width: 100%">
                    <el-table-column
                        prop="total"
                        label="出现次数"
                        width="80">
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="错误内容">
                    </el-table-column>
                    </el-table>
              </div>
          </div>
      </div>
  </div>

  <div class="project-monitor-footer">
      查看更多数据请前往<a href="https://aegis.ivweb.io/#/" class="jump-button">aegis 官网</a>
  </div>
</div>
</template>
<script>
import { getUrlParam } from '@/common/utils'
import Chart from './chart';
import { getCredential, getPvByDate, getUvByDate, getJsError } from './index.js';
import {loadFeflowConfigFile, loadProjectFeflowConfigFile} from '../../../bridge'
export default {
    name: 'projec-monitor',
    data() {
        return {
            credential: {},
            projectName: '',
            jsErrorStartDate: '',
            jsErrorAegisId: '',
            jsErrorOptions: [],
            echartData: [],
            pvOptions: [],
            pvAegisId: '',
            pvTabActive: true,
            activeName: 'pvuv',
            initOptions: [{
            value: '528',
            label: 'aegis-demo'
            }],
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
        this.jsErrorOptions = this.getProjectAegiesList() || [...this.initOptions];
        this.pvOptions = this.getProjectAegiesList() || [...this.initOptions];
        this.credential = await getCredential();
        this.startDate = this.time2string(this.getYesterdayDate(), '-');
        this.endDate = this.time2string(new Date(), '-');
        this.searchPvUvData();
    },
    methods: {
        async handleClick(tab, event) {
            if (tab === 'pvuv') {
                this.pvTabActive = true;
            } else {
                await this.searchJsError();
                // this.jsErrorData = result.data[0].content;
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

            if (pvData.data && pvData.data.length) {
                for (let pv of pvData.data) {
                    xAxis.push(pv.date);
                    pvDataList.push(pv.pv);
                }
            }
            if (uvData.data && uvData.data.length) {
                for (let uv of uvData.data) {
                    uvDataList.push(uv.uv);
                }
            }
            this.echartData = [{
                text: 'pv',
                color: '#456ef4', // 折线图颜色
                dataLsit: pvDataList, // 折线图数值
                getXAxis: xAxis
            }, {
                text: 'uv',
                color: '#3fe0c2',
                dataLsit: uvDataList,
                getXAxis: xAxis
            }]
        },
        async searchJsError() {
            this.jsErrorAegisId = this.jsErrorAegisId || this.jsErrorOptions[0].value || '528';
            this.jsErrorStartDate = this.time2string(this.jsErrorStartDate, '-');
            let result = await getJsError(this.jsErrorAegisId, this.jsErrorStartDate);
            this.jsErrorData = result.data[0].content;
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
.project-monitor .route-menu {
    position: fixed;
    width: 100%;
}
.tab-container {
    margin-left: 10px;
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
</style>