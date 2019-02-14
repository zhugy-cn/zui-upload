import Upload from './upload.vue'

// 在 main.js 里面引入使用 use 注册的就是全局的（执行install）
// 在组件里面引入注册的就是局部的（不会执行install）
Upload.install = function (Vue) {
  Vue.component(Upload.name, Upload)
}

// 当 Vue 跟插件都是使用 script 标签引入的，那么这时候的 Vue 会是一个全局变量
// 直接下载并用 <script> 标签引入，Vue 会被注册为一个全局变量。
// 这时候就自动注册
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Upload.install)
}


export default Upload
