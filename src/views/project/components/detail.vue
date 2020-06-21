<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-col :span="24">
          <div class="postInfo-container">
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="项目名称:" prop="project_name">
                  <el-input v-model="postForm.project_name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="环境:" prop="env">
                  <el-select v-model="postForm.env">
                    <el-option
                      v-for="(item) in envMap"
                      :key="item.key"
                      :label="item.text"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="所属组织:" prop="o_id">
                  <el-input v-model="postForm.o_id" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="上传路径:" prop="path">
                  <el-input v-model="postForm.path" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="代码仓库:" prop="git">
                  <el-input v-model="postForm.git" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="代码分支" prop="git_branch">
                  <el-select v-model="postForm.git_branch">
                    <el-option
                      v-for="(item) in cateMap"
                      :key="item.key"
                      :label="item.text"
                      :value="item.key"
                    />
                  </el-select>
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
import { fetchItem } from '@/api/project'
import { updateItem } from '@/api/project'
import { addItem } from '@/api/project'

const defaultForm = {
  imgs: '',
  env: {
    type: Number,
    default: 1
  },
  o_id: 1,
  password: ''
}

export default {
  name: 'Detail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      cateMap: [{ key: 'master', text: 'master' }],
      envMap: [{ key: 1, text: 'test' }, { key: 2, text: 'pre' }, { key: 3, text: 'product' }],
      roles: [],
      rules: {},
      tempRoute: {}
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.buttonName = '编辑'
      this.fetchData(id)
    } else {
      this.buttonName = '创建'
      this.postForm = Object.assign({}, defaultForm)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchItem(id)
        .then(response => {
          this.postForm = response.data
          this.setPageTitle()
          this.initImgs()
        })
        .catch(err => {
          console.log(err)
        })
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
          if (this.isEdit) {
            updateItem(this.postForm).then(() => {
              this.$notify({
                title: 'Success',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            addItem(this.postForm).then(() => {
              this.$notify({
                title: 'Success',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
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

