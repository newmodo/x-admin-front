<template>
  <div class="menu">
    <el-row>
      <template>
        <el-select ref="selection" v-model="table_id" filterable placeholder="请选择" style="margin-bottom: 10px;">
          <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.text"
            :value="item.key"
          />
        </el-select>
      </template>
    </el-row>
    <el-row>
      <el-col v-for="(item,key,index) in list" :key="index" :span="span">
        <el-card :body-style="{ padding: '10px' }">
          <img :src="item.imgs" class="image">
          <div style="padding: 14px;">
            <span>{{ item.name }}</span>
            <div class="bottom clearfix">
              <time class="time">{{ item.price }}$</time>
              <el-button type="text" class="button" @click="addToCart(item)">+</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .menu {
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
    font-size: large;
  }

  .image {
    width: 100%;
    height: 350px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
</style>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    if (this.device === 'mobile') {
      var span = 24
    } else {
      var span = 6
    }
    return {
      currentDate: new Date(),
      span: span,
      list: null,
      listQuery: {
        page: 1,
        limit: 20
      },
      options: {},
      table_id: ''
    }
  },
  computed: {
    ...mapGetters({
      totalNum: 'cart/totalNum'
    })
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
        this.options = response.data.tables
      })
    },
    // 加入购物车
    addToCart(product) {
      if (!this.table_id) {
        const h = this.$createElement
        this.$message({
          message: h('p', null, [
            h('span', null, '请选择餐桌 '),
            h('i', { style: 'color: teal' })
          ]),
          type: 'warning'
        })
        return
      }
      product.table_id = this.table_id
      product.table_name = this.$refs.selection.selectedLabel
      this.$store.dispatch('cart/addToCart', product)
    }
  }
}
</script>
