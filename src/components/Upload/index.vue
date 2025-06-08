<template>
    <el-upload
        action="string"
        list-type="picture"
        :http-request="ossUpload"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :disabled="disable"
        :limit="limit"
    >
        <el-button
            size="small"
            :disabled="disable"
            type="primary"
        >
            上传文件
        </el-button>
        <div
            slot="tip"
            class="el-upload__tip"
        >
            支持jpg、png、pdf、word格式，大小不超过500M。
        </div>
    </el-upload>
</template>

<script>
// import {delObject} from "@/api/goods";
import {upload} from "@/api/common";

export default {
    name: 'Upload',
    model: {
        prop: 'fileList',
        event: 'change',
    },
    props: {
        fileList: {
            type: Array,
        },
        limit: {
            type: Number,
        },
        disable: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            object_key: '',
        }
    },
    methods: {
        handlePictureCardPreview(file) {
            let downUrl = '';
            if (file.hasOwnProperty('url')) {
                downUrl = file.url;
            } else {
                downUrl = file.response.message;
            }
            // 赋值
            const a = document.createElement('a');
            // 创建href属性
            a.href = downUrl;
            // 点击下载
            a.click();
        },
        // 上传前
        beforeUpload(file) {
            const limitSize = 500;
            const isLt500M = file.size / 1024 / 1024 < limitSize;
            if (!isLt500M) {
                this.$message.error(`上传文件大小不能超过 ${limitSize}MB!`);
            }
            return isLt500M;
        },
        // 手动删除文件钩子
        // async handleRemove(_file, fileList) {
        //     const {msg} = await delObject(_file.name)
        //     this.$message.success(msg)
        //     this.$emit('del', _file.name);
        // },
        // 上传成功钩子
        handleSuccess(_res, _file, fileList) {
            _file.name = this.object_key
            this.triggerChange()
        },
        // 上传失败的钩子
        handleError(err, _file, fileList) {
            console.log("upload file failed", err)
            this.triggerChange();
        },
        // 自定义处理filelist
        triggerChange() {
            this.$emit('change', this.object_key);
        },
        // 自定义上传oss方法
        ossUpload(option) {
            const formData = new FormData()
            formData.append('file', option.file)
            upload(formData).then(response => {
                this.object_key = response.data.object_key
                option.onSuccess()
            }).catch(response => {
                console.log('图片上传失败')
                option.onError()
            })
        }
    },
}
</script>
<style scoped>
/*.finish_room{*/
/*    width: auto;*/
/*    height: auto;*/
/*}*/
/*.finish_room2{*/
/*    width: 100%;*/
/*    height: auto;*/
/*    padding-top: 15px;*/
/*    padding-bottom: 15px;*/
/*    display: flex;*/
/*    align-items: center;*/
/*    border-bottom: 2px solid #e1e1e1;*/
/*}*/
/*.finish_room2 .room_img{*/
/*    width: 150px;*/
/*    height: 100px;*/
/*    margin-right: 10px;*/
/*    position: relative;*/
/*    overflow: hidden;*/
/*}*/
/*.finish_room2 .room_img img{*/
/*    width: 100%;*/
/*    height: 100%;*/
/*}*/
/*.finish_room2>.room_img span{*/
/*    position: absolute;*/
/*    width: auto;*/
/*    height: auto;*/
/*    right: 5px;*/
/*    bottom:3px;*/
/*}*/
/*.room_add_btn{*/
/*    width: 80px;*/
/*    height: 40px;*/
/*    border: 1px solid #e1e1e1;*/
/*    position: relative;*/
/*    line-height: 40px;*/
/*    text-align: center;*/
/*    background: #00a6c6;*/
/*    color: #fff;*/
/*    border-radius: 4px;*/
/*}*/
/*.room_add_btn input{*/
/*    position: absolute;*/
/*    top: 0px;*/
/*    left: 0px;*/
/*    width: 100%;*/
/*    height: 100%;*/
/*    z-index: 99999;*/
/*    opacity: 0;*/
/*}*/
</style>
