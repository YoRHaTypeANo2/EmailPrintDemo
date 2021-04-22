<template>
  <div class="index">
    <br/>
    <!-- <input type="file" accept="image/*"  multiple="multiple" @change="getfile"/> -->
    <input type="file" accept="image/*" @change="getfile"/>
    <br/>
    <br/>
    <br/>
    <button @click="submit()">打印</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'index',
  data() {
    return {
      files: null,
      name: ''
    };
  },
  methods: {
    submit() {
      if (!this.files) {
        alert('请上传图片');
        return;
      } else {
        let formData = {
          filename: this.name,
          files: this.files,
        };
        axios({
          method: 'post',
          url: '/api/email',
          data: formData,
        });
      }
    },
    getfile(e){
      console.log(e.target.files)
      // console.log('e.target===========',e.target.files[0])
      // console.log('e.target===========',e.target.files[0].name)
      // console.log('windowURL===========',window.URL.createObjectURL(e.target.files[0]));
      let image = new Image();
      image.src = window.URL.createObjectURL(e.target.files[0]);
      // console.log(image);
      image.onload = () => {
        let Base64Img = this.getBase64Img(image);
        let uploadfiles = [];
        uploadfiles.push(Base64Img);
        this.name = e.target.files[0].name;
        this.files = uploadfiles;
        console.log('上传至后端的base64图片：',this.files);
        console.log('文件名：',this.name);
      }
    },
    getBase64Img(img) {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
      let dataURL = canvas.toDataURL("image/" + ext);
      return dataURL;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>