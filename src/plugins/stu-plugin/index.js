
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import drag from '@/directive/el-drag-dialog'
import permission from '@/directive/permission/index.js'
import action from '@/directive/action'
import moment from 'moment' // 导入文件

export default {
  install(Vue) {
    Vue.prototype.$bus = new Vue() // bus  中央总线
    permission.install(Vue) // 指令权限
    action.install(Vue)
    drag.install(Vue) // 全局dialog拖拽
    Vue.prototype.$moment = moment // moment 日期组件
    Vue.prototype.$http = request // by  刘程锦 以后用这个 axios实例
    Vue.component('Pagination', Pagination) // 全局分页
  }
}
