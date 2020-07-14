<template>
  <v-editor
    v-model="value"
    :disabled="definition.disabled"
    :init="config.init"
  />
</template>

<script>
import vEditor from '@tinymce/tinymce-vue';
import extend from 'extend';
import basicMixin from '../mixins/basic.js';
import store from '../../vuex/store';

const plugins = [
  'lists',
  'advlist',
  'image',
  'table',
  'textcolor',
  'colorpicker',
  'codesample',
  'contextmenu',
  'link',
  'fullscreen',
  'help',
  'preview',
  'searchreplace',
  'hr',
  'wordcount',
  'autosave',
  // 'powerpaste'
];
const toolbars = [
  'undo redo | styleselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | table hr link image | searchreplace | fullscreen preview help',
];

const defaults = {
  init: {
    height: 500,
    contextmenu: 'link image inserttable | cell row column deletetable',
    default_link_target: '_blank',
    external_plugins: {
      powerpaste: '/style/cms/powerpaste/plugin.js',
    },
    powerpaste_allow_local_images: true,
    powerpaste_word_import: 'prompt',
    powerpaste_html_import: 'prompt',
    image_advtab: true,
    images_upload_handler: function (blobInfo, success, failure) {
      const image = `data:image/${blobInfo.filename().split('.')[1]};base64,${blobInfo.base64()}`;

      store
        .dispatch('uploadImage', image)
        .then((uri) => {
          success(uri);
        })
        .catch((err) => {
          console.error(err);
          failure(err.message || '');
        });
    },
  },
};

export default {
  components: {
    vEditor,
  },
  mixins: [basicMixin],
  computed: {
    config() {
      const config = this.definition.config || {};
      let plugin = plugins.slice();
      const toolbar = toolbars.slice();

      if (config.plugins) {
        plugin = plugin.concat(config.plugins.split(' '));
        // eslint-disable-next-line
        plugin = _.uniq(plugin);
        delete config.plugins;
      }

      if (config.toolbar) {
        toolbar.push(config.toolbar);
        delete config.toolbar;
      }

      return extend(true, {}, defaults, config, {
        init: {
          plugins: plugin.join(' '),
          toolbar: toolbar,
        },
      });
    },
  },
};
</script>

