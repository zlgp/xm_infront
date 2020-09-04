<template>
  <div>
    <Nav></Nav>
    <!-- 轮播图 -->
    <div class="banner">
      <img src="../assets/img/index/background_pic.png" alt class="banner_img" />
      <div class="area">
        <el-carousel height="332px" :autoplay="true">
          <el-carousel-item v-for="(item,index) in bannerList" :key="index">
            <div class="banner_box">
              <div class="banner_item">
                <h1>{{item.book_name}}</h1>
                <h4>{{item.description}}</h4>
              </div>
              <div class="banner_imng">
                <ul>
                  <li>
                    <!-- <goDetail :sid="item.id"> -->
                    <img :src="item.cover_link" alt />
                    <!-- </goDetail> -->
                  </li>
                </ul>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!-- 重磅推荐 -->
    <div class="recommend area">
      <div class="title">
        <h1>重磅推荐</h1>
      </div>
      <div class="content">
        <ul>
          <li v-for="(item,index) in recommendList" :key="index">
            <div class="img_box">
              <!-- <img src="../../assets/img/index/Focus_4.png" alt /> -->
              <!-- <goDetail :sid="item.id"> -->
              <el-image :key="item.cover_link" :src="item.cover_link" lazy>
                <div slot="error" class="image-slot">暂无封面图</div>
              </el-image>
              <!-- </goDetail> -->
            </div>
            <div class="novel_title">
              <h5>{{item.book_name}}</h5>
              <h6>{{item.author_name}}</h6>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 频道 -->
    <div class="channel area" v-if="channelList.length!=0">
      <div v-for="(item,index) in channelList" :key="index" class="channel_box">
        <div class="title">
          <h1>{{item.name}}</h1>
        </div>
        <div class="content">
          <ul>
            <li v-for="(value,index) in item.recommend" :key="index">
              <div class="img_box">
                <!-- <goDetail :sid="value.id"> -->
                <el-image :key="value.cover_link" :src="value.cover_link" lazy>
                  <div slot="error" class="image-slot">暂无封面图</div>
                </el-image>
                <!-- </goDetail> -->
              </div>
              <div class="novel_title">
                <h5>{{value.book_name}}</h5>
                <h6>{{value.author_name}}</h6>
              </div>
            </li>
          </ul>
        </div>
        <div class="type">
          <ul>
            <li v-for="(item1,index1) in item.catogory" :key="index1">
              <div class="type_box">
                <h1>{{item1[0].cate_name}}</h1>
                <p class="line"></p>
              </div>
              <div class="type_list" v-for="(value,index2) in item1" :key="index2">
                <!-- <goDetail :sid="value.id" class="godetail"> -->
                <div class="novel_name">{{value.book_name}}</div>
                <div class="author">{{value.author_name}}</div>
                <!-- </goDetail> -->
              </div>
            </li>
          </ul>
          <div class="more" @click="lookMore(item.name)">查看更多></div>
        </div>
      </div>
    </div>
    <div class="channel area" v-if="channelList.length==0">
      <p class="NoData">暂无数据</p>
    </div>
    <!-- 最新上线 -->
    <!-- 最新上线 -->
    <div class="new area">
      <div class="title">
        <h1>最新上线</h1>
      </div>
      <div class="new_content">
        <ul>
          <li v-for="(item,index) in newList" :key="index">
            <div class="img_box">
              <!-- <goDetail :sid="item.id"> -->
              <el-image :key="item.cover_link" :src="item.cover_link" lazy>
                <div slot="error" class="image-slot">暂无封面图</div>
              </el-image>
              <!-- </goDetail> -->
            </div>
            <div class="new_msg">
              <h5>{{item.book_name}}</h5>
              <p>{{item.description}}</p>
              <ul>
                <li>
                  <img
                    v-for="(value,index) in parseInt(item.score)"
                    :key="index"
                    src="../assets/img/index/star_icon.png"
                    alt
                  />
                  <img v-if="item.score%1<1" src="../assets/img/index/half_icon.png" alt />
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Foot></Foot>
  </div>
</template>

