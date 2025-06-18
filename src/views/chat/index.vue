<template>
  <div>
    <h1>聊天</h1>

    <user-list :userList="userList" @change="handerUserChange"></user-list>
    <el-divider></el-divider>
    <div class="chat-container" ref="chat">
      <div class="out-chat-left">
        <div id="conversation" class="chat-left">
          <div v-if="conversationList.length == 0" style="margin: 10px">
            暂无会话
          </div>
          <div
            :class="
              item.conversationID == conversationID
                ? 'conversation-item'
                : 'conversation-item c-active'
            "
            @click="clickConversation(item)"
            @click.right="showRightMenu(item.conversationID)"
            v-for="item in conversationList"
            :key="item.conversationID"
          >
            <el-avatar
              :size="'medium'"
              :fit="'contain'"
              :src="item.userProfile.avatar"
            ></el-avatar>
            <div>
              <div class="conversation-name">
                {{ item.userProfile.nick }}
                <div v-show="item.unreadCount > 0" class="conversation-red">
                  {{ item.unreadCount }}
                </div>
              </div>
              <div class="conversation-message">
                {{ item.lastMessage.messageForShow }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="context-menu-container" v-show="contextMenuVisible">
        <div class="context-menu">
          <a href="javascript:;" @click="delConversation(menuCid)">删除</a>
        </div>
      </div>

      <div class="chat-right">
        <div class="chart-right" @scroll="scrollEventSay">
          <div
            v-for="(item, index) in wordList"
            class="message-container"
            :key="item.id"
          >
            <!-- 时间 -->
            <div class="word-time flex-center font-normal" v-show="index == 0">
              {{ formatTimestamp(item.time) }}
            </div>
            <!-- index不为第一个切两条消息相差5分钟才显示这个时间 -->
            <div class="word-time flex-center font-normal" v-if="index !== 0">
              {{
                item.time - wordList[index - 1].time > 5 * 60
                  ? formatTimestamp(item.time)
                  : ''
              }}
            </div>
            <div class="word row-center" v-if="item.mineMsg == false">
              <el-avatar
                :size="'medium'"
                :src="item.avatar ? item.avatar : avatar"
                alt=""
              />
              <div v-if="item.cv">
                <img class="image-element" :src="item.imageUrl" />
              </div>
              <div
                v-else
                class="flex-center message"
                style="word-break: break-all"
              >
                <template v-for="(textItem, textIndex) in decodeText(item.contactText)">
                  <span class="text-box" v-if="textItem.name === 'text'" :key="`text-${textIndex}`">{{
                    textItem.text
                  }}</span>
                  <img
                    v-else-if="textItem.name === 'img'"
                    :src="textItem.src"
                    width="20px"
                    height="20px"
                    :key="`img-${textIndex}`"
                  />
                </template>
              </div>
            </div>
            <div class="word-my row" v-if="item.mineMsg">
              <div class="row-center word-my-center">
                <div v-if="item.cv">
                  <img class="image-element" :src="item.imageUrl" />
                </div>
                <div v-else class="text-white bg-blue flex-center">
                  <template
                    v-for="(textItem, textIndex) in decodeText(item.contactText)"
                  >
                    <span class="text-box" v-if="textItem.name === 'text'" :key="`my-text-${textIndex}`">{{
                      textItem.text
                    }}</span>
                    <img
                      v-else-if="textItem.name === 'img'"
                      :src="textItem.src"
                      width="20px"
                      height="20px"
                      :key="`my-img-${textIndex}`"
                    />
                  </template>
                </div>
                <el-avatar
                  :size="'medium'"
                  :src="item.avatar ? item.avatar : avatar"
                  alt=""
                />
              </div>

              <div
                class="have-read flex-center text-white"
                :class="item.read == false ? 'read-false' : ''"
              >
                {{ item.read ? '已读' : '未读' }}
              </div>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div v-show="conversationID != ''" class="message-input">
          <div class="send-header-bar">
            <el-popover placement="top" width="400" trigger="click">
              <div class="emojis">
                <div
                  v-for="item in emojiName"
                  class="emoji"
                  :key="item"
                  @click="chooseEmoji(item)"
                >
                  <img
                    :src="emojiUrl + emojiMap[item]"
                    style="width: 30px; height: 30px"
                  />
                </div>
              </div>
              <template #reference>
                <i class="icon-smile" title="发表情">😀</i>
              </template>
            </el-popover>
            <i class="icon-tupian" title="发图片" @click="handleSendImageClick"
              >📷</i
            >
          </div>

          <div class="bottom">
            <textarea
              ref="text-input"
              rows="4"
              resize="false"
              v-model="messageContent"
              class="text-input"
              @focus="focus = true"
              @blur="focus = false"
              @keydown.enter.exact.prevent="sendText"
            >
            </textarea>
            <el-button @click="sendText">发送</el-button>
          </div>
          <input
            type="file"
            id="imagePicker"
            ref="imagePicker"
            accept=".jpg, .jpeg, .png, .gif, .bmp"
            @change="sendImage"
            style="display: none"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TencentCloudChat from '@tencentcloud/chat'
import { proxyList } from '@/api/common'
import { emojiMap, emojiName, emojiUrl } from '@/utils/emojiMap'
import { decodeText } from '@/utils/decodeText.js'
import userList from './cpns/user-list.vue'

export default {
  data() {
    return {
      conversationID: '',
      toImAccount: '',
      nextReqMessageID: '',
      userList: [],
      currentAccount: '',
      currentSign: '',
      wordList: [],
      conversationList: [],
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      messageContent: '',
      loadingInstance: '',
      decodeText: decodeText,
      refreshTimer: '',
      contextMenuTarget: document.body,
      contextMenuVisible: false,
      menuCid: '',
    }
  },
  created() {
    this.loadUser()
    this.login()
    this.Tim.on(TencentCloudChat.EVENT.SDK_READY, (event) => {
      // console.log("SDK_READY...",event)
      // this.getProfile()
    })
    // 监听对方发过来的消息
    this.Tim.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, (event) => {
      console.log('MESSAGE_RECEIVED...', event)
      this.appendMessage(event.data)
    })

    this.Tim.on(TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED, (event) => {
      console.log('CONVERSATION_LIST_UPDATED...', event)
      //清除拉取会话的延时事件
      // clearInterval(this.timer)
      this.conversationList = event.data
    })
  },
  beforeUnmount() {
    clearInterval(this.refreshTimer)
  },
  components: {
    'user-list': userList,
  },
  methods: {
    async login() {
      this.showLoading()
      try {
        await this.Tim.logout()
        this.wordList = []
        this.conversationList = []
        this.conversationID = ''
      } catch {}
      if (!this.currentImAccount() || !this.currentImSign()) {
        this.closeLoading()
        return
      }

      let promise = this.Tim.login({
        userID: this.currentImAccount(),
        userSig: this.currentImSign(),
      })
      promise
        .then((imResponse) => {
          // clearInterval(this.timer)
          // this.timer = setInterval(this.getConversationList,1000)
          this.closeLoading()
          console.log(imResponse.data) // 登录成功
          if (imResponse.data.repeatLogin === true) {
            // 标识账号已登录，本次登录操作为重复登录。
            console.log(imResponse.data.errorInfo)
          }
        })
        .catch((imError) => {
          this.closeLoading()
          console.warn('login error:', imError) // 登录失败的相关信息
        })
    },
    showRightMenu(e) {
      this.contextMenuVisible = true
      this.menuCid = e
    },
    delConversation(cid) {
      if (!cid) {
        return
      }
      let promise = this.Tim.deleteConversation(cid)
      promise
        .then(() => {
          // 删除会话成功
          const { conversationID } = imResponse.data // 被删除的会话 ID
        })
        .catch(function (imError) {
          console.warn('deleteConversation error:', imError) // 删除会话失败的相关信息
        })
      this.contextMenuVisible = false
    },
    MenuUpdateShow(data) {
      if (!data) {
        this.contextMenuVisible = data
      }
    },
    showLoading() {
      if (!this.loadingInstance) {
        // 如果Loading实例不存在，创建并显示它
        var loading = this.$loading({
          target: this.$refs.chat,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        this.loadingInstance = loading
        setTimeout(() => {
          if (loading) {
            loading.close()
          }
        }, 4000)
      } else {
        // 如果Loading实例存在，关闭它
        this.loadingInstance.close()
        this.loadingInstance = null // 清空Loading实例变量
      }
    },
    closeLoading() {
      // 检查Loading实例是否存在并关闭
      if (this.loadingInstance) {
        this.loadingInstance.close()
        this.loadingInstance = null // 清空Loading实例变量
      }
    },
    handerUserChange(user) {
      this.wordList = []
      this.conversationList = []
      this.conversationID = ''
      this.currentAccount = user.im_account
      this.currentSign = user.im_sign
      this.login()
    },
    currentImAccount() {
      return this.currentAccount
    },
    currentImSign() {
      return this.currentSign
    },
    formatTimestamp(timestamp) {
      function addZero(number) {
        if (number < 10) {
          return '0' + number
        }
        return number
      }

      var date = new Date(timestamp * 1000)
      // 提取日期和时间组件
      var year = date.getFullYear() // 年份
      var month = date.getMonth() + 1 // 月份（注意要加 1，因为月份是从 0 到 11）
      var day = date.getDate() // 日期
      var hours = date.getHours() // 小时
      var minutes = date.getMinutes() // 分钟
      var seconds = date.getSeconds() // 秒
      // 构建可读的时间字符串
      var formattedDate =
        year +
        '-' +
        addZero(month) +
        '-' +
        addZero(day) +
        ' ' +
        addZero(hours) +
        ':' +
        addZero(minutes) +
        ':' +
        addZero(seconds)
      // 辅助函数，用于确保日期和时间部分是两位数
      return formattedDate
    },
    getProfile() {
      let promise = this.Tim.getMyProfile()
      promise
        .then((imResponse) => {
          console.log(imResponse.data) // 个人资料 - Profile 实例
        })
        .catch(function (imError) {
          console.warn('getMyProfile error:', imError) // 获取个人资料失败的相关信息
        })
    },
    clickConversation(cid) {
      this.conversationID = cid.conversationID
      this.toImAccount = cid.userProfile.userID
      this.getMessage()
    },
    getConversationList() {
      if (!this.Tim.isReady()) {
        return
      }
      let promise = this.Tim.getConversationList()
      promise
        .then((imResponse) => {
          close(this.timer)
          this.conversationList = imResponse.data.conversationList // 全量的会话列表，用该列表覆盖原有的会话列表
          const isSyncCompleted = imResponse.data.isSyncCompleted // 从云端同步会话列表是否完成
          if (isSyncCompleted) {
            clearInterval(this.timer)
          }
        })
        .catch(function (imError) {
          console.warn('getConversationList error:', imError) // 获取会话列表失败的相关信息
        })
    },
    getMessage() {
      let cID = `${this.conversationID}`
      // 打开某个会话时，第一次拉取消息列表，注意！第一次拉取时不要传入 nextReqMessageID
      let promise = this.Tim.getMessageList({ conversationID: cID, count: 15 })
      promise.then((imResponse) => {
        this.messageContent = ''
        const messageList = imResponse.data.messageList // 消息列表。
        this.wordList = this.buildData(messageList)
        const nextReqMessageID = imResponse.data.nextReqMessageID // 用于续拉，分页续拉时需传入该字段。
        this.nextReqMessageID = nextReqMessageID
        const isCompleted = imResponse.data.isCompleted // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。
        this.scrollEvent()
      })
      promise = this.Tim.setMessageRead({ conversationID: cID })
      promise
        .then(function (imResponse) {
          // 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
        })
        .catch(function (imError) {
          // 已读上报失败
          console.warn('setMessageRead error:', imError)
        })
    }, // 控制滚动条滚动到底部
    scrollEvent() {
      // 自动滚动到底部
      this.$nextTick(() => {
        let msg = document.getElementsByClassName('chart-right')[0] // 获取对象
        msg.scrollTop = msg.scrollHeight + 10 // 滚动高度
      })
    },
    async loadUser() {
      const res = await proxyList({})
      console.log(res)
      if (res.code === 0) {
        this.userList = res.data.list
      }
      var t = this.refreshTimer
      this.refreshTimer && clearInterval(this.refreshTimer)
      this.refreshList()
      this.refreshTimer = setInterval(this.refreshList, 30000)
    },
    async refreshList() {
      const res = await proxyList({ is_need_unread_num: true })
      if (res.code === 0) {
        this.userList = res.data.list
      }
    },

    buildData(messageList) {
      let wordList = messageList.map((item) => {
        if (
          item.from == this.currentImAccount() &&
          item.type == TencentCloudChat.TYPES.MSG_TEXT
        ) {
          return {
            mineMsg: true,
            contactText: item.payload.text,
            read: item.isPeerRead ? true : false,
            id: item.ID,
            time: item.clientTime,
            avatar: item.avatar,
          }
        } else if (
          item.from == this.currentImAccount() &&
          item.type == TencentCloudChat.TYPES.MSG_IMAGE
        ) {
          return {
            mineMsg: true,
            cv: true,
            imageUrl: item.payload.imageInfoArray[0].url,
            read: item.isPeerRead ? true : false,
            id: item.ID,
            time: item.clientTime,
            avatar: item.avatar,
          }
        } else if (
          item.from != this.currentImAccount() &&
          item.type == TencentCloudChat.TYPES.MSG_IMAGE
        ) {
          return {
            mineMsg: false,
            cv: true,
            imageUrl: item.payload.imageInfoArray[0].url,
            read: item.isPeerRead ? true : false,
            id: item.ID,
            time: item.clientTime,
            avatar: item.avatar,
          }
        } else if (
          item.from != this.currentImAccount() &&
          item.type == TencentCloudChat.TYPES.MSG_TEXT
        ) {
          return {
            mineMsg: false,
            contactText: item.payload.text,
            read: false,
            id: item.ID,
            time: item.clientTime,
            avatar: item.avatar,
          }
        } else if (item.type == TencentCloudChat.TYPES.MSG_CUSTOM) {
          return {
            invite: true,
            contactText: JSON.parse(item.payload.text),
            id: item.ID,
            time: item.clientTime,
            avatar: item.avatar,
          }
        }
      })
      return wordList
    },
    // 监听滚动条的高度，滚动到顶部后拉取聊天数据
    scrollEventSay(e) {
      if (!this.conversationID) return
      this.scrollHeight = e.srcElement.scrollHeight
      if (e.srcElement.scrollTop == 0 && !this.isCompleted) {
        this.loadMoreMessage()
      }
    },
    loadMoreMessage() {
      if (!this.nextReqMessageID) {
        return
      }
      let cID = `${this.conversationID}`
      // 打开某个会话时，第一次拉取消息列表，注意！第一次拉取时不要传入 nextReqMessageID
      let promise = this.Tim.getMessageList({
        conversationID: cID,
        nextReqMessageID: this.nextReqMessageID,
        count: 15,
      })
      promise.then((imResponse) => {
        console.log('获取消息', imResponse)
        const messageList = imResponse.data.messageList // 消息列表。
        var dataList = this.buildData(messageList)
        this.nextReqMessageID = imResponse.data.nextReqMessageID
        for (let i = dataList.length - 1; i >= 0; i--) {
          this.wordList.unshift(dataList[i])
        }
        this.$nextTick(() => {
          let msg = document.getElementsByClassName('chart-right')[0] // 获取对象
          msg.scrollTop = msg.scrollHeight - this.scrollHeight // 滚动高度
        })
      })
    },
    sendText() {
      if (
        this.messageContent === '' ||
        this.messageContent.trim().length === 0
      ) {
        this.messageContent = ''
        this.$message('不可以发空消息')
        return
      }

      console.log(this.toImAccount)
      let message = this.Tim.createTextAtMessage({
        to: this.toImAccount,
        conversationType: 'C2C',
        conversationID: this.conversationID,
        payload: {
          text: this.messageContent,
        },
      })
      this.sendMessage(message)
    },
    sendImage() {
      const message = this.Tim.createImageMessage({
        to: this.toImAccount,
        conversationType: 'C2C',
        conversationID: this.conversationID,
        payload: {
          file: document.getElementById('imagePicker'), // 或者用event.target
        },
        onProgress: (percent) => {
          message['progress'] = percent // 手动给message 实例加个响应式属性: progress
        },
      })
      this.Tim.sendMessage(message).then((imResponse) => {
        this.appendMessage([imResponse.data.message])
        this.$refs.imagePicker.value = null
      })
    },
    sendMessage(message) {
      console.log(message)
      let promise = this.Tim.sendMessage(message)
      promise
        .then((imResponse) => {
          this.appendMessage([imResponse.data.message])
        })
        .catch(function (imError) {
          // 发送失败
          console.warn('sendMessage error:', imError)
        })
      this.messageContent = ''
    },
    appendMessage(list) {
      if (list[0].conversationID != this.conversationID) {
        return
      }
      this.wordList.push(...this.buildData(list))
      this.scrollEvent()
    },
    chooseEmoji(item) {
      console.log(item)
      this.messageContent = this.messageContent + item
    },
    handleSendImageClick() {
      this.$refs.imagePicker.click()
    },
  },
}
</script>

<style scoped>
.chat-container {
  display: flex;
  text-align: center;
  min-height: 600px;
}
.out-chat-left {
  width: 360px;
  position: relative;
  overflow: hidden;
}
.chat-left {
  position: absolute;
  left: 0;
  top: 0;
  right: -17px;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
.conversation-item {
  display: flex;
  padding: 10px;
}
.word {
  display: flex;
}
.word-my {
  display: flex;
  line-height: 30px;
  flex-direction: row-reverse;
}
.word-my-center {
  display: flex;
}
.bg-blue {
  background-color: rgb(76, 145, 249);
  padding: 5px;
}
.text-white {
  text-align: center;
}
.flex-center {
  border-radius: 5px;
}
.message {
  background-color: rgb(242, 242, 243);
  padding: 5px;
}
.message-container {
  margin: 20px;
}
.have-read {
  background-color: rgb(166, 220, 169);
  line-height: 20px;
  font-size: 10px;
  height: 20px;
  margin-right: 10px;
}
.read-false {
  background-color: rgb(188, 224, 245);
  line-height: 20px;
  font-size: 10px;
  height: 20px;
  margin-right: 10px;
}
.c-active {
  background-color: rgb(243, 244, 253);
}
.row-center {
}
.chat-right {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 650px;
  border-left: 2px solid gainsboro;
}
.chart-right {
  overflow-y: scroll;
  height: 350px;
}
.message-input {
  height: 300px;
  margin-left: 30px;
}
.bottom {
  text-align: right;
}
.send-header-bar {
  display: flex;
}
.emojis {
  height: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
}
.emoji {
  height: 40px;
  width: 40px;
  box-sizing: border-box;
}
.icon-smile:before {
  content: '';
}
.text-input {
  font-size: 16px;
  width: 100%;
  box-sizing: box-sizing;
  border: none;
  outline: none;
  background-color: transparent;
}
.bottom {
  padding-top: 10px;
  position: relative;
}
.btn-send {
  cursor: pointer;
  position: absolute;
  font-size: 30px;
  right: 0;
  bottom: -5px;
  padding: 6px 6px 4px 4px;
  border-radius: 50%;
}
.conversation-message {
  font-size: 12px;
  color: grey;
  text-align: left;
}
.conversation-name {
  position: relative;
}
.conversation-red {
  position: absolute;
  top: -3.5px;
  right: -15.5px;
  width: 15px;
  height: 15px;
  background-color: red;
  color: white;
  border-radius: 50%;
  text-align: center;
  font-size: 10px;
  font-weight: bold;
  line-height: 15px;
}
.context-menu-container {
  position: fixed;
  z-index: 9999;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.context-menu {
  padding: 8px 0;
}
.context-menu a {
  display: block;
  padding: 8px 16px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;
}
.context-menu a:hover {
  background-color: #f5f5f5;
}
.image-element {
  max-width: 250px;
  cursor: zoom-in;
}
</style>
