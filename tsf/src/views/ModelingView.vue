<template>
  <div>아버지와 아들의 키를 담은 엑셀파일을 넣어주세요.</div>
  <br />
  <div>
    <input type="file" @change="readExcel" /><button
      id="modeling-button"
      @click="modeling"
    >
      분석시작
    </button>
  </div>
  <br />
  <div>
    <input type="text" id="input_data" /><button @click="prediction">
      예측
    </button>
  </div>
  <div id="predict_section"></div>
</template>

<script>
// import { response } from "express";

/* eslint-disable */
export default {
  name: "app",
  data() {
    return {
      father_height: [],
      son_height: [],
    };
  },
  methods: {
    async readExcel(event) {
      console.log(event);
      let input = event.target; // target?
      let reader = new FileReader(); // FileReader??
      let father_height_dum = [];
      let son_height_dum = [];
      // 이유는 정확하게 알 수 없지만 아래 for구문 안에서 전역변수인
      // father_height가 인식되지 않아 임시로 배열을 추가해 옮겨 담는다
      reader.onload = function (_) {
        // onload?
        let data = reader.result;
        let wordBook = XLSX.read(data, { type: "binary" }); // ???
        const x = wordBook.Sheets.train; // 엑셀의 sheet를 정한다
        for (let j = 2; j < 757; j++) {
          father_height_dum.push(x["A" + j].v);
          son_height_dum.push(x["B" + j].v);
        }
      };
      reader.readAsBinaryString(input.files[0]);
      // ???
      this.father_height = father_height_dum;
      this.son_height = son_height_dum;
      // 전역변수에 옮겨 담는다
    },
    modeling(_) {
      console.log(this.father_height);
      let xt = tf.tensor(this.father_height); // 이게 의미하는 게 뭘까.. 굳이 tf.tensor로 만드는 이유는?
      let yt = tf.tensor(this.son_height);

      // 모델의 모양을 만들기
      let X = tf.input({ shape: [1] }); // 값 하나 들어옴
      let Y1 = tf.layers.dense({ units: 10, activation: "relu" }).apply(X); // apply를 통해 연결
      let Y2 = tf.layers.dense({ units: 10, activation: "relu" }).apply(Y1);
      // 히든 레이어 2층
      let Z = tf.layers.dense({ units: 1 }).apply(Y2);
      let model = tf.model({ inputs: X, outputs: Z }); // 인아웃풋 저장
      tfvis.show.modelSummary({ name: "Model Summary" }, model);
      let compileParam = {
        optimizer: tf.train.adam(), // train ??
        loss: tf.losses.meanSquaredError,
      }; // 최적화의 loss 측정방법종류
      model.compile(compileParam); // 컴파일
      const fitParm = {
        epochs: 100,
        // callbacks: {
        //   onEpochEnd: function (epoch, logs) {
        //     console.log("epoch", epoch, logs, "RMSE=>", Math.sqrt(logs.loss));
        //     // RMSE는 뭐임? sprt는 뭐임?
        //   },
        // },
        // tfvis를 통해 그래프 생성
        callbacks: tfvis.show.fitCallbacks(
          { name: "Training Performance" },
          ["loss", "mse"],
          { height: 200, callbacks: ["onEpochEnd"] }
        ),
      };
      // const my = tf.tensor([32]);
      model.fit(xt, yt, fitParm).then(() => {
        console.log(model);
        // model.fit(xt, yt, fitParm) => 데이터와 모델을 통해 모델링을 한다. => 그리고 거기서 나온 식으로
        let result = model.predict(xt);
        // model.predict(my) => 특정 값의 예상값을 뽑아낼 수 있다.
        result.print();
        // model.save("downloads://my-model"); // 다른 저장방식
        model.save("localstorage://my-model-3");
        // 로컬에 모델을 저장
        console.log("모델 저장됨");
      });
    },
    // 입력한 값으로 예측하기 시작
    async prediction() {
      const inputData = document.getElementById("input_data");
      const xt = tf.tensor(Number(inputData.value));
      const model = await tf.loadLayersModel("localstorage://my-model-3");
      // 로컬에 저장된 모델이 불러와지지 않는다..
      console.log("모델 로드됨");
      console.log(model);
      let newResult = model.predict(xt);
      newResult.print();
    },
  },
};
</script>

<style></style>
