<template>
  <div class="search">
    <Nav></Nav>
    <!-- 有结果的 -->
    <div class="search_result area" v-if="searchList.length!=0">
      <div class="search_box">
        <div class="search_left">
          <div class="search_left_title">
            共搜索到{{total}}部与
            <span>“{{title}}”</span>
            相关结果
          </div>
          <div class="search_left_content">
            <div class="search_left_box" v-for="(item,index) in searchList" :key="index">
              <div>
                <goDetail :sid="item.id">
                  <el-image :key="item.cover_link" :src="item.cover_link" lazy>
                    <div slot="error" class="image-slot">暂无封面图</div>
                  </el-image>
                </goDetail>
              </div>
              <div>
                <h2>{{item.book_name}}</h2>
                <p>{{item.author_name}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{{item.cate_name}}</p>
                <p class="referral">{{item.description}}</p>
              </div>
              <div class="search_left_btn">
                <goDetail :sid="item.id">
                  <button class="novel_detail">书籍详情</button>
                </goDetail>
                <goRead :bookId="item.id" :sid="1">
                  <button class="novel_read">立即阅读</button>
                </goRead>
              </div>
            </div>
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
              :page-size="20"
            ></el-pagination>
          </div>
          <!-- <div class="search_block">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="1000"
              prev-text="上一页"
              next-text="下一页"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>-->
        </div>
        <!-- <div class="search_right">
          <div class="search_right_title">搜索热门</div>
          <div class="search_right_content">
            <div class="search_right_box" v-for="(item,index) in hot_list" :key="index">
              <goDetail :sid="item.id">
                <el-image :key="item.cover" :src="item.cover" lazy>
                  <div slot="error" class="image-slot">暂无封面图</div>
                </el-image>
              </goDetail>
              <div>
                <h2>{{item.name}}</h2>
                <p>作者:{{item.author}}</p>
                <p>字数：{{item.words}}字</p>
              </div>
            </div>
          </div>
        </div>-->
      </div>
    </div>
    <!-- 无结果 -->
    <div class="search_result area" v-if="searchList.length==0">
      <div class="search_box">
        <div class="search_left">
          <div class="search_left_title">
            没有找到符合
            <span>“{{this.title}}”</span>
            相关条件的作品
          </div>
          <div class="search_left_content">
            <div class="hot_search">大家都在搜</div>
            <div class="hot_choose">
              <ul>
                <li v-for="(item,index) in hotbook" :key="index" @click="hotSearch(item)">{{item}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="search_right">
          <div class="search_right_title">搜索热门</div>
          <div class="search_right_content">
            <div class="search_right_box" v-for="(item,index) in hot_list" :key="index">
              <goDetail :sid="item.id">
                <el-image :key="item.cover" :src="item.cover" lazy>
                  <div slot="error" class="image-slot">暂无封面图</div>
                </el-image>
              </goDetail>
              <div>
                <h2>{{item.name}}</h2>
                <p>作者:{{item.author}}</p>
                <p>字数：{{item.words}}字</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Foot></Foot>
  </div>
</template>

<script>
import Nav from "../components/nav.vue";
import Foot from "../components/foot.vue";
import goDetail from "../components/goDetail.vue";
import goRead from "../components/goRead.vue";
import {
  reactive,
  toRefs,
  onMounted,
  provide,
  watch
} from "@vue/composition-api";
export default {
  components: {
    Nav,
    Foot,
    goDetail,
    goRead
  },
  setup(props, context) {
    const _this = context.root;
    const stats = reactive({
      title: context.root.$route.query.title,
      url: require("../assets/img/index/Focus_4.png"),
      // hasList: [0],
      total: 100,
      searchList: [],
      hotbook: [],
      netUrl: "/search/name",
      hot_list: "",
      page: 1
    });

    const getSearchList = async () => {
      await _this.$http
        .post(
          "/search",
          {},
          {
            title: stats.title,
            limit: 20,
            page: stats.page
          }
        )
        .then(res => {
          let { code, data } = res.data;
          stats.searchList = data.results;
          stats.total = data.count;
        })
        .catch(error => {
          console.log(error);
        });
    };
    const handleCurrentChange = async val => {
      stats.page = val;
      await getSearchList();
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    onMounted(() => {
      getSearchList();
    });
    watch(
      () => context.root.$route,
      () => {
        context.root.$router.go(0);
      }
    );
    return {
      ...toRefs(stats),
      handleCurrentChange
    };
  }
};
</script>

<style lang="less" scoped>
.search {
  .search_result {
    .search_box {
      display: flex;
      justify-content: space-between;
      .search_left {
        font-size: 18px;
        width: 77%;
        .search_left_title {
          display: flex;
          height: 73px;
          align-items: center;
          justify-content: flex-start;
          border-bottom: solid 2px #4fcbcd;
          span {
            color: #4fcbcd;
          }
        }
        .search_left_content {
          .search_left_box {
            display: flex;
            padding: 60px 0px 30px 0px;
            border-bottom: 1px solid #cccccc;
            .el-image {
              width: 100px;
              margin-right: 20px;
            }
            h2 {
              font-size: 20px;
              font-weight: 400;
              color: rgba(79, 203, 205, 1);
              margin-bottom: 14px;
            }
            p {
              font-size: 14px;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              margin-bottom: 20px;
            }
            .referral {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(0, 0, 0, 1);
              width: 646px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              padding-right: 40px;
            }
            .search_left_btn {
              .novel_detail {
                width: 102px;
                height: 30px;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(230, 230, 230, 1);
                border-radius: 5px;
                border: none;
                outline: none;
                font-size: 14px;
                margin-bottom: 15px;
                cursor: pointer;
              }
              .novel_read {
                width: 102px;
                height: 30px;
                background: rgba(79, 203, 205, 1);
                border-radius: 5px;
                border: none;
                outline: none;
                color: #fff;
                font-size: 14px;
                cursor: pointer;
              }
            }
          }
          .hot_search {
            height: 115px;
            font-size: 16px;
            font-weight: 400;
            color: rgba(0, 0, 0, 1);
            display: flex;
            align-items: center;
          }
          .hot_choose {
            min-height: 833px;
            ul {
              display: flex;
              flex-wrap: wrap;
              li {
                width: 25%;
                font-size: 14px;
                font-weight: 400;
                color: rgba(102, 102, 102, 1);
                margin-bottom: 18px;
                cursor: pointer;
                &:hover {
                  color: aqua;
                }
              }
            }
          }
        }
        // .search_block {
        //   height: 196px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        // }
      }
      .search_right {
        width: 19%;
        .search_right_title {
          display: flex;
          height: 73px;
          align-items: center;
          justify-content: flex-start;
          border-bottom: solid 2px #4fcbcd;
          span {
            color: #4fcbcd;
          }
        }
        .search_right_content {
          .search_right_box {
            display: flex;
            padding: 20px 0px 30px 0px;
            /deep/.el-image__inner {
              width: 90px;
              margin-right: 20px;
            }
            h2 {
              font-size: 14px;
              font-weight: 400;
              color: rgba(0, 0, 0, 1);
            }
            p {
              font-size: 12px;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              margin-top: 14px;
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
}
</style>