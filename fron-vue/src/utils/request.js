import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import router from '@/router'

const apiConfig = {
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
}

const errHandler = (error) => {
  console.log('reponse error', error)
  Message.closeAll()
  let message = error.message
  if (error.response && error.response.data && error.response.data['resp_code']) { // 登录提示
    message = error.response.data['rsp_msg'] || error.response.data['resp_msg']
  }

  if (error.response && error.response.data && error.response.data['resp_code'] && error.response.data['resp_msg']) {
    if (error.response.data['resp_code'] === '401' && error.response.data['resp_msg'].startsWith('Invalid access token')) {
      // 401超时
      const message = '会话超时，请重新登录'
      // store.dispatch('logout')
      // eslint-disable-next-line standard/object-curly-even-spacing
      router.push({ path: `/login`})
      location.reload()
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000,
        showClose: true
      })
      return Promise.reject(error)
    } else {
      Message({
        dangerouslyUseHTMLString: true,
        message: error.response.data['resp_msg'],
        type: 'error',
        duration: 5 * 1000,
        showClose: true
      })
      return Promise.reject(error)
    }
  } else {
    Message({
      dangerouslyUseHTMLString: true,
      message: `${message}`,
      type: 'error',
      duration: 5 * 1000,
      showClose: true
    })
  }

  return Promise.reject(error)
}

// create an axios instance
export const sysRequest = axios.create(apiConfig)

sysRequest.setToken = (token) => {
  sysRequest.defaults.headers['Authorization'] = 'Bearer ' + token
  // store.dispatch('setToken', token)
}

// request interceptor
sysRequest.interceptors.request.use(
  config => {
    // do something before request is sent
    // if (store.getters.token) {
    //   // let each request carry token --['X-Token'] as a custom key.
    //   config.headers['Authorization'] = 'Bearer ' + store.getters.token
    // }

    if (config.method === 'get') {
      config.params = Object.assign(config.params || {}, { time: new Date().getTime() })
    }

    if (['post', 'put', 'delete'].includes(config.method) && typeof config.data === 'object') {
      console.log('sysrequest', config.url)
      config.data = Object.keys(config.data).map(key => `${key}=${config.data[key]}`).join('&')
      config.data = encodeURI(config.data) // 解决参数中包含特殊字符无法保存的问题
      config.headers['Content-Type'] = 'application/x-www-form-urlencodedcharset=UTF-8'
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
sysRequest.interceptors.response.use(

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code.
   */
  response => {
    console.log('response', response)
    // if the custom code is not 20000, it is judged as an error.
    Message.closeAll()
    if (response.status !== 200) {
      Message({
        message: response.message || 'error',
        type: 'error',
        duration: 60 * 1000,
        showClose: true
      })
      return Promise.reject(response.message || 'error')
    }

    // 50008: Illegal token 50012: Other clients logged in 50014: Token expired
    if (response.status === 50008 || response.status === 50012 || response.status === 50014) {
      // to re-login
      MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // store.dispatch('resetToken').then(() => {
        //   location.reload()
        // })
      })
    }

    return response.data
  }, errHandler)