<script>
import Nav from "../components/nav";
import Foot from "../components/foot.vue";
import { reactive, toRefs, onMounted } from "@vue/composition-api";
import Vue from "vue";
export default {
  components: {
    Foot,
    Nav
  },
  setup(props, context) {
    const _this = Vue.prototype;
    const state = reactive({
      bannerList: [],
      title: "",
      descript: "",
      // 推荐
      recommendList: [],
      // 频道
      channelList: [],
      // 最新上线
      newList: []
    });
    // 获取轮播图
    const getBanner = async () => {
      await _this.$http
        .post("/banner", {}, {})
        .then(res => {
          state.bannerList = res.data.data.slice(0, 4);
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 获取重磅推荐
    const recommend = async () => {
      await _this.$http
        .post("/recommend", {}, {})
        .then(res => {
          state.recommendList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 获取频道
    const channel = async () => {
      await _this.$http
        .post("/get/channel", {}, {})
        .then(res => {
          state.channelList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 获取最新上线
    const newOnline = async () => {
      await _this.$http
        .post("/new", {}, {})
        .then(res => {
          state.newList = res.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    };

    // onMounted其实是个函数,里面可以传实参,传的是个回调函数
    onMounted(() => {
      // 获取轮播图
      getBanner();
      // 获取重磅推荐
      recommend();
      // 获取频道
      channel();
      // 获取最新上线
      newOnline();
    });
    return {
      ...toRefs(state)
    };
  }
};
</script>

<style scoped lang="less">
.banner {
  width: 100%;
  height: 332px;
  position: relative;
  background-color: rgba(0, 182, 185, 0.6);
  .banner_img {
    position: absolute;
    z-index: -1;
  }
  .banner_box {
    .banner_item {
      text-align: center;
      h1 {
        font-size: 22px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 35px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      h4 {
        font-size: 16px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 35px;
        opacity: 0.8;
        white-space: nowrap; //强制文本在单行显示
        overflow: hidden; //溢出隐藏
        text-overflow: ellipsis;
      }
    }
    .banner_imng {
      ul {
        width: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 32px auto 0px auto;
        li {
          img {
            width: 100%;
            height: 160px;
            &:hover {
              transform: scale(1.5, 1.5);
            }
          }
        }
      }
    }
  }
}
// 频道
.channel {
  min-height: 800px;
  position: relative;
  .NoData {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
  }
  .channel_box {
    border-bottom: solid 5px #4bcacc;
    padding-bottom: 60px;
    .type {
      margin-top: 30px;
      padding-left: 30px;
      ul {
        display: flex;
        li {
          width: 25%;
          padding-right: 70px;
          box-sizing: border-box;
          .type_box {
            h1 {
              font-size: 23px;
              font-weight: 400;
              color: rgb(3, 2, 2);
              line-height: 35px;
              margin-bottom: 10px;
            }
            .line {
              width: 48px;
              height: 4px;
              background: rgba(75, 202, 204, 1);
            }
          }
          .type_list {
            display: flex;
            margin-top: 30px;
            // .godetail {
            //   width: 100%;
            //   display: flex;
            .novel_name {
              // display: flex;
              // justify-content: flex-start;
              font-size: 14px;
              font-weight: 400;
              color: rgba(0, 0, 0, 1);
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: 50%;
              cursor: pointer;
              &:hover {
                color: aqua;
              }
            }
            .author {
              flex: 1;
              display: flex;
              justify-content: flex-end;
              font-size: 12px;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              cursor: pointer;
              &:hover {
                color: aqua;
              }
              // }
            }
          }
        }
      }
    }
    .more {
      font-size: 14px;
      font-weight: 400;
      color: #4bcacc;
      line-height: 35px;
      padding-left: 0px;
      margin-top: 29px;
      cursor: pointer;
    }
  }
}
// 最新上线
.new_content {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      width: 33.333%;
      margin-bottom: 20px;
      background: rgba(245, 247, 249, 1);
      .img_box {
        display: flex;
        justify-content: center;
        align-items: center;
        /deep/.el-image__inner {
          width: 96px;
          height: 128px;
        }
      }
      .new_msg {
        flex: 1;
        padding-left: 20px;
        position: relative;
        h5 {
          font-size: 14px;
          font-weight: bold;
          color: rgba(0, 0, 0, 1);
          margin-bottom: 10px;
        }
        p {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
          line-height: 20px;
          width: 228px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
        }
        ul {
          position: absolute;
          bottom: 0px;
          li {
            margin-bottom: 0px;
          }
        }
      }
    }
  }
}
// 重磅推荐
// 公共样式
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 104px;
  h1 {
    font-size: 28px;
    font-weight: bold;
    color: rgba(75, 202, 204, 1);
    line-height: 35px;
  }
}
.content {
  padding-bottom: 30px;
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    li {
      margin-bottom: 10px;
      width: 16.6%;
      .img_box {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 227px;
        /deep/.el-image__inner {
          width: 177px;
          height: 236px;
          &:hover {
            transform: translate(0px, -5px);
          }
        }
      }
      .novel_title {
        text-align: center;
        h5 {
          font-size: 16px;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
          margin-top: 10px;
        }
        h6 {
          font-size: 14px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          margin-top: 8px;
        }
      }
    }
  }
}
</style>