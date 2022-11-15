<template>
  <h2>对象信息</h2>
  当前选中的节点为: {{ nodeKey }}
  <div>
    <button @click="changeTheme($event)">dark</button>
    <codemirror
      v-model="code"
      placeholder="Code gose here..."
      :style="style"
      :mode="mode"
      :spellcheck="spellcheck"
      :autofocus="autofocus"
      :indent-with-tab="indentWithTab"
      :tabSize="tabSize"
      :extensions="extensions"
      @blur="useEditedCode"
    />
  </div>
</template>

<script>
import { Codemirror } from "vue-codemirror";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { nextTick, reactive, ref, toRefs } from "vue";
import mysqlApi from "../../utils/api/mysql.js";
import { useRoute } from "vue-router";
import { onMounted, onBeforeUnmount } from "vue";
import emitter from "../../utils/bus.js";
export default {
  props: {
    nodeKey: String,
  },
  components: {
    Codemirror,
  },
  setup() {
    let DatabaseName;
    emitter.on("*", (index, data) => {
      if (index == "currentDatabaseName") {
        if (DatabaseName !== index) {
          DatabaseName = index;
          mysqlApi
            .databaseInfo(data, { dataSourceId: dataSourceId.value })
            .then((res) => {
              console.log("res", res.data.databaseDDL);
            });
        } else {
          return; // 防止打印多次
        }
      } else {
        return; // 排除其他
      }
    });
    onBeforeUnmount(() => {
      emitter.off("currentDatabaseName"); //关闭
    });
    const route = useRoute();
    // 当前数据源 id
    const dataSourceId = ref(route.query.dataSourceId);
    // 数据
    let code = ref(``);
    let selectValue = "sql";
    let dateTime = "dark";
    const options = reactive({
      style: { height: "400px",width: "400px"},
      mode: "text/x-sql",
      spellcheck: true,
      autofocus: true,
      indentWithTab: true,
      tabSize: 2,
      extensions: [sql(), oneDark], //传递给CodeMirror EditorState。创建({扩展})
    });

    // 方法
    // 失去焦点时,使用已编辑的代码
    function useEditedCode() {
      console.log("@@@blur@@@code:", code.value);
      console.log("@@@blur@@@sql:", sql);
    }

    // 改变主题
    function changeTheme(e) {
      console.log("options.extensions:", options.extensions);
      if (e.target.innerHTML === "dark") {
        options.extensions = [];
        dateTime = e.target.innerHTML = "light";
      } else {
        options.extensions = [oneDark];
        dateTime = e.target.innerHTML = "dark";
      }
    }

    // 返回
    return {
      dataSourceId,
      code,
      selectValue,
      dateTime,
      ...toRefs(options),
      log: console.log,
      useEditedCode,
      changeTheme,
    };
  },
};
</script>

