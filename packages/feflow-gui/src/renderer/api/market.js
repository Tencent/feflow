/**
 * API request for plugin market
 */
// import http from '../common/request'
import axios from 'axios'

const LEGO_URL = 'https://now.qq.com/cgi-bin/now/activity_cms/form_data'
const ACT_ID = 107898509

export default {
  getPluginListFromLego() {
    return axios.get(LEGO_URL, { params: { actid: ACT_ID } })
  }
}
