<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-col :span="24">
          <div class="postInfo-container">
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="中文名:" prop="name">
                  <el-input v-model="postForm.name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="外文名:" prop="name_it">
                  <el-input v-model="postForm.name_it" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="价格:" prop="price">
                  <el-input v-model="postForm.price" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="折扣:" prop="discount">
                  <el-input v-model="postForm.discount" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="菜品分类" prop="category">
                  <el-select v-model="postForm.category">
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
            <el-row>
              <el-col :span="12">
                <el-form-item label-width="120px" label="状态" prop="status">
                  <el-select v-model="postForm.status">
                    <el-option
                      v-for="(item) in statusMap"
                      :key="item.key"
                      :label="item.text"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label-width="120px" label="图片">
                  <dropzone
                    id="myVueDropzone"
                    ref="dropzone"
                    url="http://192.168.112.20:9501/common/upload"
                    @dropzone-removedFile="dropzoneR"
                    @dropzone-success="dropzoneS"
                  />
                  <input id="imgs" v-model="postForm.imgs" type="hidden" pro="imgs">
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" @click="submitForm">{{ this.buttonName }}</el-button>
          </div>
        </el-col>
      </div>
    </el-form>
  </div>

</template>

<script>
import Dropzone from '@/components/Dropzone'
// import { fetchItem } from "@/api/dish";
// import { updateItem } from "@/api/dish";
// import { addItem } from "@/api/dish";

const defaultForm = {
  imgs: '',
  password: ''
}

export default {
  name: 'Detail',
  components: {
    Dropzone
  },
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
      cateMap: this.$store.getters.system.dish.cate_map,
      statusMap: this.$store.getters.system.dish.status_map,
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
    insertImg(url) {
      var imgs = this.postForm.imgs
      var list = []
      list = imgs.split(',')
      list.push(url)
      this.postForm.imgs = list.join(',').trim(',')
    },
    deleteImg(url) {
      var imgs = this.postForm.imgs
      var list = []
      list = imgs.split(',')
      list.splice(array.findIndex(item => item === url), 1)
      this.postForm.imgs = list.join(',').trim(',')
    },
    initImgs() {
      var list = this.postForm.imgs.split(',')
      console.log(this.$refs.dropzone)
      this.$refs.dropzone.initImages(list)
    },
    dropzoneS(file, x, xhr) {
      console.log(xhr)
      this.insertImg(xhr.data.url)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file, x, xhr) {
      this.deleteImg(xhr.data.url)
      this.$message({ message: 'Delete success', type: 'success' })
    },
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

