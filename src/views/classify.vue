<template>
  <div class="classify">
    <Nav></Nav>
    <!-- 条件筛选 -->
    <div class="choose area">
      <div class="choose_type">
        <div class="choose_name">频道</div>
        <div class="choose_subName">
          <ul>
            <li
              v-for="(item,index) in channelList"
              :key="index"
              @click="hadleChangeChannel(index,item.id)"
              :class="{li_active:index==channelCurrent}"
            >{{item.tag}}</li>
          </ul>
        </div>
      </div>
      <div class="choose_type">
        <div class="choose_name">分类</div>
        <div class="choose_subName">
          <ul>
            <li
              v-for="(item,index) in categoryList"
              :key="index"
              @click="hadleChangeCategory(index,item,$event)"
            >{{item.cate_name}}</li>
          </ul>
        </div>
      </div>
      <div class="choose_type">
        <div class="choose_name">年份</div>
        <div class="choose_subName">
          <ul>
            <li
              v-for="(item,index) in yearList"
              :key="index"
              @click="hadleChangeYear(index,item)"
              :class="{li_active:index==yearCurrent}"
            >{{item}}</li>
          </ul>
        </div>
      </div>
      <div class="choose_type">
        <div class="choose_name">进度</div>
        <div class="choose_subName">
          <ul>
            <li
              v-for="(item,index) in planList"
              :key="index"
              @click="hadleChangePlan(index,item.id)"
              :class="{li_active:index==planCurrent}"
            >{{item.tag}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="classify_content area" v-if="ArticleList.length!=0">
      <div class="classify_box">
        <ul>
          <li v-for="(item,index) in  ArticleList" :key="index">
            <div class="img_box">
              <goDetail :sid="item.id">
                <el-image :key="item.cover_link" :src="item.cover_link" lazy>
                  <div slot="error" class="image-slot">暂无封面图</div>
                </el-image>
              </goDetail>
            </div>
            <div class="novel_msg">
              <h4 class="nover_title">{{item.book_name}}</h4>
              <div class="novel_middle">
                <div class="novel_info">
                  <h4>{{item.author_name}}</h4>
                  <!-- <h4>字数：{{item.words}}字</h4> -->
                </div>
                <div class="novel_btn">
                  <goRead :bookId="item.id" :sid="1">
                    <button>阅读</button>
                  </goRead>
                </div>
              </div>
              <p>{{item.description}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="classify_content area" v-if="ArticleList.length==0">
      <p class="noData">暂无数据</p>
    </div>
    <!-- 分页 -->
    <div class="search_block">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        prev-text="上一页"
        next-text="下一页"
        @current-change="handleCurrentChange"
        :page-size="15"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import goDetail from "../components/goDetail";
import Nav from "../components/nav";
import Foot from "../components/foot.vue";
import { reactive, toRefs, onMounted } from "@vue/composition-api";
import goRead from "../components/goRead";
export default {
  components: {
    Foot,
    Nav,
    goDetail,
    goRead
  },
  setup(props, context) {
    const _this = context.root;
    // 获取分类的类型
    const state = reactive({
      params: {
        category: [],
        girl: -1,
        is_end: -1,
        year: 0,
        limit: 15,
        page: 1
      },
      yearList: ["全部", "2020"],
      // 分类
      categoryList: [],
      // 状态
      planList: [
        { tag: "全部", id: -1 },
        { tag: "已完结", id: 1 },
        { tag: "连载中", id: 0 }
      ],
      // 频道
      channelList: [
        { tag: "全部", id: -1 },
        { tag: "男生", id: 0 },
        { tag: "女生", id: 1 }
      ],
      channelCurrent: "",
      categorCurrent: "",
      yearCurrent: "",
      planCurrent: "",
      ArticleList: [],
      total: 100
    });

    // 获取分类
    const category = async () => {
      await _this.$http
        .post("/get/category", {}, {})
        .then(res => {
          let { code, data } = res.data;
          state.categoryList = data;
        })
        .catch(error => {
          console.log(error);
        });
    };
    const hadleChangeChannel = async (index, id) => {
      state.channelCurrent = index;
      state.params.girl = id;
      await ArticleData();
    };
    // 差这个条件
    const hadleChangeCategory = async (index, id, e) => {
      let isHave = false;
      state.params.category.forEach((element, i) => {
        if (name == element) {
          isHave = true;
          e.target.style.backgroundColor = "#fff";
          e.target.style.color = "#9e9e9e";
          e.target.style.borderRadius = "0px";
          state.params.category.splice(i, 1);
          return;
        }
      });
      if (!isHave) {
        e.target.style.backgroundColor = "#9e9e9e";
        e.target.style.color = "#fff";
        e.target.style.borderRadius = "11px";
        state.params.category.push(name);
      }
      await ArticleData();
    };
    const hadleChangeYear = async (index, name) => {
      state.yearCurrent = index;
      state.params.year = name;
      if (name == "全部") {
        state.params.year = 0;
        await ArticleData();
      }
    };
    const hadleChangePlan = async (index, id) => {
      state.planCurrent = index;
      state.params.is_end = id;
      await ArticleData();
    };
    //获取查询数据
    const ArticleData = async () => {
      await _this.$http
        .post(
          "/search/condition",
          {},
          {
            ...state.params
          }
        )
        .then(res => {
          let { code, data } = res.data;
          state.ArticleList = data.results;
          state.total = data.count;
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 分页查询
    const handleCurrentChange = async val => {
      state.params.page = val;
      await ArticleData();
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    onMounted(async () => {
      await category();
      await ArticleData();
    });
    return {
      ...toRefs(state),
      hadleChangeChannel,
      hadleChangeCategory,
      hadleChangeYear,
      hadleChangePlan,
      handleCurrentChange
    };
  }
};
</script>

<style lang="less" scoped>
.classify {
  .choose {
    background-color: #fff;
    margin-top: 40px;
    margin-bottom: 20px;
    min-height: 280px;
    .choose_type {
      padding: 24px 40px 0px 0px;
      display: flex;
      // border-bottom: 1px solid #F0F0F0;
      .choose_name {
        display: flex;
        justify-content: center;
        padding: 0px 40px 24px 40px;
        font-size: 14px;
        color: #9e9e9e;
      }
      .choose_subName {
        flex: 1;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
        ul {
          width: 100%;
          display: flex;
          flex-wrap: wrap;

          li {
            margin-right: 20px;
            margin-bottom: 10px;
            font-size: 14px;
            color: #9e9e9e;
            cursor: pointer;
            padding: 0px 10px;
          }
        }
      }
    }
  }
  .classify_content {
    min-height: 800px;
    background-color: #fff;
    position: relative;
    .noData {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
    }
    .classify_box {
      display: flex;
      padding: 30px 80px 18px 66px;
      ul {
        display: flex;
        flex-wrap: wrap;
        width: 100%;

        li {
          width: 31.33%;
          display: flex;
          margin-right: 20px;
          // align-content: center;
          // justify-content: center;
          margin-bottom: 45px;
          .img_box {
            margin-right: 15px;
            .el-image {
              width: 107px;
            }
          }
          .novel_msg {
            h4 {
              font-size: 14px;
              font-weight: 400;
              color: rgba(0, 0, 0, 1);
            }
            .nover_title {
              border-bottom: 1px solid #e5e5e5;
              margin-bottom: 0px;
              padding-bottom: 10px;
            }
            p {
              margin-top: 23px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(158, 158, 158, 1);
              line-height: 17px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
            }
            .novel_middle {
              display: flex;
              .novel_info {
                flex: 1;
              }
              .novel_btn {
                display: flex;
                height: 22px;
                margin-top: 10px;
                button {
                  height: 22px;
                  background: rgba(75, 202, 204, 1);
                  border-radius: 5px;
                  outline: none;
                  border: none;
                  font-size: 12px;
                  font-weight: 400;
                  color: rgba(255, 255, 255, 1);
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }
  .search_block {
    height: 196px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .li_active {
    background: #9e9e9e;
    border-radius: 11px;
    color: #fff !important;
    // padding: 5px 10px;
    box-sizing: border-box;
  }
}
</style>