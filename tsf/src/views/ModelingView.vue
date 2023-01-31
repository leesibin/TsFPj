<template>
  <div>아버지와 아들의 키를 담은 엑셀파일을 넣어주세요.</div>
  <br />
  <div>
    <input type="file" @change="readExcel" /><button
      id="modeling-button"
      @click="modeling()"
    >
      분석시작
    </button>
  </div>
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
      this.father_height = father_height_dum;
      this.son_height = son_height_dum;
      // ???
    },
    modeling(_) {
      console.log(this.father_height);
      let xt = tf.tensor(this.father_height); // 이게 의미하는 게 뭘까.. 굳이 tf.tensor로 만드는 이유는?
      let yt = tf.tensor(this.son_height);

      // 모델의 모양을 만들기
      let X = tf.input({ shape: [1] }); // 값 하나 들어옴
      let Y1 = tf.layers.dense({ units: 10, activation: "relu" }).apply(X); // apply를 통해 연결
      let Y2 = tf.layers.dense({ units: 10, activation: "relu" }).apply(Y1);
      let Z = tf.layers.dense({ units: 1 }).apply(Y2);
      let model = tf.model({ inputs: X, outputs: Z }); // 인아웃풋 저장
      let compileParam = {
        optimizer: tf.train.adam(), // train ??
        loss: tf.losses.meanSquaredError,
      }; // 최적화의 loss 측정방법종류
      model.compile(compileParam); // 컴파일
      const fitParm = {
        epochs: 3000,
        callbacks: {
          onEpochEnd: function (epoch, logs) {
            console.log("epoch", epoch, logs, "RMSE=>", Math.sqrt(logs.loss));
            // RMSE는 뭐임? sprt는 뭐임?
          },
        },
      };
      // const my = tf.tensor([32]);
      model.fit(xt, yt, fitParm).then((_) => {
        // model.fit(xt, yt, fitParm) => 데이터와 모델을 통해 모델링을 한다. => 그리고 거기서 나온 식으로
        let result = model.predict(xt);
        // model.predict(my) => 특정 값의 예상값을 뽑아낼 수 있다.
        result.print();
        // model.save("downloads://my-model"); // 모델을 저장
        model.save("localstorage://my-model-1");
        console.log("모델 저장됨");
      });
    },
  },
};
</script>

<style></style>
