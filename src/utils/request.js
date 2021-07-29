import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { isArray } from '@/utils/validate'
import router from '@/router'
// import res_msg from '@/utils/res-message'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: process.env.VUE_APP_WANGSHAUNG_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 0 // request timeout
})
const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const CancelToken = axios.CancelToken
const removePending = ever => {
  for (const p in pending) {
    if (pending[p].u === ever.url + '&' + ever.method) {
      // 当当前请求在数组中存在时执行函数体
      pending[p].f() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}
const CODE_MESSAGE = {
  200: '服务器成功返回请求数据',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队(异步任务)',
  204: '删除数据成功',
  400: '发出信息有误',
  401: '用户没有权限(令牌、用户名、密码错误)',
  403: '用户得到授权，但是访问是被禁止的',
  404: '访问资源不存在',
  406: '请求格式不可得',
  410: '请求资源被永久删除，且不会被看到',
  500: '服务器发生错误',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时'
}
const successCode = [200, 0, '0', '200', 204, 201]
// 操作正常Code数组
const codeVerificationArray = isArray(successCode)
  ? [...successCode]
  : [...[successCode]]
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer' + ' ' + getToken()
    }

    // ------------------------------------------------------------------------------------
    removePending(config) // 在一个ajax发送前执行一下取消操作
    config.cancelToken = new CancelToken(c => {
      // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
      pending.push({ u: config.url + '&' + config.method, f: c })
    })
    // ---------------------------------------------------------------
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(response)
    const { config, data, status, statusText } = response
    let code = data && data.code ? data.code : status
    if (codeVerificationArray.indexOf(code) + 1) code = 200
    // ------------------------------------------------------------------------------------------
    removePending(response.config) // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    // -------------------------------------
    if (response.config.responseType === 'arraybuffer') {
      return response
    }
    switch (code) {
      case 200:
        // 业务层级错误处理，以下是假定restful有一套统一输出格式(指不管成功与否都有相应的数据格式)情况下进行处理
        // 例如响应内容：
        // 错误内容：{ status: 1, msg: '非法参数' }
        // 正确内容：{ status: 200, data: {  }, msg: '操作正常' }
        // 修改返回内容为 `data` 内容，对于绝大多数场景已经无须再关心业务状态码(code)和消息(msg)
        // return data.data ? data.data : data.msg
        // 或者依然保持完整的格式

        return data
      case 401:
        break
      case 403:
        router.push({ path: '/403' })
        break
      case 5001:
        return data
      case 5000:
        // eslint-disable-next-line no-case-declarations
        const message = '相关数据为空,请添加数据或更新相关流程'
        // Vue.prototype.$baseMessage(
        //   message,
        //   'error',
        //   false,
        //   'vab-hey-message-error'
        // )

        return Promise.reject(message)
    }
    const message = `${config.url} 后端接口 ${code} 异常：${
      !data ? CODE_MESSAGE[code] : !data.msg ? statusText : data.msg
    }`
    Message({
      message: message || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(new Error(message || 'Error'))
  },
  error => {
    if (error.constructor.name !== 'Cancel') {
      console.log('err', error) // for debug
      Message({
        message: error,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
