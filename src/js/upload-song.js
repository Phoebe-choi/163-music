{
	let view={
		el:'.uploadArea',
		find(selector){
			return $(this.el).find(selector)[0]
		}
	}
	let model={}
	let controller={
		init(view,model){
			this.view=view
			this.model=model
			this.initQiniu()
		},
		initQiniu(){
			var uploader = Qiniu.uploader({
			  runtimes: 'html5',
			  browse_button: this.view.find('#uploadButton'),
			  uptoken_url: 'http://localhost:8888/uptoken',
			  domain: 'p544mop8w.bkt.clouddn.com',   //bucket 域名，下载资源时用到
			  get_new_uptoken: false,  //上传文件时是否每次都重新获取新的token
			  max_file_size: '40mb',
			  dragdrop: true,   //开启可拖曳上传
			  drop_element: this.view.find('#uploadContainer'), //拖曳上传区域元素的ID
			  auto_start: true,  //选择文件后自动上传
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
				  },
				  'FileUploaded': function(up, file, info) {
				    	//获取上传文件外链
				    	var domain = up.getOption('domain');
				    	var response = JSON.parse(info.response);
				      var sourceLink = 'http://'+domain + '/' + encodeURIComponent(response.key);
				      window.eventHub.emit('new',{
								url:sourceLink,
				    		name:response.key
							})
					},
				  'Error': function(up, err, errTip) {
				         //上传出错时,处理相关的事情
				  },
				  'UploadComplete': function() {
				         //队列文件处理完毕后,处理相关的事情
				  },
			  }
			});
		}
	}
	controller.init(view,model)
}