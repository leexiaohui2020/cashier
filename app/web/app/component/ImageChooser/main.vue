<template>
  <div v-loading="choosingImg">
    <div>
      <Button @click="chooseImage">选择本地图片</Button>
    </div>
    <div class="flex margin-top">
      <div :style="`width: ${width}; height: ${height}; margin-right: 15px`">
        <VueCropper
          ref="cropper"
          :img="image"
          :info="false"
          :auto-crop="true"
          :auto-crop-width="cropWidth"
          :auto-crop-height="cropHeight"
          :centerBox="true"
          :fixed="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  name: 'ImageChooser',
  components: { VueCropper },
  props: {
    src: String,
    width: {
      type: String,
      default: '120px'
    },
    height: {
      type: String,
      default: '120px'
    },
    cropWidth: {
      type: Number,
      default: 80
    },
    cropHeight: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      image: this.src || '',
      choosingImg: false
    }
  },
  methods: {
    chooseImage() {
      const node = document.createElement('input');
      node.setAttribute('type', 'file');
      node.setAttribute('accept', 'image/png,image/jpeg');
      node.addEventListener('change', () => {
        const file = node.files[0];
        const reader = new FileReader();
        this.choosingImg = true
        reader.addEventListener('load', () => {
          const result = reader.result;
          this.choosingImg = false
          this.image = result
        });
        reader.readAsDataURL(file);
      });
      node.click();
    },

    getCropData() {
      return new Promise(resolve => {
        this.image ? this.$refs.cropper.getCropData(resolve) : resolve(null)
      })
    }
  }
}
</script>
