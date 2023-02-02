<!-- https://velog.io/@hgoguma_124/Vue.js-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%97%86%EC%9D%B4-Drag-Drop-%EA%B0%80%EB%8A%A5%ED%95%9C-%ED%8C%8C%EC%9D%BC-%EC%97%85%EB%A1%9C%EB%93%9C-%EB%A7%8C%EB%93%A4%EA%B8%B0 -->
<template>
  <form action="">
    <div class="container">
      <div
        class="file-upload-container"
        @dragenter="onDragenter"
        @dragover="onDragover"
        @dragleave="onDragleave"
        @drop="onDrop"
        @click="onClick"
      >
        <div class="file-upload" :class="isDragged ? 'dragged' : ''">
          사진이나 이미지 파일을 드래그 & 드랍
        </div>
      </div>
      <!-- 파일 업로드 -->
      <input
        type="file"
        ref="fileInput"
        class="file-upload-input"
        @change="onFileChange"
        multiple
      />
      <!-- 업로드된 리스트 -->
      <div class="file-upload-list">
        <div
          class="file-upload-list__item"
          v-for="(file, index) in fileList"
          :key="index"
        >
          <div class="file-upload-list__item__data">
            <img
              class="file-upload-list__item__data-thumbnail"
              v-bind:id="file.name"
              :src="file.src"
            />
            <div
              class="file-upload-list__item__data-name"
              v-bind:id="0 + file.name"
            >
              <!-- {{ file.name }} -->
            </div>
          </div>
          <div
            class="file-upload-list__item__btn-remove"
            @click="mobileNet(file.name)"
          >
            분석
          </div>
          <div
            class="file-upload-list__item__btn-remove"
            @click="handleRemove(index)"
          >
            삭제
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
/* eslint-disable */
export default {
  name: "app",
  created() {
    // 번역된 prediction을 제자리로 뿌려줌
    this.$socket.on("translate", (msg) => {
      // 받은 자료의 형태가 "파일이름(=id)/번역된 prediction" 그래서 split("/")으로 스트링을 나눔
      const massages = msg.split("/");
      // 파일이름으로 된 id를 찾아 번역된 prediction을 삽입
      const prediction = document.getElementById(0 + massages[0]);
      prediction.innerHTML = massages[1];

      // base64 확인 테스트 중..
      // console.log(massages);
      // const img = document.getElementById(massages[0]);
      // console.log(img.src);
    });
  },
  data() {
    return {
      fileList: [],
      PredictionsList: [],
    };
  },
  methods: {
    onClick() {
      this.$refs.fileInput.click();
    },
    onDragenter() {
      // class 넣기
      this.isDragged = true;
    },
    onDragleave() {
      // class 삭제
      this.isDragged = false;
    },
    onDragover(event) {
      // 드롭을 허용하도록 prevetDefault() 호출
      event.preventDefault();
    },
    onDrop(event) {
      // 기본 액션을 막음 (링크 열기같은 것들)
      event.preventDefault();
      this.isDragged = false;
      const files = event.dataTransfer.files;
      this.addFiles(files);
    },
    onFileChange(event) {
      const files = event.target.files;
      this.addFiles(files);
    },
    // 업로드 된 파일 리스트 생성
    async addFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const src = await this.readFiles(files[i]);
        files[i].src = src;
        console.log(files[i]);
        // files[i] 형태를 확인
        this.fileList.push(files[i]);
        this.$socket.emit("src", files[i].src);
        // 소켓으로 src 전송
      }
    },
    // FileReader를 통해 파일을 읽어 thumbnail 영역의 src 값으로 셋팅
    async readFiles(files) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          resolve(e.target.result);
        };
        reader.readAsDataURL(files);
      });
    },
    handleRemove(index) {
      this.fileList.splice(index, 1);
    },
    // 분석 시작
    mobileNet(file) {
      const image = document.getElementById(file);
      // 이미지가 담긴 img를 불러옴
      // img로 분석 시작
      mobilenet.load().then((model) => {
        model.classify(image).then((predictions) => {
          // 번역을 위해 prediction을 소켓으로 전송
          this.$socket.emit(
            "translate",
            file +
              "/" +
              predictions[0].className +
              ":" +
              (predictions[0].probability * 100).toFixed(2) +
              "%<br>" +
              predictions[1].className +
              ":" +
              (predictions[1].probability * 100).toFixed(2) +
              "%<br>" +
              predictions[2].className +
              ":" +
              (predictions[2].probability * 100).toFixed(2) +
              "%"
            // 번역된 prediction이 제자리에 뿌려지려면
            // 보내는 데이터에 id를 특징할 수 있는 내용도 함께 전송
          );
        });
      });
    },
  },
};
</script>

<style lang="scss">
.container {
  min-height: 300px;
  width: 500px;
  margin: 0 auto;
}
.file-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: transparent;
  border-radius: 20px;
  cursor: pointer;
  &.dragged {
    border: 1px dashed powderblue;
    opacity: 0.6;
  }
  &-container {
    height: 300px;
    padding: 20px;
    margin: 0 auto;
    box-shadow: 0 0.625rem 1.25rem #0000001a;
    border-radius: 20px;
  }
  &-input {
    display: none;
  }
  &-list {
    margin-top: 10px;
    width: 100%;
    &__item {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &__data {
        display: flex;
        align-items: center;
        &-thumbnail {
          margin-right: 10px;
          border-radius: 20px;
          width: 120px;
          height: 120px;
        }
      }
      &__btn-remove {
        cursor: pointer;
        border: 1px solid powderblue;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        border-radius: 6px;
      }
    }
  }
}
</style>
