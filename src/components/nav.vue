<template>
  <div>
    <div class="nav">
      <div class="nav_area area">
        <div class="nav_logo">
          <router-link to="/index">
            <img src="../assets/img/logo/logo_icon.png" alt />
          </router-link>
        </div>
        <div class="nav_item">
          <ul>
            <router-link to="/index" tag="li" active-class="active">首页</router-link>
            <router-link to="/classify" tag="li" active-class="active">分类</router-link>
          </ul>
        </div>
        <div class="nav_serch">
          <el-autocomplete
            class="inline-input search_input"
            v-model="search"
            prefix-icon="el-icon-search"
            :fetch-suggestions="querySearch"
            :placeholder="placeholder"
            @select="handleSelect"
            @keyup.enter.native="handleSearch()"
            @input="handleInput($event)"
          ></el-autocomplete>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { reactive, toRefs, onMounted } from "@vue/composition-api";
export default {
  setup() {
    const _this = Vue.prototype;
    const stats = reactive({
      search: "",
      placeholder: "",
      getSearchData: [],
      restaurants: [],
      newRestaurants: [],
      title: "",
      search:""
    });
    // 获取分类
    const getSearchList = async () => {
      await _this.$http
        .post(
          "/get/associate",
          {},
          {
            title: stats.search
          }
        )
        .then(res => {
          stats.getSearchData = res.data.data.titles;
          stats.newRestaurants = [];
          stats.restaurants = res.data.data.titles;
          stats.restaurants.forEach(element => {
            stats.newRestaurants.push({ value: element });
          });
        })
        .catch(error => {
          console.log(error);
        });
    };

    const querySearch = (queryString, cb) => {
      var restaurants = stats.newRestaurants;
      var results = queryString
        ? restaurants.filter(createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      // clearTimeout(this.timeout);
      // this.timeout = setTimeout(() => {
      //   cb(results);
      // }, 3000 * Math.random());
      cb(results);
    };
    const createFilter = queryString => {
      return search => {
        return (
          search.value.toLowerCase().indexOf(queryString.toLowerCase()) != -1
        );
      };
    };
    const handleSelect = item => {
      stats.search = item.value;
      // this.$router.push({ path: "/search", query: { title: this.search } });
    };
    const handleSearch = () => {
      // this.$router.push({ path: "/search", query: { title: this.search } });
      // localStorage.setItem("search_name", this.search);
    };
    const handleInput = async title => {
      stats.search = title;
      await getSearchList();
    };
    onMounted(() => {
      getSearchList();
    });
    return {
      ...toRefs(stats),
      querySearch,
      handleSelect,
      handleSearch,
      handleInput
    };
  }
};
</script>

<style lang="less" scoped>
.nav {
  height: 72px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 18px 1px rgba(0, 0, 0, 0.03);
  .nav_area {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: center;
    .nav_logo {
      flex: 1;
    }
    .nav_item {
      ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 60px;
        li {
          padding-right: 40px;
          cursor: pointer;
        }
      }
    }
    .nav_serch {
      /deep/.el-input {
        width: 455px;
        height: 36px;
        .el-input__inner {
          border-radius: 17px;
          background: rgba(246, 247, 249, 1);
          height: 36px;
        }
      }
    }
  }
  .active {
    color: #4bcacc !important;
  }
  .active::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background-color: #4bcacc;
  }
}
</style>