<template>
  <div class="user-list">
    <div
      :class="imAccount == item.im_account ? 'user-item' : 'user-item c-active'"
      @click="clickUser(item)"
      v-for="item in userList"
      :key="item.im_account"
    >
      <el-avatar
        :size="'medium'"
        :fit="'contain'"
        :src="item.head_img"
      ></el-avatar>
      <div class="name">
        <div v-show="item.unread_msg_num > 0" class="conversation-red">
          {{ item.unread_msg_num }}
        </div>
        {{ item.nick_name }}
      </div>
    </div>
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
export default {
  props: ['userList'],
  data() {
    return {
      imAccount: '',
    }
  },
  methods: {
    clickUser(user) {
      this.imAccount = user.im_account
      $emit(this, 'change', user)
    },
  },
  emits: ['change'],
}
</script>

<style>
.user-list {
  display: flex;
}
.user-item {
  padding: 10px;
}
.c-active {
  background-color: rgb(243, 244, 253);
}
.name {
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
</style>
