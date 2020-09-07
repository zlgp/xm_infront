<template>
  <div class="detail">
    <Nav></Nav>
    <!-- 内容 -->
    <div class="detail_content area">
      <div class="detail_msg">
        <div>
          <el-image :key="DetailList.cover_link" :src="DetailList.cover_link" lazy>
            <div slot="error" class="image-slot">暂无封面图</div>
          </el-image>
        </div>
        <div class="detail_info">
          <h4>{{DetailList.book_name}}</h4>
          <div>
            <span class="status" v-if="DetailList.is_end==true">已完结</span>
            <span class="status" v-if="DetailList.is_end==false">正在连载中</span>
            <span class="type">{{DetailList.cate_name}}</span>
          </div>
          <h5>{{DetailList.author_name}}</h5>
          <p>{{DetailList.description}}</p>
          <goRead :sid="1" :bookId="book_id">
            <button>开始阅读</button>
          </goRead>
        </div>
      </div>
      <div class="detail_section">
        <ul>
          <li
            v-for="(item,index) in  zeroth"
            :key="index"
            @click="hadleRead(index)"
            :class="{li_active:li_current==index}"
          >
            <goRead :sid="item.chapter_id" :bookId="book_id">
              <p>{{item.chapter_title}}(第{{item.chapter_id}}章)</p>
              <span>{{item.create_time}}更新</span>
            </goRead>
          </li>
        </ul>
      </div>
      <!-- <div class="detail_dec">
        <p>精彩片段:</p>
        <div class="dec_box">{{DetailList.highligth}}</div>
      </div>-->
    </div>
    <Foot></Foot>
  </div>
</template>

<script>
import moment from "moment";
import Nav from "../components/nav";
import Foot from "../components/foot.vue";
import { reactive, toRefs, onMounted, computed } from "@vue/composition-api";
import goRead from "../components/goRead";
export default {
  components: {
    Foot,
    Nav,
    goRead
  },
  setup(propos, context) {
    const _this = context.root;
    const state = reactive({
      DetailList: {},
      zeroth: [],
      start: "",
      li_current: -1,
      book_id: "",
      id: content.root.$route.params.id,
      start: 0
    });
    // 根据id获取跳转进来的详情
    const detailData = async () => {
      await _this.$http
        .post(
          "/book/detail",
          {},
          {
            id: state.id
          }
        )
        .then(res => {
          state.DetailList = res.data.data.detail;
          state.zeroth = res.data.data.zeroth;
          state.zeroth.map(element => {
            element.create_time = moment
              .unix(element.create_time)
              .format("YYYY-MM-DD hh:mm:ss ");
          });
          state.book_id = state.DetailList.id;
        })
        .catch(error => {
          console.log(error);
        });
    };

    // 点击
    const hadleRead = index => {
      state.li_current = index;
    };
    onMounted(() => {
      detailData();
    });

    return {
      ...toRefs(state),
      hadleRead,
    };
  }
};
</script>

<style lang="less" scoped>
.detail {
  .detail_content {
    margin-top: 40px;
    height: 768px;
    background-color: #fff;
    margin-bottom: 100px;
    padding: 46px 120px 0px 120px;
    .detail_msg {
      width: 100%;
      display: flex;
      padding-bottom: 23px;
      border-bottom: solid 1px rgba(0, 0, 0, 0.1);

      .el-image {
        width: 241px;
      }
      .detail_info {
        margin-left: 20px;
        h4 {
          font-size: 23px;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
          line-height: 35px;
        }
        h5 {
          font-size: 18px;
          font-weight: 400;
          color: rgba(75, 202, 204, 1);
          line-height: 35px;
        }
        .status {
          width: 46px;
          height: 20px;
          background: rgba(75, 202, 204, 1);
          border-radius: 3px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 35px;
          padding: 5px;
        }
        .type {
          width: 37px;
          height: 20px;
          background: rgba(211, 47, 47, 1);
          border-radius: 3px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 35px;
          padding: 5px;
        }
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          font-size: 14px;
          font-weight: 400;
          color: rgba(133, 140, 150, 1);
          line-height: 27px;
          margin-bottom: 30px;
        }
        button {
          width: 116px;
          height: 40px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          background-color: #00c7ac;
          border-radius: 15px;
          outline: none;
          border: none;
          cursor: pointer;
        }
      }
    }
    .detail_section {
      height: 172px;
      ul {
        height: 100%;
        display: flex;
        align-items: center;
        li {
          width: 16%;
          height: 73px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: rgba(246, 247, 249, 1);
          border-radius: 5px;
          margin-right: 30px;
          cursor: pointer;
          p {
            font-size: 13px;
            font-weight: 400;
            color: rgba(146, 151, 157, 1);
            text-align: center;
            margin-bottom: 10px;
          }
          span {
            display: block;
            font-size: 10px;
            font-weight: 400;
            color: rgba(146, 151, 157, 1);
            text-align: center;
          }
        }
      }
    }
    .detail_dec {
      p {
        font-size: 18px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 27px;
        margin-bottom: 17px;
      }
      .dec_box {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        font-size: 16px;
        font-weight: 400;
        color: rgba(97, 105, 111, 1);
        line-height: 27px;
      }
    }
  }
  .li_active {
    border: 1px solid aqua;
  }
}
</style>