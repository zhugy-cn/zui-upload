# zui-upload

> A Vue.js project

### Options
|    配置项    |    属性    |    描述   |   类型   |	默认值	| 示例 |
| -----------------   | -----------------   | ---------------- | :--------: | :----------: |:----------: |
| imgOptions     |   | 图片的配置 |    |
|   |  width  | 宽度  |Number | -     | 200  |
|    |  height  | 高度  |Number | -     | 200  |
|    |  quality  | 质量  |Number | 0.9     | 0.85 |
| qiniuOptions     |   | 七牛云配置(不使用七牛云上传无需配置) |    |
||  token  | 七牛云token  |String | -     | zXPk0Bi0lXgMw4xc9h_VT... |
||  baseUrl  | 七牛云路径  |String | -     | http://yourpath.com/ |




### Functions
| 函数 | 描述   | 参数 |
| :--------:   | -----  | -----  | 
|    complete    |  文件上传(压缩)成功后触发  | 文件对象 |
|    next    |  文件上传中触发（七牛云上传时有效）  | 上传进度 |
|    error   | 文件上传失败后触发（七牛云上传时有效） | 失败原因 |




## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
