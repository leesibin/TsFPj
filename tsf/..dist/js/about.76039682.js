"use strict";(self["webpackChunktsf"]=self["webpackChunktsf"]||[]).push([[443],{5453:function(e,t,i){i.r(t),i.d(t,{default:function(){return _}});var n=i(3396),l=i(7139);const a={action:""},s={class:"container"},o={class:"file-upload-list"},r={class:"file-upload-list__item__data"},d=["id","src"],c=["id"],u=["onClick"],h=["onClick"];function f(e,t,i,f,g,p){return(0,n.wg)(),(0,n.iD)("form",a,[(0,n._)("div",s,[(0,n._)("div",{class:"file-upload-container",onDragenter:t[0]||(t[0]=(...e)=>p.onDragenter&&p.onDragenter(...e)),onDragover:t[1]||(t[1]=(...e)=>p.onDragover&&p.onDragover(...e)),onDragleave:t[2]||(t[2]=(...e)=>p.onDragleave&&p.onDragleave(...e)),onDrop:t[3]||(t[3]=(...e)=>p.onDrop&&p.onDrop(...e)),onClick:t[4]||(t[4]=(...e)=>p.onClick&&p.onClick(...e))},[(0,n._)("div",{class:(0,l.C_)(["file-upload",e.isDragged?"dragged":""])}," 사진이나 이미지 파일을 드래그 & 드랍 ",2)],32),(0,n._)("input",{type:"file",ref:"fileInput",class:"file-upload-input",onChange:t[5]||(t[5]=(...e)=>p.onFileChange&&p.onFileChange(...e)),multiple:""},null,544),(0,n._)("div",o,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(g.fileList,((e,t)=>((0,n.wg)(),(0,n.iD)("div",{class:"file-upload-list__item",key:t},[(0,n._)("div",r,[(0,n._)("img",{class:"file-upload-list__item__data-thumbnail",id:e.name,src:e.src},null,8,d),(0,n._)("div",{class:"file-upload-list__item__data-name",id:0+e.name},null,8,c)]),(0,n._)("div",{class:"file-upload-list__item__btn-remove",onClick:t=>p.mobileNet(e.name)}," 분석 ",8,u),(0,n._)("div",{class:"file-upload-list__item__btn-remove",onClick:e=>p.handleRemove(t)}," 삭제 ",8,h)])))),128))])])])}i(7658);var g={name:"app",created(){this.$socket.on("translate",(e=>{const t=e.split("/"),i=document.getElementById(0+t[0]);i.innerHTML=t[1]}))},data(){return{fileList:[],PredictionsList:[]}},methods:{onClick(){this.$refs.fileInput.click()},onDragenter(){this.isDragged=!0},onDragleave(){this.isDragged=!1},onDragover(e){e.preventDefault()},onDrop(e){e.preventDefault(),this.isDragged=!1;const t=e.dataTransfer.files;this.addFiles(t)},onFileChange(e){const t=e.target.files;this.addFiles(t)},async addFiles(e){for(let t=0;t<e.length;t++){const i=await this.readFiles(e[t]);e[t].src=i,console.log(e[t]),this.fileList.push(e[t]),this.$socket.emit("src",e[t].src)}},async readFiles(e){return new Promise((t=>{const i=new FileReader;i.onload=async e=>{t(e.target.result)},i.readAsDataURL(e)}))},handleRemove(e){this.fileList.splice(e,1)},mobileNet(e){const t=document.getElementById(e);mobilenet.load().then((i=>{i.classify(t).then((t=>{this.$socket.emit("translate",e+"/"+t[0].className+":"+(100*t[0].probability).toFixed(2)+"%<br>"+t[1].className+":"+(100*t[1].probability).toFixed(2)+"%<br>"+t[2].className+":"+(100*t[2].probability).toFixed(2)+"%")}))}))}}},p=i(89);const m=(0,p.Z)(g,[["render",f]]);var _=m},7322:function(e,t,i){i.r(t),i.d(t,{default:function(){return c}});var n=i(3396);const l=(0,n._)("div",null,"아버지와 아들의 키를 담은 엑셀파일을 넣어주세요.",-1),a=(0,n._)("br",null,null,-1);function s(e,t,i,s,o,r){return(0,n.wg)(),(0,n.iD)(n.HY,null,[l,a,(0,n._)("div",null,[(0,n._)("input",{type:"file",onChange:t[0]||(t[0]=(...e)=>r.readExcel&&r.readExcel(...e))},null,32),(0,n._)("button",{id:"modeling-button",onClick:t[1]||(t[1]=e=>r.modeling())}," 분석시작 ")])],64)}i(7658);var o={name:"app",data(){return{father_height:[],son_height:[]}},methods:{async readExcel(e){console.log(e);let t=e.target,i=new FileReader,n=[],l=[];i.onload=function(e){let t=i.result,a=XLSX.read(t,{type:"binary"});const s=a.Sheets.train;for(let i=2;i<757;i++)n.push(s["A"+i].v),l.push(s["B"+i].v)},i.readAsBinaryString(t.files[0]),this.father_height=n,this.son_height=l},modeling(e){console.log(this.father_height);let t=tf.tensor(this.father_height),i=tf.tensor(this.son_height),n=tf.input({shape:[1]}),l=tf.layers.dense({units:10,activation:"relu"}).apply(n),a=tf.layers.dense({units:10,activation:"relu"}).apply(l),s=tf.layers.dense({units:1}).apply(a),o=tf.model({inputs:n,outputs:s});tfvis.show.modelSummary({name:"Model Summary"},o);let r={optimizer:tf.train.adam(),loss:tf.losses.meanSquaredError};o.compile(r);const d={epochs:200,callbacks:tfvis.show.fitCallbacks({name:"Training Performance"},["loss","mse"],{height:200,callbacks:["onEpochEnd"]})};o.fit(t,i,d).then((e=>{let i=o.predict(t);i.print(),o.save("localstorage://my-model-1"),console.log("모델 저장됨")}))}}},r=i(89);const d=(0,r.Z)(o,[["render",s]]);var c=d}}]);
//# sourceMappingURL=about.76039682.js.map