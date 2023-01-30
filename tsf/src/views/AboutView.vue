<template>
  <h2>이건 양형님에게 잘 보일 기회야</h2>
  <input @change="upload" type="file" id="file" class="inputfile"  accept ="image/* " />
  <br>
    <img v-bind:src="images">
</template>

<script>
import axios from "axios";
export default{
  name:'app',
data() {
  return{
  imageUrl : ''
  }
  },
  methods:{
    upload(e) {

let imageFile = e.target.files; // 업로드한 파일의 데이터가
let url = URL.createObjectURL(imageFile[0]); // 파일의 필요한 데이터만을 url 변수에 넣음
this.imageUrl = url; // 미리 작성해둔 imageUrl : ' ' 변수에 가지고있는 경로데이터를 넣음
this.imageUrl = window.btoa(url)
console.log(imageFile[0]); // 업로드한 파일의 데이터가 확인
console.log(url); // 확인


axios({
        url: "http://localhost:3000/about",
        method: "POST", // 전송방식을 post로 지정
        data: {
          imageUrl: this.imageUrl,
        },
      }).then((res) => {
        alert(res.data.message);
      });

},
  }
}
</script>

<style>
</style>