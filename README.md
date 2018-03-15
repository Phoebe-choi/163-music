# 音乐播放器 

## 后台admin页面预览


![admin2.gif](https://upload-images.jianshu.io/upload_images/8532417-dc0e8b74614dfca9.gif?imageMogr2/auto-orient/strip)


### 用例图
![用例图](https://upload-images.jianshu.io/upload_images/8532417-ba348b75d608da85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 系统框架图
![系统框架图](https://upload-images.jianshu.io/upload_images/8532417-f967e1ea11585939.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 创建 LeanCloud 帐号
1. 注册 LeanCloud 帐号
2. 创建一个应用，假设应用名字为 `163-music`
3. 根据 JavaScript SDK 安装指南 安装 `leancloud-storage`
4. 在页面中引入 `av-min.js`
5. 初始化 AV
```
 var APP_ID = '...';
 var APP_KEY = '...';

 AV.init({
     appId: APP_ID,
     appKey: APP_KEY
 });
```
6. 测试数据库创建是否成功（Rocks 表示成功）
```
 var TestObject = AV.Object.extend('TestObject');
 var testObject = new TestObject();
 testObject.save({
 words: 'Hello World!'
 }).then(function(object) {
 alert('LeanCloud Rocks!');
 })
```
7. 去控制面板（ 控制台 > 存储 > 数据 > TestObject）查看数据，确认 TestObject 创建了一条新数据
### 创建七牛
1. 注册七牛帐号（上传身份证）
2. 创建一个篮子（bucket）
3. 创建一个 nodejs server
4. 进入七牛 SDK 官网，选择 Node.js
- `npm init -y`
- `npm install qiniu`
- 添加 /uptoken 路由
- 使用本地 server.js 生成 uptoken
```
var accessKey = 'your access key'
var secretKey = 'your secret key'
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

var options = {
  scope: bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);
```
- 将 uploadToken 作为响应输出
- `node server 8888`，启动 server

### 七牛依赖
`moxie.js + plupload.js + qiniu.js`

### 初始化上传按钮
```
var uploader = Qiniu.uploader({
   runtimes: 'html5',    //上传模式,依次退化
   browse_button: 'xxx',       //上传选择的点选按钮，**必需**
   uptoken_url : 'http://localhost:8888/uptoken',
   domain: 'http://qiniu-plupload.qiniudn.com/',   //bucket 域名，下载资源时用到，**必需**
   get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
   max_file_size: '40mb',           //最大文件体积限制
   dragdrop: true,                   //开启可拖曳上传
   drop_element: 'yyy',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
   auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
   init: {
       'FilesAdded': function(up, files) {
           plupload.each(files, function(file) {
               // 文件添加进队列后,处理相关的事情
           });
       },
       'BeforeUpload': function(up, file) {
           // 每个文件上传前,处理相关的事情
       },
       'UploadProgress': function(up, file) {
           // 每个文件上传时,处理相关的事情
           uploadStatus.textContent = '上传中'
       },
       'FileUploaded': function(up, file, info) {
           uploadStatus.textContent = '上传完毕'
           // 每个文件上传成功后,处理相关的事情
           // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
           // {
           //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
           //    "key": "gogopher.jpg"
           //  }
           // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

           // var domain = up.getOption('domain');
           // var res = parseJSON(info.response);
           // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
       },
       'Error': function(up, err, errTip) {
           //上传出错时,处理相关的事情
       },
       'UploadComplete': function() {
           //队列文件处理完毕后,处理相关的事情
       },
   }
 });
```
