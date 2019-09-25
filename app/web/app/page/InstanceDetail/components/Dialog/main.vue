<template>
  <div v-loading="loading">
    <Form :label-width="60">
      <FormItem label="账号">
        <i-input v-model="number" />
        <Alert class="margin-top-xs" type="warning">付款者可以通过搜索账号向你付款，选填</Alert>
      </FormItem>
      <FormItem label="二维码">
        <ImageChooser ref="imgChooser" :src="form && form.qrcode" width="300px" height="200px" :crop-width="200" :crop-height="200" />
      </FormItem>
      <Button type="primary" long @click="onSubmit">保存设置</Button>
    </Form>
  </div>
</template>

<script>
import ImageChooser from 'app/component/ImageChooser/main'
export default {
  name: 'Dialog',
  components: { ImageChooser },
  props: {
    prefix: String,
    form: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      number: this.form ? this.form.number : '',
    }
  },
  methods: {

    async onSubmit() {
      const number = this.number
      const qrcode = await this.$refs.imgChooser.getCropData()
      if (!qrcode) {
        return this.$Message.error('请上传收款二维码')
      }
      const data = { qrcode }
      if (number) {
        data.number = number
      }
      this.$emit('on-submit', data)
    }
  }
}
</script>