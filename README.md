# zui-upload

> A Vue.js project

分为七牛云上传跟图片压缩两种，解决了手机端拍照上传图片旋转等问题。  
第一种使用方式：七牛云上传，七牛云上传时需要配置 qiniuOptions 配置项，直接上传七牛云，上传完毕返回上传图片的信息  
第二种使用方式：图片压缩，只有压缩图片的功能，压缩成功后返回图片文件信息，根据返回的文件信息自己上传服务端  


### Example

```vue
<template>
  <div>
    <!-- 使用七牛云压缩图片并上传 -->
    <zui-upload
      :qiniu-options="qiniuOptions"
      :img-options="imgOptions"
      @next="next"
      @complete="complete"
      @error="error"
    ></zui-upload>
    <!-- 不上传，只压缩图片 -->
    <zui-upload :img-options="imgOptions" @complete="complete"></zui-upload>
    <img id="previewImg" src alt>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgOptions: {
        width: 600,
        height: 600,
        quality: 0.8
      },
      qiniuOptions: {
        token: "你的七牛云token",
        baseUrl: "你的七牛云路径"
      }
    };
  },
  methods: {
    next(res) {
      console.log(res);
      console.log("七牛云上传时：进度");
    },
    error(err) {
      console.log(err);
      console.log("七牛云上传错误时：错误信息");
    },
    complete(res) {
      console.log(res);
      console.log("上传完成");
      document.getElementById("previewImg").src = res.url;
    }
  }
};
</script>
```



### Options
|    配置项    |    属性    |    描述   |   类型   |	默认值	|
| -----------------   | -----------------   | ---------------- | :--------: | :----------: |
| imgOptions     |   | 图片的配置 |    |
|   |  width  | 宽度  |Number | -     |
|    |  height  | 高度  |Number | -     |
|    |  quality  | 质量  |Number | 0.9     |
| qiniuOptions     |   | 七牛云配置(不使用七牛云上传无需配置) |    |
||  token  | 七牛云token  |String | -     |
||  baseUrl  | 七牛云路径  |String | -     |




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
