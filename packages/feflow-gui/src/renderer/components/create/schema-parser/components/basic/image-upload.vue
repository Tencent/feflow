<template>
  <div class="image-upload">
    <picture-input
      ref="upload"
      @change="onChange"
      :width="config.width"
      :height="config.height"
      :margin="config.margin"
      :crop="config.crop"
      :radius="config.radius"
      :plain="config.plain"
      :accept="config.accept"
      :size="config.size"
      :removable="config.removable"
      :hideChangeButton="config.hideChangeButton"
      :buttonClass="config.buttonClass"
      :removeButtonClass="config.removeButtonClass"
      :zIndex="config.zIndex"
      :prefill="initializeValue"
      :alertOnError="config.alertOnError"
      :customStrings="config.customStrings"
    ></picture-input>
    <span class="value">{{ value }}</span>
  </div>
</template>

<script>
import PictureInput from 'vue-picture-input'
import extend from 'extend'
import { mapActions } from 'vuex'
import basicMixin from '../mixins/basic.js'

const defaults = {
  width: 200,
  height: 200,
  crop: false,
  margin: 0,
  radius: 0,
  plain: false,
  accept: 'image/*',
  size: 5,
  removable: false,
  hideChangeButton: true,
  buttonClass: 'btn btn-primary',
  removeButtonClass: 'btn btn-secondary',
  zIndex: 1000,
  alertOnError: true,
  customStrings: {
    upload: '<p>当前浏览器不支持图片上传功能.</p>',
    drag: '拖拽图片 或者 <br>点击选择文件',
    tap: 'Tap here to select a photo <br>from your gallery',
    change: '更改',
    remove: '删除',
    select: '选择',
    selected: '<p>选择成功</p>',
    fileSize: '文件大小超过限制',
    fileType: '不支持的文件类型',
    aspect: 'Landscape/Portrait'
  }
}

export default {
  data() {
    return {
      initializeValue: ''
    }
  },
  computed: {
    config() {
      return extend(true, {}, defaults, this.definition.config)
    }
  },
  created() {
    this.$watch(
      'value',
      newValue => {
        this.initializeValue = newValue
      },
      {
        immediate: true
      }
    )
  },
  methods: {
    onChange(image) {
      const { config } = this

      if (image) {
        if (config.action) {
          config
            .action(image, config.directory)
            .then(uri => {
              if (uri) {
                this.value = uri
              }
            })
            .catch(err => {
              console.error(err)
            })
        } else {
          this.uploadImage(image, config.directory)
            .then(uri => {
              if (uri) {
                this.value = uri
              }
            })
            .catch(err => {
              console.error(err)
            })
        }
      }
    },
    ...mapActions(['uploadImage'])
  },
  mixins: [basicMixin],
  components: {
    PictureInput
  }
}
</script>
