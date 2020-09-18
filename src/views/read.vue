<template>
  <div class="read">
    <div class="read_content area" :class="bgColor==true?'bg_active':''">
      <div class="read_content_top">
        <span class="novel_name">《{{ChapterList.book_name}}》</span>
        <u class="chapter">第{{ChapterList.chapter_id}}章</u>
        <u class="chapter_name">{{ChapterList.chapter_title}}</u>
      </div>
      <div class="read_content_box">
        <div
          class="title"
          :class="bgColor==true?'bg_active':''"
        >第{{ChapterList.chapter_id}}章 {{ChapterList.chapter_title}}</div>
        <div
          class="word_box"
          v-html="ChapterList.chapter_content"
          :style="{'font-size':fontSize?num+'px':''}"
        ></div>
        <div class="btn">
          <div @click="hadlelastChapter(ChapterList.chapter_id)" v-if="lastHaveData">
            <button>上一章</button>
          </div>
          <div @click="hadleNextChapter(ChapterList.chapter_id)" v-if="haveData">
            <button>下一章</button>
          </div>
        </div>
      </div>
    </div>
    <div class="operation">
      <div class="catalog" @click="handleDrawer()" :class="bgColor==true?'bg_active':''">
        <img :src="dtable_img" alt :class="bgColor==true?'img_active':''" id="table_icon" />
        <p>目录</p>
      </div>
      <div class="setting" @click="handleDialog()" :class="bgColor==true?'bg_active':''">
        <img :src="dset" alt :class="bgColor==true?'img_active':''" id="set" />
        <p>设置</p>
      </div>
      <div class="setting" @click="handleSkip()" :class="bgColor==true?'bg_active':''">
        <img :src="dhome" alt :class="bgColor==true?'img_active':''" id="home" />
        <p>首页</p>
      </div>
    </div>
    <div class="drawer_box">
      <el-drawer direction="rtl" size="50%" :visible.sync="drawer">
        <div class="catalog_content">
          <div class="catalog_title">
            <h4>{{CatalogList.name}}</h4>
            <h5>{{CatalogList.author}}</h5>
          </div>
          <div class="catalog_operation">
            <span>目录</span>
            <div>
              <img
                v-for="(item,index) in imgList"
                :key="index"
                :src="item.url"
                alt
                @click="hadleSort(index)"
              />
            </div>
          </div>
          <div class="catalog_section">
            <ul>
              <li
                v-for="(item,index) in CatalogList.chapter_list"
                :key="index"
                @click="hadleChangeSection(item.chapter_id)"
                :class="{active:params.chapter_id==item.chapter_id}"
              >第{{item.chapter_id}}章 {{item.chapter_title}}</li>
            </ul>
          </div>
        </div>
      </el-drawer>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <div class="setting_box">
        <div class="setting_box_top">
          <p>设置</p>
        </div>
        <div class="setting_box_content">
          <div class="read_bg">
            <span>阅读背景:</span>
            <ul>
              <li
                v-for="(item,index) in schemaList"
                :key="index"
                @click="handleSchema(index)"
                :class="{btn_active:Schema_index==index}"
              >{{item}}</li>
            </ul>
          </div>
          <div class="read_font">
            <span>字体大小:</span>
            <el-input-number v-model="num" :step="1" :min="16" :max="30"></el-input-number>
          </div>
          <div class="btn">
            <button
              v-for="(item,index) in btnList"
              :key="index"
              @click="hadleChangeSetting(index)"
              :class="{btn_active:btn_current==index}"
            >{{item}}</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Foot from "../components/foot.vue";

