<template>
  <div class="zui-upload-btn">
    <slot>
      <div class="zui-upload-btn-def"></div>
    </slot>
    <input type="file" @change="inputChange()" accept="image/*" class="zui-upload-input" />
  </div>
</template>
<script>
import EXIF from "exif-js";
import * as qiniu from "qiniu-js";
import { dataURLtoFile, guid, dataURItoBlob } from "./utils.js";
export default {
  name: "zui-upload",
  props: {
    qiniuOptions: {
      type: Object
    },
    imgOptions: {
      type: Object,
      default: {
        quality: 0.9
      }
    }
  },
  data() {
    return {
      fileInfo: {}
    };
  },
  methods: {
    inputChange() {
      const _this = this;
      const file = event.target.files[0];

      // 处理图片上传旋转问题
      EXIF.getData(file, function() {
        _this.orientation = EXIF.getTag(file, "Orientation");
      });

      const { name, size, type } = file;
      const suffix = name.slice(name.lastIndexOf(".") + 1).toLowerCase(); // 获取后缀名
      const key = new Date().getTime() + guid() + "." + suffix;
      const img = new Image(); // 创建一个img对象
      // fileReader 异步读取存储在用户计算机上的文件
      const fileReader = new FileReader();
      // readAsDataURL 方法会读取指定的 Blob 或 File 对象
      fileReader.readAsDataURL(file);
      // 读取文件时会触发一个 load 事件，从而可以使用  FileReader.onload 属性对该事件进行处理。
      fileReader.onload = function() {
        // 读取出来的结果，（base64）
        img.src = this.result; // event.target.result
      };
      img.onload = () => this._imgLoaded(img);
      // 上传第二次不能选择同一文件
      event.target.value = "";
      this.fileInfo = {
        suffix,
        type,
        key,
        originSize: size
      };
    },
    _imgLoaded(img) {
      // 图片原始尺寸
      let originWidth = img.width;
      let originHeight = img.height;
      // 传入的参数
      let { width, height, quality } = this.imgOptions;

      // 图片最大尺寸，可通过国设置宽高来实现图片压缩程度
      let maxWidth = width || originWidth;
      let maxHeight = height || originHeight;
      // 目标尺寸
      let targetWidth = originWidth;
      let targetHeight = originHeight;

      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
      }
      this.fileInfo = {
        ...this.fileInfo,
        width: targetWidth,
        height: targetHeight
      };
      this._drawImage(img, targetWidth, targetHeight, quality);
    },
    // 利用cavans压缩并绘制图片
    _drawImage(img, width, height, quality) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // canvas对图片进行缩放
      canvas.width = width;
      canvas.height = height;

      //  图片压缩
      let orientation = this.orientation;
      if (orientation && orientation != 1) {
        switch (orientation) {
          case 3: // 旋转180度
            ctx.rotate(Math.PI);
            ctx.drawImage(img, -width, -height, width, height);
            break;
          case 6: // 旋转90度
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(img, 0, -height, width, height);
            break;
          case 8: // 旋转-90度
            canvas.width = height;
            canvas.height = width;
            ctx.rotate((3 * Math.PI) / 2);
            ctx.drawImage(img, -width, 0, width, height);
            break;
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      let { key, type } = this.fileInfo;
      let base64 = canvas.toDataURL(type, quality); //压缩后的 base64 格式
      let fileObj = dataURItoBlob(base64);
      if (this.qiniuOptions && this.qiniuOptions.token) {
        this._uploadQiniu(fileObj);
      } else {
        this.$emit("complete", {
          ...this.fileInfo,
          file: fileObj,
          url: base64
        });
      }
    },
    // 上传七牛云
    _uploadQiniu(file) {
      const { key } = this.fileInfo;
      const { token, baseUrl } = this.qiniuOptions;
      const config = {
        useCdnDomain: true
      };
      const putExtra = {};
      let observable = qiniu.upload(file, key, token, putExtra, config);
      observable.subscribe({
        next: res => {
          // 主要用来展示进度
          let total = res.total;
          this.$emit("next", total);
        },
        error: err => {
          // 失败报错信息
          this.$emit("error", err);
        },
        complete: res => {
          this.$emit("complete", {
            ...this.fileInfo,
            url: baseUrl + res.key,
            size: file.size
          });
        }
      });
    }
  }
};
</script>
<style scoped src="./upload.css"></style>