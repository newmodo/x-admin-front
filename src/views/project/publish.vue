<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-col :span="24">
          <div class="postInfo-container">
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="项目名称:" prop="project_name">
                  <el-input v-model="postForm.project_name" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label-width="120px" label="旧版本:" prop="from">
                  <el-select v-model="postForm.from" @change="createCompare">
                    <el-option
                      v-for="(item) in tags"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="120px" label="新版本:" prop="to">
                  <el-select v-model="postForm.to" @change="createCompare">
                    <el-option
                      v-for="(item) in tags"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="差异对比:" prop="project_name">
                  <textarea :id="tinymceId" v-model="postForm.des" class="tinymce-textarea" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" @click="submitForm">{{ buttonName }}</el-button>
          </div>
        </el-col>
      </div>
    </el-form>
  </div>
</template>
<script>
import { fetchVersion } from '@/api/project'
import { publishVersion } from '@/api/project'

import load from '../../components/Tinymce/dynamicLoadScript'

const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
const defaultForm = {
  project_id: '',
  project_name: '',
  version_name: '',
  from: '',
  to: '',
  des: ''
}

export default {
  name: 'Publish',
  // eslint-disable-next-line vue/no-unused-components
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      git: '',
      tags: [],
      roles: [],
      rules: {},
      tempRoute: {},
      tinymceId: this.id,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.buttonName = '发布'
      this.fetchData(id)
    } else {
      this.buttonName = '创建'
      this.postForm = Object.assign({}, defaultForm)
    }
    this.tempRoute = Object.assign({}, this.$route)
    this.init()
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        menubar: false,
        statusbar: false,
        toolbar: false,
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }
      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    },
    fetchData(id) {
      fetchVersion(id)
        .then(response => {
          console.log(response.data)
          this.postForm.project_name = response.data.project.project_name
          this.postForm.project_id = response.data.project.id
          this.git = response.data.project.git
          this.tags = response.data.tags
          this.setPageTitle()
        })
        .catch(err => {
          console.log(err)
        })
    },

    createCompare() {
      if (this.postForm.from && this.postForm.to) {
        this.postForm.version_name = this.postForm.from + '-' + this.postForm.to
        this.setContent('<a href=\'' + this.git.slice(0, -4) + '/compare/' + this.postForm.from + '...' + this.postForm.to + '\'>差异比较</a>')
      }
    },
    setPageTitle() {
      if (this.isEdit) {
        const title = '编辑'
        document.title = `${title} - ${this.postForm.username}`
      } else {
        const title = '创建管理员'
        document.title = `${title}`
      }
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          publishVersion(this.postForm).then(() => {
            this.$notify({
              title: 'Success',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