import {
  reactive,
  toRefs,
  onMounted,
  onBeforeUnmount
} from "@vue/composition-api";
export default {
  components: {
    Foot,

  },
  setup(propos, context) {
    const _this = context.root;
    const stats = reactive({
      params: {
        chapter_id: context.root.$route.params.id,
        book_id: context.root.$route.params.bookId
      },
      drawer: false,
      title: "六界封神",
      imgList: [
        { url: require("../assets/img/read/Ascending_Selected_icon.png") },
        { url: require("../assets/img/read/drop_Unselected_icon.png") }
      ],
      btn_current: "",
      current: "",
      Schema_index: 0,
      img_current: "",
      ChapterList: {},
      ascending: "true",
      CatalogList: {},
      dialogVisible: false,
      num: 12,
      btnList: ["保存设置", "恢复默认"],
      schemaList: ["白天模式", "夜间模式"],
      // 字体大小
      fontSize: false,
      // 背景颜色
      bgColor: false,
      dtable_img: require("../assets/img/read/table _icon.png"),
      table_img: require("../assets/img/read/table_icon.png"),
      dhome: require("../assets/img/read/home_icon.png"),
      home: require("../assets/img/read/home_icon .png"),
      dset: require("../assets/img/read/Set up_icon.png"),
      set: require("../assets/img/read/Set_up_icon.png"),
      haveData: true,
      lastHaveData: true,
      // 总的章节
      totalSection: ""
    });
    // 根据跳转进来的in_book_id和bookId获取数据
    const bookDetail = async () => {
      // 获取详情后,再查出目录
      await _this.$http
        .post(
          "/book",
          {},
          {
            ...stats.params
          }
        )
        .then(res => {
          let { code, data } = res.data;
          stats.ChapterList = data;
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 获取章节
    const catelog = async () => {
      await _this.$http
        .post(
          "/book/catelog",
          {},
          {
            id: stats.params.book_id,
            ascending: stats.ascending
          }
        )
        .then(res => {
          let { code, data } = res.data;
          stats.totalSection = data.chapter_list.length;
          stats.CatalogList = data;

          if (stats.totalSection > stats.params.chapter_id) {
            stats.haveData = true;
          } else {
            stats.haveData = false;
          }
          if (stats.params.chapter_id == 1) {
            stats.lastHaveData = false;
          } else {
            stats.lastHaveData = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    };
    // 上一章
    const hadlelastChapter = async chapter_id => {
      stats.params.chapter_id = parseInt(chapter_id - 1);
      stats.current = chapter_id;
      await _this.$http
        .post(
          "/book",
          {},
          {
            ...stats.params
          }
        )
        .then(res => {
          let { code, data } = res.data;
          if (code == 0) {
            stats.ChapterList = data;
            // this.bookId = this.ChapterList.book_id;

            context.root.$router.push({
              name: "read",
              params: {
                bookId: stats.params.book_id,
                id: stats.params.chapter_id
              }
            });
          } else if (code == 404) {
            stats.lastHaveData = false;
            return false;
          } else {
            stats.ChapterList = {};
            // this.bookId = "";
          }
        });
      await catelog();
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    // 点击下一章
    const hadleNextChapter = async chapter_id => {
      stats.params.chapter_id = parseInt(chapter_id + 1);
      stats.current = chapter_id;
      await _this.$http
        .post(
          "/book",
          {},
          {
            ...stats.params
          }
        )
        .then(res => {
          let { code, data } = res.data;
          if (code == 0) {
            stats.ChapterList = data;
            // this.bookId = this.ChapterList.book_id;

            context.root.$router.push({
              name: "read",
              params: {
                bookId: stats.params.book_id,
                id: stats.params.chapter_id
              }
            });
          } else if (code == 404) {
            stats.lastHaveData = false;
            return false;
          } else {
            stats.ChapterList = {};
            // this.bookId = "";
          }
        });
      await catelog();
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    const handleDrawer = async () => {
      stats.drawer = true;
    };
    const hadleChangeSection = async id => {
      stats.params.chapter_id = id;
      await _this.$http
        .post(
          "/book",
          {},
          {
            ...stats.params
          }
        )
        .then(res => {
          let { code, data } = res.data;
          if (code == 0) {
            stats.ChapterList = data;
            // this.bookId = this.ChapterList.book_id;
            if (stats.totalSection > stats.params.chapter_id) {
              stats.haveData = true;
            } else {
              stats.haveData = false;
            }
            context.root.$router.push({
              name: "read",
              params: {
                bookId: stats.params.book_id,
                id: stats.params.chapter_id
              }
            });
          } else if (code == 404) {
            stats.lastHaveData = false;
            return false;
          } else {
            stats.ChapterList = {};
            // this.bookId = "";
          }
        });
      // 回到顶部
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    const hadleSort = async index => {
      if (index == 0) {
        stats.ascending = "true";
        stats.imgList = [
          {
            url: require("../assets/img/read/Ascending_Selected_icon.png")
          },
          {
            url: require("../assets/img/read/drop_Unselected_icon.png")
          }
        ];
      } else {
        stats.ascending = "false";
        stats.imgList = [
          {
            url: require("../assets/img/read/Ascending_Unselected_icon.png")
          },
          {
            url: require("../assets/img/read/drop_selected_icon.png")
          }
        ];
      }

      await catelog();
    };
    const handleDialog = async () => {
      stats.dialogVisible = true;
    };
    const hadleChangeSetting = async index => {
      stats.btn_current = index;
      // 保存模式
      if (index == 0) {
        stats.fontSize = true;
        if (index == 0 && stats.Schema_index == 0) {
          stats.bgColor = false;
          document
            .querySelector("body")
            .setAttribute("style", "background: #FAFAFA");
        } else {
          document
            .querySelector("body")
            .setAttribute("style", "background: #000000");
          stats.bgColor = true;
        }
      }
      //恢复默认
      else {
        stats.fontSize = false;
        document
          .querySelector("body")
          .setAttribute("style", "background: #FAFAFA");
        stats.bgColor = false;
        stats.num = 12;
        stats.Schema_index = 0;
      }
      stats.dialogVisible = false;
    };
    const handleSchema = async index => {
      stats.Schema_index = index;
      // 白天
      if (stats.Schema_index == 0) {
        stats.bgColor = false;
        document
          .querySelector("body")
          .setAttribute("style", "background: #FAFAFA");
        document
          .getElementById("table_icon")
          .setAttribute("src", stats.dtable_img);
        document.getElementById("home").setAttribute("src", stats.dhome);
        document.getElementById("set").setAttribute("src", stats.dset);
      }

      // 夜间
      else {
        document
          .querySelector("body")
          .setAttribute("style", "background: #000000");
        document
          .getElementById("table_icon")
          .setAttribute("src", stats.dtable_img);
        document.getElementById("home").setAttribute("src", stats.dhome);
        document.getElementById("set").setAttribute("src", stats.dset);
        stats.bgColor = true;
      }
    };
    const handleSkip = async () => {
      context.root.$router.push("/index");
    };

    // 根据bookId获取目录结构
    onMounted(() => {
      bookDetail();
      catelog();
    });
    onBeforeUnmount(() => {
      document
        .querySelector("body")
        .setAttribute("style", "background: #FAFAFA");
    });
    return {
      ...toRefs(stats),
      hadlelastChapter,
      hadleNextChapter,
      handleDrawer,
      handleDialog,
      hadleChangeSetting,
      handleSchema,
      hadleSort,
      hadleChangeSection,
      handleSkip
    };
  }
};
</script>

<style lang="less" scoped>
.read {
  position: relative;
  .read_content {
    min-height: 1080px;
    background-color: #fff;
    padding-bottom: 50px;
    .read_content_top {
      height: 69px;
      border-bottom: 1px solid #e8e9ea;
      display: flex;
      align-items: center;
      padding-left: 100px;
      box-sizing: border-box;
      .novel_name {
        font-size: 16px;
        font-weight: 400;
        color: rgba(75, 202, 204, 1);
      }
      .chapter {
        font-size: 16px;
        font-weight: 400;
        color: rgba(134, 137, 143, 1);
        margin-right: 10px;
      }
      .chapter_name {
        font-size: 16px;
        font-weight: 400;
        color: rgba(134, 137, 143, 1);
      }
    }
    .read_content_box {
      padding: 0px 100px;
      box-sizing: border-box;
      .title {
        font-size: 22px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        height: 85px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .word_box {
        min-height: 800px;
        line-height: 40px;
        font-size: 16px;
      }
      .btn {
        display: flex;
        justify-content: center;
        padding-top: 20px;
        button {
          margin-right: 100px;
          width: 180px;
          height: 38px;
          background-color: #4bcacc;
          border-radius: 15px;
          outline: none;
          border: none;
          color: #fff;
        }
      }
    }
  }
  .operation {
    position: fixed;
    right: 14%;
    top: 65%;
    .catalog {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 8px 24px 1px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      p {
        margin-top: 10px;
      }
    }
    .setting {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 8px 24px 1px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      p {
        margin-top: 10px;
      }
    }
  }
  .drawer_box {
    /deep/.el-drawer__wrapper {
      width: 700px;
      right: 0px;
      left: auto;
    }
    .catalog_content {
      overflow: scroll;
      max-height: 900px;

      .catalog_title {
        text-align: center;
        h4 {
          font-size: 18px;
          font-weight: bold;
          color: rgba(33, 40, 50, 1);
          line-height: 40px;
        }
        h5 {
          font-size: 12px;
          font-weight: 400;
          color: rgba(105, 112, 121, 1);
          line-height: 40px;
        }
      }
      .catalog_operation {
        display: flex;
        justify-content: space-between;
        padding: 0px 35px;
        img {
          margin-right: 10px;
          cursor: pointer;
        }
      }
      .catalog_section {
        margin-top: 20px;
        ul {
          li {
            height: 50px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            cursor: pointer;
            padding: 0px 35px;
          }
        }
      }
    }
  }
  .setting_box {
    height: 413px;
    box-sizing: border-box;
    .setting_box_top {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #eeeeee;
      p {
        font-size: 18px;
        font-weight: 400;
        color: #000;
      }
    }
    .setting_box_content {
      .read_bg {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 80px;
        ul {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          margin-left: 40px;
          li {
            width: 80px;
            height: 36px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(210, 210, 210, 1);
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        }
      }
      .read_font {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 80px;
        span {
          margin-right: 40px;
        }
      }
      .btn {
        display: flex;
        cursor: pointer;
        button {
          width: 130px;
          height: 36px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(210, 210, 210, 1);
          margin-right: 40px;
          cursor: pointer;
        }
      }
    }
  }
  .active {
    background: rgba(242, 242, 242, 1);
    color: #4bcacc !important;
  }
  .btn_active {
    background-color: #4ac2c4 !important;
    color: #fff !important;
  }
  .bg_active {
    background-color: #191a1d !important;
    color: #c1c4c8 !important;
  }
  .img_active {
    background-color: #fff;
  }
}
</style>