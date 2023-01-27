<template>
  <div>내페이지가 맞습니까?</div>
  <img id="user_image" src="#" alt="" />
  <input
    accept=".png"
    type="file"
    id="user_profile_img"
    on-change="PreviewImage()"
  />
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
  methods: {
    PreviewImage() {
      var preview = new FileReader();
      preview.onload = function (e) {
        // img id 값
        document.getElementById("user_image").src = e.target.result;
      };
      // input id 값
      preview.readAsDataURL(
        document.getElementById("user_profile_img").files[0]
      );
    },
  },
};
</script>

<style></style>
