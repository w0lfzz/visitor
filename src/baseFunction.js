//初始化驳回数据
var rejectData = null;
//添加钉钉插件
document.write('<script src="https://g.alicdn.com/dingding/dingtalk-jsapi/2.7.13/dingtalk.open.js" type="text/javascript"></sc' + 'ript>');
//定义mobileSelect回调的函数
function MobileSelectCallBacks() {};
//使用new关键字定义一个面向对象函数，并在改函数对象下使用js原型的方式创建相应的mobileSelectCallBack函数
var MobileSelectCallBackt = new MobileSelectCallBacks();
/**
 *获得钉钉config配置
 *2019-02-26
 */
function getConfig(url) {
	var json = {
		url: url
	};
	var config;
	$.ajax({
		url: "com.ygc.product.ehall.dingding.login.login.getConfig.biz.ext",
		type: "POST",
		cache: false,
		async: false,
		data: nui.encode(json),
		contentType: 'text/json',
		success: function(text) {
			config = text.map;
		}
	});
	return config;
}
//下拉刷新

/**
 *加载显示成绩
 *uxh：学号,name：标签ID号
 */
function getStudyCJ(uxh, name) {
	$.ajax({
		type: 'POST',
		dataType: "JSON",
		url: 'com.ygc.product.ehall.business.getStudentInfo.getXSCJ.biz.ext',
		data: {
			xh: uxh
		},
		async: false,
		success: function(text) {
			// console.log(text);
			var obj = text.data;
			var htmls = "";
			for(var i = 0; i < obj.length; i++) {
				/* htmls+='<div class="bui-content">';
				htmls+='<p><span>学年：</span><font>'+obj[i].XDXN+'</font></p>';
				htmls+='<p><span>学期：</span><font>'+obj[i].XQ+'</font></p>';
				htmls+='<p><span>课程名称：</span><font>'+obj[i].KCZWMC+'</font></p>';
				htmls+='<p><span>课程性质：</span><font>'+obj[i].CJLX+'</font></p>';
				htmls+='<p><span>成绩：</span><font>'+isNull(obj[i].CJ)+'</font></p>';
				htmls+='<p><span>学分：</span><font>'+isNull(+obj[i].XF)+'</font></p>';
				htmls+='<p><span>绩点：</span><font>'+isNull(obj[i].JD)+'</font></p>';
				htmls+='</div>'; */
				htmls += '<tr><td>' + obj[i].XDXN + '</td><td>' + obj[i].XQ + '</td><td>' + obj[i].KCZWMC + '</td>';
				htmls += '<td>' + isNull(obj[i].ZSCJ) + '</td></tr>';

			}
			$("#" + name).html(htmls);
		}
	});
}

//根据ID号加载钉钉首页新闻列表
function getNewsList(comId) {
	var param = {
		"nCataId": comId,
		"bRef": 1,
		"nStart": 0,
		"nEnd": 6,
		"bAsc": 0,
		"strStartCTime": null,
		"strEndCTime": null,
		"strLoginId": "15ac51705d27d87ff6d79679c3bc97fab16601d35de0eaccb246513a0b6e677c528f0045de8c92b0b260c1c0ad721644748268986af2ca48db93e1929a8ff5fe67106a9d9d6a2e2f6a939aea74afa453fc9e8e40f415eed4827fdd6a949ee589bdeb126d1f11c52f04937b62841ad8fb8d966be5dfe7956cda358fc5fa812574",
		"strPwd": "48a9435219cc13655fb1bf294d8beb1c7b2206f851f1d1bb1cf801b0192d0e0a77e043deecf2d48e672f2e1d437cca88a85ee7368d181fcf9542044e3f6a9c526a5f3ff883c011672a0495ca5f8d37ff0612d4a0384981fb35476a93172047adbcf819d0862501ac728fbbc50c6a706c827017f9a8b2c9fba6f0f42e20980ff3",
		"strKey": ""
	};
	$.ajax({
		url: "com.csxy.newsWSDL.getTitleWSDL.getLinkTitle.biz.ext",
		type: 'POST',
		data: nui.encode(param),
		cache: false,
		contentType: 'text/json',
		success: function(text) {
			var obj = text.result;
			//var obj = eval('(' + data + ')'); //处理json字符串数组
			var html = '';
			var moreUrl = '<li style="height: auto;border: 0;font-size: .3rem;text-align: center;padding: .2rem .3rem 0;"><a href="javascript:openLinkWarp(\'http://ccpo.webvpn1.zucc.edu.cn/col/col' + comId + '/index.html\')" style="display: block;color: #2196f3;text-shadow: 0 0 10px #ddd;">更多</a></li>';
			for(var i = 0; i < obj.length; i++) {
				html += '<li><a href="javascript:openLinkWarp(\'' + splitStrLink(obj[i].link) + '\')"><p>' + obj[i].title + '</p><p>' + obj[i].createDate + '</p></a></li>';
			}
			$("#newList").html(html);
			//添加更多按钮
			$("#newList").append(moreUrl);
		}
	});
}
//zucc.edu.cn替换成webvpn1.zucc.edu.cn
function splitStrLink(str) {
	return str.replace('zucc.edu.cn', 'webvpn1.zucc.edu.cn');
}
//在钉钉打开本系统的链接-新打开窗口链接
function openNewUrl(nurl, uname) {
	//console.log("点击："+nurl);
	var newurl = nurl;
	dd.ready(function() {
		dd.biz.util.openLink({
			name: uname,
			url: newurl, //要打开链接的地址
			onSuccess: function(result) {

			},
			onFail: function(err) {}
		})
	});
}
//钉钉打开外部链接-新打开窗口链接
function openLinkWarp(nurl) {
	dd.ready(function() {
		dd.biz.util.openLink({
			url: nurl, //要打开链接的地址
			onSuccess: function(result) {},
			onFail: function(err) {}
		})
	});
}

//打开钉钉内部应用
//传一个对像obj 对像里有agentId,appId,corpId;
function openApp(agentId, appId, corpId) {
	//console.log("点击："+nurl);
	var newurl = nurl;
	dd.ready(function() {
		dd.biz.microApp.openApp({
			agentId: agentId,
			appId: appId,
			corpId: corpId,
			onSuccess: function(result) {},
			onFail: function(err) {}
		});
	});
}
//钉钉关闭当前页面
function closeDingDingPage() {
	dd.ready(function() {
		dd.biz.navigation.close({
		    onSuccess : function(result) {
		        /*result结构
		        {}
		        */
		    },
		    onFail : function(err) {}
		})
	})
}

//钉钉消息弹窗
function DDAlert(con) {
	dd.ready(function() {
		dd.device.notification.alert({
			message: con,
			title: "提示", //可传空
			buttonName: "确定",
			onSuccess: function() {},
			onFail: function(err) {}
		});
	});
}
//钉钉消息弹窗带点击回调
function DDAlertClick(con, fn) {
	dd.ready(function() {
		dd.device.notification.alert({
			message: con,
			title: "提示", //可传空
			buttonName: "确定",
			onSuccess: fn,
			onFail: function(err) {}
		});
	});
}

//钉钉消息弹窗带确认点击后页面跳转
function DDAlertTo(con, url) {
	dd.ready(function() {
		dd.device.notification.alert({
			message: con,
			title: "提示", //可传空
			buttonName: "确定",
			onSuccess: function() {
				window.location.href = url;
			},
			onFail: function(err) {}
		});
	});
}
//消息中心已读点击事件
function clickUPReadMsg(id, contents) {
	dd.ready(function() {
		dd.device.notification.alert({
			message: contents,
			title: "提示", //可传空
			buttonName: "已读",
			onSuccess: function() {
				//onSuccess将在点击button之后回调
				/*回调*/
				$.ajax({
					type: 'POST',
					url: 'com.primeton.bps.process.process.readMsg.biz.ext',
					data: {
						msgID: id
					},
					async: false,
					success: function(text) {
						window.location.reload();
					}
				});
			},
			onFail: function(err) {}
		});
	});
}

//去掉左边的空白  
function trimLeft(s) {
	if(s == null) {
		return "";
	}
	var whitespace = new String(" \t\n\r");
	var str = new String(s);
	if(whitespace.indexOf(str.charAt(0)) != -1) {
		var j = 0,
			i = str.length;
		while(j < i && whitespace.indexOf(str.charAt(j)) != -1) {
			j++;
		}
		str = str.substring(j, i);
	}
	return str;
}

//去掉右边的空白    
function trimRight(s) {
	if(s == null) return "";
	var whitespace = new String(" \t\n\r");
	var str = new String(s);
	if(whitespace.indexOf(str.charAt(str.length - 1)) != -1) {
		var i = str.length - 1;
		while(i >= 0 && whitespace.indexOf(str.charAt(i)) != -1) {
			i--;
		}
		str = str.substring(0, i + 1);
	}
	return str;
}

//判断是否是Null
//为null则返回空字符串
function isNull(obj) {
	if(obj === null) {
		return '';
	} else {
		return obj;
	}

}

function isNullStr(obj) {
	if(obj === null) {
		return '';
	} else {
		return obj;
	}

}

//获得用户基本信息（）
function getBaseUserInfo(uid) {
	var baseInfo;
	$.ajax({
		url: "com.ygc.product.ehall.business.service.getTeacherJBXX.getTeacherJBXX.biz.ext",
		type: 'POST',
		data: nui.encode({
			userid: uid
		}),
		cache: false,
		async: false,
		contentType: 'text/json',
		success: function(text) {
			baseInfo = text;
		}
	});
	return baseInfo;
}
//学生基本信息
function getStudentBaseUserInfo(uid) {
	var baseInfo;
	$.ajax({
		url: "com.ygc.product.ehall.business.getStudentInfo.getXSJBXX.biz.ext",
		type: 'POST',
		data: nui.encode({
			xh: uid
		}),
		cache: false,
		async: false,
		contentType: 'text/json',
		success: function(text) {
			//console.log(text);
			baseInfo = text;
		}
	});
	return baseInfo;
}
//一卡通余额
function getYKT(myGh) {
	$.ajax({
		type: 'POST',
		dataType: "JSON",
		url: 'com.csxy.getDatas.getDatas.getYiKaTong.biz.ext',
		data: {
			gh: myGh
		},
		async: false,
		success: function(text) {
			if(text.result != null || text.result != 0) {
				$("#xyk").text(isNull(text.result));
			}
		}
	});
}
/**
 *加载显示素质活动
 *uxh：学号,name：标签ID号
 */
function getShuziHuodong(uxh, name) {
	$.ajax({
		type: 'POST',
		dataType: "JSON",
		url: 'com.ygc.product.ehall.business.getStudentInfo.getXSHD.biz.ext',
		data: {
			xh: uxh
		},
		async: false,
		success: function(text) {
			var obj = text.data;
			//console.log(text);
			var htmls = "";
			var count = 0;
			for(var i = 0; i < obj.length; i++) {
				count = (+obj[i].CJ) + count;
				//htmls+='<tr><td>'+obj[i].XN+'</td><td>'+obj[i].HDMC+'</td><td>'+obj[i].CJ+'</td></tr>';
				htmls += '<li><a href="javascript:showBaseUiserInfo(\'' + obj[i].XN + '\',\'' + obj[i].HDMC + '\',\'' + obj[i].CJ + '\');">';
				htmls += '<div class="list-le"><font>' + obj[i].CJ + '</font><p>得分</p></div>';
				htmls += '<div class="list-rg">';
				htmls += '<p>学年：<font>' + obj[i].XN + '</font></p>';
				htmls += '<p class="tcrx-title">基础素质活动中心：<font>' + obj[i].HDMC + '</font></p>';
				htmls += '</div></a></li>';
			}
			$("#" + name).html(htmls).append('<li style="line-height: 1.6rem;font-size: .5rem;text-align: center;background: #fff;"><p style="background: linear-gradient(0deg,rgba(33,150,243,1) 0%, rgba(33,102,243,1) 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">你当前总得分为：'+ count +'</p></li>');
			
		}
	});
}
//自己写的弹窗内容更换
function AlertWirte(title, content) {
	$("#modifyTitle").text(title);
	$("#modifyTexCon").html(content);
}

/**
 *个人中心
 */
//加载课表信息
function loadPersonalKB(pObj, tbodyId) {
	$.ajax({
		url: "com.ygc.product.ehall.business.service.getTeacherKCB.getTeacherKCB.biz.ext",
		type: 'POST',
		data: nui.encode(pObj),
		cache: false,
		async: false,
		contentType: 'text/json',
		success: function(text) {
			var obj = text.data;
			//console.log(obj);
			for(var i = 0; i < obj.length; i++) {
				switch(obj[i].SKCD) {
					case 1:
						if(obj[i].SJD == 1 || obj[i].SJD == 3 || obj[i].SJD == 6 || obj[i].SJD == 8 || obj[i].SJD == 10) {
							var valueTd = document.getElementById(tbodyId).rows[obj[i].SJD - 1].cells[obj[i].XQJ];
							valueTd.innerHTML = '<div class="hover" onclick="showBaseUiserInfo(\'' + obj[i].KCMC + '\',\'' + obj[i].JSMC + '\')">' + obj[i].KCMC + '</div>';
						}
						break;
					case 2:
						if(obj[i].SJD == 1 || obj[i].SJD == 3 || obj[i].SJD == 6 || obj[i].SJD == 8 || obj[i].SJD == 10) {
							var valueTd = document.getElementById(tbodyId).rows[obj[i].SJD - 1].cells[obj[i].XQJ];
							var valueTd2 = document.getElementById(tbodyId).rows[obj[i].SJD];
							valueTd.innerHTML = '<div class="hover" onclick="showBaseUiserInfo(\'' + obj[i].KCMC + '\',\'' + obj[i].JSMC + '\')">' + obj[i].KCMC + '</div>';
							valueTd.rowSpan = 2;
							document.getElementById(tbodyId).rows[obj[i].SJD].removeChild(valueTd2.cells[Number(valueTd2.cells.length - 1)]);
						}
						break;
					case 3:
						if(obj[i].SJD == 1 || obj[i].SJD == 3 || obj[i].SJD == 6 || obj[i].SJD == 8 || obj[i].SJD == 10) {
							var valueTd = document.getElementById(tbodyId).rows[obj[i].SJD - 1].cells[obj[i].XQJ];
							var valueTd2 = document.getElementById(tbodyId).rows[obj[i].SJD].cells[obj[i].XQJ];
							var valueTd3 = document.getElementById(tbodyId).rows[obj[i].SJD + 1].cells[obj[i].XQJ];
							valueTd.innerHTML = '<div class="hover" onclick="showBaseUiserInfo(\'' + obj[i].KCMC + '\',\'' + obj[i].JSMC + '\')">' + obj[i].KCMC + '</div>';
							valueTd.rowSpan = 3;
							document.getElementById(tbodyId).rows[obj[i].SJD].removeChild(valueTd2.cells[Number(valueTd2.cells.length - 1)]);
							document.getElementById(tbodyId).rows[obj[i].SJD + 1].removeChild(valueTd3.cells[Number(valueTd3.cells.length - 1)]);
						}
				}

			}

		}
	});
}

//加载学生课表信息
function loadStudentPersonalKB(pObj, tbodyId) {
	$.ajax({
		url: "com.ygc.product.ehall.business.getStudentInfo.getXSKCB.biz.ext",
		type: 'POST',
		data: nui.encode(pObj),
		cache: false,
		async: false,
		contentType: 'text/json',
		success: function(text) {
			var obj = text.data;
			//console.log(obj);
			for(var i = 0; i < obj.length; i++) {
				switch(obj[i].SKCD) {
					case 1:
						if(obj[i].DJJ == 1 || obj[i].DJJ == 3 || obj[i].DJJ == 6 || obj[i].DJJ == 8 || obj[i].DJJ == 10) {
							var valueTd = document.getElementById(tbodyId).rows[obj[i].DJJ - 1].cells[obj[i].XQJ];
							valueTd.innerHTML = '<div class="hover" onclick="showBaseUiserInfo(\'' + obj[i].KCB + '\')">' + splitKCB2(obj[i].KCB) + '</div>';
						}
						break;
					case 2:
						if(obj[i].DJJ == 1 || obj[i].DJJ == 3 || obj[i].DJJ == 6 || obj[i].DJJ == 8 || obj[i].DJJ == 10) {
							var valueTd = document.getElementById(tbodyId).rows[obj[i].DJJ - 1].cells[obj[i].XQJ];
							var valueTd2 = document.getElementById(tbodyId).rows[obj[i].DJJ];
							valueTd.innerHTML = '<div class="hover" onclick="showBaseUiserInfo(\'' + obj[i].KCB + '\')">' + splitKCB2(obj[i].KCB) + '</div>';
							valueTd.rowSpan = 2;
							document.getElementById(tbodyId).rows[obj[i].DJJ].removeChild(valueTd2.cells[Number(valueTd2.cells.length - 1)]);
						}
						break;
					case 3:
						if(obj[i].DJJ == 1 || obj[i].DJJ == 3 || obj[i].DJJ == 6 || obj[i].DJJ == 8 || obj[i].DJJ == 10) {
							var valueTd = document.getElementById(tbodyId).rows[obj[i].DJJ - 1].cells[obj[i].XQJ];
							var valueTd2 = document.getElementById(tbodyId).rows[obj[i].DJJ];
							var valueTd3 = document.getElementById(tbodyId).rows[obj[i].DJJ + 1];
							valueTd.innerHTML = '<div class="hover" onclick="showBaseUiserInfo(\'' + obj[i].KCB + '\')">' + splitKCB2(obj[i].KCB) + '</div>';
							valueTd.rowSpan = 3;
							document.getElementById(tbodyId).rows[obj[i].DJJ].removeChild(valueTd2.cells[Number(valueTd2.cells.length - 1)]);
							document.getElementById(tbodyId).rows[obj[i].DJJ + 1].removeChild(valueTd3.cells[Number(valueTd3.cells.length - 1)]);
						}
				}

			}

		}
	});
}
//分割字符串
function splitKCB(obj) {
	var str = obj;
	var html = '';
	var arr = new Array();
	arr = str.split("<br>");
	//console.log(arr);
	for(var i = 0; i < arr.length; i++) {
		html += '<p>' + arr[i] + '</p>';
	}
	return html;
}
//分割字符串
function splitKCB2(obj) {
	var str = obj;
	var html = '';
	var arr = new Array();
	arr = str.split("<br>");
	//console.log(arr);
	html += '<p>' + arr[0] + '</p>';
	html += '<p>' + arr[2] + '</p>';
	html += '<p>' + arr[3] + '</p>';
	return html;
}

//获得当前学期学年
function getSchoolYearSemester() {
	var obj;
	$.ajax({
		type: 'POST',
		url: 'com.ygc.product.ehall.business.getStudentInfo.getDate.biz.ext',
		async: false,
		success: function(text) {
			obj = text;
			//console.log(obj);
		}
	});
	return obj;
}

//应用搜索
function getServerList(str) {
	console.log(str);
	$.ajax({
		type: 'POST',
		dataType: "JSON",
		url: 'com.ygc.product.ehall.dingding.service.queryService.queryService.biz.ext',
		data: {
			servicename: str
		},
		async: false,
		success: function(text) {
			var obj = text.data;
			var html = '';
			for(var i = 0; i < obj.length; i++) {
				if(obj[i].guideCode == null) {
					html += '<li><h3>' + obj[i].processChName + '</h3>';
					html += '<p>地点：' + isNull(obj[i].applyAddress) + '</p>';
					html += '<p>时间：' + isNull(nui.getDictText('SERVER_TIME_TYPE', obj[i].serviceTime)) + '</p>';
					html += '<p>事项类型：' + obj[i].guideType + '</p>';
					html += '<div class="transact"><a href="javascript:openNewUrl(\'http://dingding.zucc.edu.cn/default' + obj[i].onlineApplyPageUrl + '\',\'' + obj[i].processChName + '\');"><p>立刻办理</p></a></div></li>';
				} else {
					html += '<li><h3><span>' + obj[i].guideCode + '</span>' + obj[i].processChName + '</h3>';
					html += '<p>地点：' + isNull(obj[i].applyAddress) + '</p>';
					html += '<p>时间：' + isNull(nui.getDictText('SERVER_TIME_TYPE', obj[i].serviceTime)) + '</p>';
					html += '<p>事项类型：' + obj[i].guideType + '</p>';
					html += '<div class="transact"><a href="javascript:openNewUrl(\'http://dingding.zucc.edu.cn/default' + obj[i].onlineApplyPageUrl + '\',\'' + obj[i].processChName + '\');"><p>立刻办理</p></a></div></li>';
				}

			}

			$("#yyList").html(html);

		}
	});

}

//首页新闻订阅导航
function myDingyueNav(myCollectionID, userId, num) {
	var html = "";
	var dyObj = [];
	$.ajax({
		type: 'POST',
		contentType: "text/json",
		url: 'com.ygc.product.ehall.business.myDingYue.queryDingYue.biz.ext',
		data: nui.encode({
			userid: userId
		}),
		async: true,
		success: function(text) {
			dyObj = text.data;
			/* 	  console.log(text);
					console.log(dyObj); */
		},
		error: function(error) {
			dyObj = 0;
		}
	});
	html += '<li><a href="javascript:getNewsList('+ num +');">新闻动态</a></li>';
	// console.log(typeof (dyObj));
	if(typeof(dyObj) != "undefined" && dyObj.length == 0) {
		html += '<li><a href="javascript:getNewsList(3582);">教育教学</a></li>';
		html += '<li><a href="javascript:getNewsList(3583);">科学研究</a></li>';
		html += '<li><a href="javascript:getNewsList(4661);">院务管理</a></li>';
		html += '<li><a href="javascript:getNewsList(3542);">会议通知</a></li>';
		html += '<li><a href="javascript:getNewsList(3581);">其它通知</a></li>	';
	} else if(typeof(dyObj) == "undefined") {
		html += '<li><a href="javascript:getNewsList(3582);">教育教学</a></li>';
		html += '<li><a href="javascript:getNewsList(3583);">科学研究</a></li>';
		html += '<li><a href="javascript:getNewsList(4661);">院务管理</a></li>';
		html += '<li><a href="javascript:getNewsList(3542);">会议通知</a></li>';
		html += '<li><a href="javascript:getNewsList(3581);">其它通知</a></li>	';
	} else {
		if(dyObj[0].jyjx == 1) {
			html += '<li><a href="javascript:getNewsList(3582);">教育教学</a></li>';
		} else {
			html += '';
		}

		if(dyObj[0].kxyj == 1) {
			html += '<li><a href="javascript:getNewsList(3583);">科学研究</a></li>';
		} else {
			html += '';
		}

		if(dyObj[0].ywgl == 1) {
			html += '<li><a href="javascript:getNewsList(4661);">院务管理</a></li>';
		} else {
			html += '';
		}
		if(dyObj[0].hytz == 1) {
			html += '<li><a href="javascript:getNewsList(3542);">会议通知</a></li>';
		} else {
			html += '';
		}
		if(dyObj[0].qitz == 1) {
			html += '<li><a href="javascript:getNewsList(3581);">其它通知</a></li>';
		} else {
			html += '';
		}
	}
	$("#" + myCollectionID).html(html);
}
/**
 *数据字典
 */
//数据字典取值
function getDictTextWrite(key, value) {
	var getValue;
	$.ajax({
		type: 'POST',
		dataType: "JSON",
		url: 'com.ygc.product.ehall.business.getConst.getConst.biz.ext',
		data: {
			inid: key,
			resultid: value
		},
		async: false,
		success: function(text) {
			getValue = text.data;
			//console.log(getValue);
		}
	});
	return getValue;
}

//数据字典工具
var getDictTools = {
	//2019-03-26重写数据字典取值,把该方法放入getDictTools这个对象里面
	getDictTextWrite: function() {
		var getValue;
		$.ajax({
			type: 'POST',
			dataType: "JSON",
			url: 'com.ygc.product.ehall.business.getConst.getConst.biz.ext',
			data: {
				inid: key,
				resultid: vlaue
			},
			async: false,
			success: function(text) {
				getValue = text.data;
				//console.log(getValue);
			}
		});
		return getValue;
	},
	//根据数据字典类型ID获得数据字典列表
	getDictList: function(DictTypeId) {
		var getValue;
		$.ajax({
			url: "com.primeton.components.nui.DictLoader.getDictData.biz.ext",
			type: 'POST',
			async: false,
			data: nui.encode({
				dictTypeId: DictTypeId
			}),
			contentType: 'text/json',
			success: function(text) {
				getValue = text.dictList;
			}
		});
		return getValue;
	},
	//orgId :0为教师单位列表,其它为学生部门列表
	getApplydeptfullname: function(orgId) {
		var UList;
		if(orgId == 0) {
			$.ajax({
				url: "com.ygc.product.ehall.report_meeting.report_meeting.getOrgs.biz.ext",
				type: 'POST',
				async: false,
				contentType: 'text/json',
				success: function(text) {
					var str;
					var obj = text.orgs;
					str = '[';
					for(var i = 0; i < obj.length; i++) {
						str += '{id:\'' + obj[i].orgid + '\',value:\'' + obj[i].orgname + '\'},';
					}
					str += ']';
					UList = str;
				}
			});
		} else {
			$.ajax({
				url: "com.ygc.product.ehall.business.empService.queryStudentOrgs.biz.ext",
				type: 'POST',
				async: false,
				contentType: 'text/json',
				success: function(text) {
					var str;
					var obj = text.orgs;
					//console.log(obj);
					str = '[';
					for(var i = 0; i < obj.length; i++) {
						str += '{id:\'' + obj[i].dm + '\',value:\'' + obj[i].zzmc + '\'},';
					}
					str += ']';
					UList = str;
				}
			});
		}
		return UList;
	},
	//根据数据字典类型ID获得选择框数据
	getSelectArray: function(getDictTypeId) {
		var selectArr = getDictTools.getDictList(getDictTypeId);
		var str = "[";
		for(var i = 0; i < selectArr.length; i++) {
			if(i < selectArr.length) {
				str += "{id:'" + selectArr[i].dictID + "',value:'" + selectArr[i].dictName + "'},"
			} else {
				str += "{id:'" + selectArr[i].dictID + "',value:'" + selectArr[i].dictName + "'}"
			}
		}
		str += "]";
		return str;
	},
	/**
	 *传学生id号,获得下拉数据字典
	 */
	getXueNianList: function(uerId) {
		var str;
		$.ajax({
			url: "com.ygc.product.ehall.elobby.grade_review.grade_review.queryCourse.biz.ext",
			type: 'POST',
			async: false,
			contentType: 'text/json',
			success: function(text) {
				var obj = text.data;
				str = '[';
				for(var i = 0; i < obj.length; i++) {
					str += '{id:\'' + obj[i].courseCode + '\',value:\'' + obj[i].course + '\', childs:[{id:\'' + obj[i].teacherCode + '\',value:\'' + obj[i].teacher + '\'}]},';
				}
				str += ']';

			}
		});
		return str;
	},
	/**
	 *数据字典下拉点击事件
	 *obj:必传的几个参数名【selectId/selectTitle/dictTypeId/hiddeId/mobileSelectName】
	 */
	onClickSelectBtn: function(obj) {
		//console.log(obj);
		obj.mobileSelectName = new MobileSelect({
			trigger: '#' + obj.selectId + '',
			title: '' + obj.selectTitle + '',
			wheels: [{
				data: eval("(" + getDictTools.getSelectArray(obj.dictTypeId) + ")")
			}],
			transitionEnd: function(indexArr, data) {
				//console.log(data);
			},
			callback: function(indexArr, data) {
				$("#" + obj.selectId + "").html(data[0].value);
				nui.get(obj.hiddeId).setValue(data[0].id);
			}
		});
	},
	/**
	 *学校部门下拉菜单
	 *obj:必传的几个参数名【selectId/selectTitle/dictTypeId/hiddeId/mobileSelectName】
	 */
	onClickOrgSelectBtn: function(obj) {
		obj.mobileSelectName = new MobileSelect({
			trigger: '#' + obj.selectId + '',
			title: '' + obj.selectTitle + '',
			wheels: [{
				data: eval("(" + getDictTools.getApplydeptfullname(obj.dictTypeId) + ")")
			}],
			transitionEnd: function(indexArr, data) {
				//console.log(data);
			},
			callback: function(indexArr, data) {
				$("#" + obj.selectId + "").html(data[0].value);
				nui.get(obj.hiddeId).setValue(data[0].id);
			}
		});
	},
	/**
	 *学校部门下拉菜单
	 *obj:必传的几个参数名【selectId/selectTitle/dictTypeId/hiddeId/mobileSelectName/selectText】
	 *selectId：标签ID号
	 *selectTitle：选择框标题
	 *dictTypeId:0/1 0为教师单位列表，1为学生部门
	 *hiddeId:隐藏字段id号字段设置
	 *mobileSelectName:命名不能重重
	 *selectText:隐藏文本字段设置
	 */
	onClickOrgSelectBtn2: function(obj) {
		obj.mobileSelectName = new MobileSelect({
			trigger: '#' + obj.selectId + '',
			title: '' + obj.selectTitle + '',
			wheels: [{
				data: eval("(" + getDictTools.getApplydeptfullname(obj.dictTypeId) + ")")
			}],
			transitionEnd: function(indexArr, data) {
				//console.log(data);
			},
			callback: function(indexArr, data) {
				$("#" + obj.selectId + "").html(data[0].value);
				nui.get(obj.hiddeId).setValue(data[0].id);
				nui.get(obj.selectText).setValue(data[0].value);
			}
		});
	},
	/**
	 *课程列表获得
	 *传一个对像obj：【selectId,selectTitle,userId,courseCode,teacher,teacherCode,mobileName】
	 *courseCode：设置隐藏的课程id号
	 *teacher:设置显示老师名称的标签ID号
	 *teacherCode：设置隐藏的老师用户的id号
	 *selectId:选择框点击的ID号
	 *selectTitle:设置选择框标题
	 *mobileName:设置名称，重复调用名称不能设置相同
	 */
	getCourseList: function(obj) {
		obj.mobileSelectName = new MobileSelect({
			trigger: '#' + obj.selectId + '',
			title: '' + obj.selectTitle + '',
			wheels: [{
				data: eval("(" + getDictTools.getXueNianList() + ")")
			}],
			transitionEnd: function(indexArr, data) {
				//console.log(data);
			},
			callback: function(indexArr, data) {
				$("#" + obj.selectId).html(data[0].value);
				nui.get(obj.courseCode).setValue(data[0].id);
				$("#" + obj.teacher).val(data[1].value);
				nui.get(obj.teacherCode).setValue(data[1].id);
			}
		});
	}
}
//数据下拉事件调用方法
function onClickBtn(selectIds, selectTitle, dictTypeId, hiddeId, mobileSelectName) {
	var sbtnObj = {};
	sbtnObj.selectId = selectIds;
	sbtnObj.selectTitle = selectTitle;
	sbtnObj.dictTypeId = dictTypeId;
	sbtnObj.hiddeId = hiddeId;
	sbtnObj.mobileSelectName = mobileSelectName;
	//console.log(sbtnObj);
	getDictTools.onClickSelectBtn(sbtnObj);
}
//学校部门
function onClickOrgBtn(selectIds, selectTitle, orgId, hiddeId, mobileSelectName) {
	var sbtnObj = {};
	sbtnObj.selectId = selectIds;
	sbtnObj.selectTitle = selectTitle;
	sbtnObj.dictTypeId = orgId;
	sbtnObj.hiddeId = hiddeId;
	sbtnObj.mobileSelectName = mobileSelectName;
	//console.log(sbtnObj);
	getDictTools.onClickOrgSelectBtn(sbtnObj);
}
//学校部门2
function onClickOrgBtn2(selectIds, selectTitle, orgId, hiddeId, mobileSelectName, selectTextName) {
	var sbtnObj = {};
	sbtnObj.selectId = selectIds;
	sbtnObj.selectTitle = selectTitle;
	sbtnObj.dictTypeId = orgId;
	sbtnObj.hiddeId = hiddeId;
	sbtnObj.mobileSelectName = mobileSelectName;
	sbtnObj.selectText = selectTextName;
	//console.log(sbtnObj);
	getDictTools.onClickOrgSelectBtn2(sbtnObj);
}
//课程列表获得
function getCourseList(course, courseCode, teacher, teacherCode, selectId, selectTitle, mobileName) {
	var couObj = {};
	couObj.course = course;
	couObj.courseCode = courseCode;
	couObj.teacher = teacher;
	couObj.teacherCode = teacherCode;
	couObj.selectId = course;
	couObj.selectTitle = selectTitle;
	couObj.mobileName = mobileName;
	getDictTools.getCourseList(couObj);
}

/**
 *js验证机制 -开始
 */
var Verifil = {
	//是否是中文
	isChinese: function(obj) {
		var reg = /^[\u0391-\uFFE5]+$/;
		if(obj != "" && !reg.test(obj)) {
			//console.log('必须输入中文！');
			return false;
		} else {
			return true;
		}
	},
	//验证只能是字母
	checkEn: function(obj) {
		var zmReg = /^[a-zA-Z]*$/;
		if(obj != "" && zmReg.test(obj)) {
			//console.log("只能是英文字母！");
			return true;
		} else {
			return false;
		}
	},
	//验证纯数字
	checkNumber: function(obj) {
		var zmReg = /^[0-9]+$/;
		if(obj != "" && zmReg.test(obj)) {
			//console.log("只能是英文字母！");
			return true;
		} else {
			return false;
		}
	},
	//检查是否是英文与数字
	checkEnOrNum: function(obj) {
		var zmnumReg = /^[0-9a-zA-Z]*$/;
		if(obj != "" && !zmnumReg.test(obj)) {
			//console.log("只能输入是字母或者数字,请重新输入");
			return false;
		} else {
			return true;
		}
	},
	//检查是否是邮箱
	checkEmail: function(obj) {
		var zmnumReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;;
		if(obj != "" && !zmnumReg.test(obj)) {
			//console.log("请重新输入");
			return false;
		} else {
			return true;
		}
	},
	//检查手机号
	checkMobile: function(obj) {
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
		if(obj.length == 0) {
			//console.log("手机号不能为空");
			return false;
		} else if(obj.length != 11) {
			//console.log("手机号不为11");
			return false;
		} else if(!myreg.test(obj)) {
			//console.log('请输入有效的手机号码！'); 
			return false;
		} else {
			return true;
		}
	},
	//检查是否为空
	IsNoNull: function(obj) {
		if(obj == null || obj == "") {
			//console.log("输入字符不能为空");
			return false;
		} else {
			return true;
		}
	},
	isfixedphone: function(str) {
		/**
		 *
		 * @desctition:规则->区号3-4位，
		 *号码7-8位,可以有分机号，
		 *分机号为3-4为，
		 *格式如下："0775-85333333-123"
		 * 
		 */
		var pattern = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
		return pattern.test(str);
	},
	//检查身份证号
	checkIdCard: function(num) {
		num = num.toUpperCase();
		var cityCode = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外 "
		};
		if(!cityCode[num.substr(0, 2)]) {
			//console.log("地址编码错误");
			return false;
		}
		//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
		if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
			//alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
			return false;
		}
		//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
		//下面分别分析出生日期和校验位
		var len, re;
		len = num.length;
		if(len == 15) {
			re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
			var arrSplit = num.match(re);

			//检查生日日期是否正确
			var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
			var bGoodDay;
			bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
			if(!bGoodDay) {
				//alert('输入的身份证号里出生日期不对！');
				return false;
			} else {
				//将15位身份证转成18位
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
				var nTemp = 0,
					k;
				num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
				for(k = 0; k < 17; k++) {
					nTemp += num.substr(k, 1) * arrInt[k];
				}
				num += arrCh[nTemp % 11];
				return true;
			}
		}
		if(len == 18) {
			re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
			var arrSplit = num.match(re);

			//检查生日日期是否正确
			var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
			var bGoodDay;
			bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
			if(!bGoodDay) {
				//alert(dtmBirth.getYear());
				//alert(arrSplit[2]);
				//alert('输入的身份证号里出生日期不对！');
				return false;
			} else {
				//检验18位身份证的校验码是否正确。
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				var valnum;
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
				var nTemp = 0,
					k;
				for(k = 0; k < 17; k++) {
					nTemp += num.substr(k, 1) * arrInt[k];
				}
				valnum = arrCh[nTemp % 11];
				if(valnum != num.substr(17, 1)) {
					//alert('18位身份证的校验码不正确！应该为：' + valnum);
					return false;
				}
				return true;
			}
		}
		return false;
	},
	//检查URL正确性
	checkURL: function(obj) {
		// var zmnumReg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/;
		var zmnumReg = /(http|https):\/\/([\w.]+\/?)\S*/;
		if(obj != "" && zmnumReg.test(obj)) {
			//console.log("请重新输入正确的URL");
			return true;
		} else {
			return false;
		}
	},

	//检查手机号与座机号
	checkMobilePhone: function(mobile) {
		var tel = /^0\d{8}$/;
		var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if(mobile.length == 11) { //手机号码
			if(phone.test(mobile)) {
				// console.log(mobile);
				return true;
			}
		} else if(mobile.length == 13 && mobile.indexOf("-") != -1) { //电话号码
			if(tel.test(mobile)) {
				// console.log(mobile);
				return true;
			}
		}
		return false;
	},
	//验证非负整数
	checkNegativeNumber: function(number) {
		var zmReg = /^\d+$/;
		if(number != "" && !zmReg.test(number)) {
			//console.log("只能是英文字母！");
			return false;
		} else {
			return true;
		}
	}

};
/**
 *js验证机制 -结束
 */

/**
 *流程信息公共方法
 */

function bntsubmit() {
	$("#submitTj").show();
}
//注意事项打开
var modelTop = 0;
$(document).scroll(function() {
	modelTop = $("html,body").scrollTop();
})

function submitBh(textType, numType) {
	$("#submitBh").show();
	$('html, body').scrollTop(modelTop).css({
		'height': '100%',
		'overflow': 'hidden'
	});
	$(".popup[data-type=" + textType + "]").show();
	numType ? "" : $(".popup[data-type=examinePopup]").attr("data-numType", numType);
}

//注意事项关闭
function closeBtn(that) {
	$("#submitTj").hide();
	$("#submitBh").hide();
	$('html, body').removeAttr("style");
	$(that).parents(".popup").hide();
	modelTop = 0;
}

//两个日期的差值(d1 - d2).
function DateDiff(d1, d2) {
	var day = 24 * 60 * 60 * 1000;
	try {
		var dateObj = new Date(d1);
		var dateTime = dateObj.getTime();
		var dateObj2 = new Date(d2);
		var dateTime2 = dateObj2.getTime();
		var cha = (dateTime - dateTime2) / day;
		return cha;
	} catch(e) {
		return false;
	}
}

//js日期加天数
function addDate(date, days) {
	var d = new Date(date);
	d.setDate(d.getDate() + days);
	var m = d.getMonth() + 1;
	return d.getFullYear() + '-' + m + '-' + d.getDate();
}
//js日期减年数
function reduceYearDate(date, years) {
	var d = new Date(date);
	var m = d.getMonth() + 1;
	return Number(d.getFullYear() - years) + '-' + m + '-' + d.getDate();
}

//开始时间
function formatSDate() {
	var date = new Date();
	var year = date.getFullYear(),
		month = date.getMonth() + 1, //月份是从0开始的
		day = date.getDate(),
		hour = date.getHours(),
		min = date.getMinutes(),
		sec = date.getSeconds();
	var newTime = year + '-' + month + '-' + day;
	return newTime;
}
//结束时间
function formatEDate() {
	var date = new Date();
	var year = Number(date.getFullYear()) + 4,
		month = 12, //月份是从0开始的
		day = getLastDay(new Date(year, month, 0)),
		hour = date.getHours(),
		min = date.getMinutes(),
		sec = date.getSeconds();
	var newTime = year + '-' + month + '-' + day;
	return newTime;
}
//开始时间（）
//月份最后一天
function getLastDay(time) {
	var date = new Date(time);
	day = date.getDate();
	return day;
}
//格式化时间字符串
function GSHDate(time) {
	var times;
	if(time === null) {
		return;
	}
	if(time.indexOf("T") === -1) {
		times = time;
	} else {
		times = time.replace("T", " ");
	}
	var starttime = times.replace(new RegExp("-", "gm"), "/");
	var starttimeHaoMiao = (new Date(starttime)).getTime(); //得到毫秒数
	var newTime = new Date(starttimeHaoMiao);
	var year = newTime.getFullYear(),
		month = newTime.getMonth() + 1, //月份是从0开始的
		day = newTime.getDate()
	var newTimes = year + '-' + month + '-' + day;
	return newTimes;
}
//格式化时间字符串返回 时分
function GSHDateHMS(time) {
	var times;
	if(time === null) {
		return;
	}
	if(time.indexOf("T") === -1) {
		times = time;
	} else {
		times = time.replace("T", " ");
	}
	var starttime = times.replace(new RegExp("-", "gm"), "/");
	var starttimeHaoMiao = (new Date(starttime)).getTime(); //得到毫秒数
	var newTime = new Date(starttimeHaoMiao);
	var year = newTime.getFullYear(),
		month = newTime.getMonth() + 1, //月份是从0开始的
		day = newTime.getDate(),
		hour = newTime.getHours(),
		min = newTime.getMinutes(),
		sec = newTime.getSeconds();
	var newTimes = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
	return newTimes;
}

/*审核页面选择驳回环节,注意添加mobileSelect.js与mobileSelect.css两个文件*/
function getReject(workItemIds) {
	//判断workItemIds是否有值
	if(workItemIds == undefined || workItemIds == null) {
		return;
	}
	var data = {
		"activityName": "",
		workItemId: workItemIds
	};
	$.ajax({
		url: "com.primeton.bps.process.process.getPreviousActivities.biz.ext",
		type: "POST",
		cache: false,
		data: nui.encode(data),
		contentType: 'text/json',
		success: function(text) {
			var dataArr = text.data;
			if(dataArr.length > 0) {
				var mobileSelectReject = new MobileSelect({
					trigger: '#selectReject',
					title: '选择驳回环节',
					wheels: [{
						data: dataArr
					}],
					keyMap: {
						id: "activitydefid",
						value: "activityinstname",
						childs: "childs"
					}, //字段名映射，当后台返回的数据格式，字段名字与插件不一样时，可以替换）
					callback: function(indexArr, data) {
						rejectData = {
							activitydefid: data[0].activitydefid
						};
					}
				});
			}
		}
	})
}

/*processInstId(传流程实例ID)*/
function loadApproval(processInstIds) {
	//判断processInstIds是否有值
	if(processInstIds == undefined || processInstIds == null) {
		return;
	}

	var param = {
		"processInstId": processInstIds
	};
	var html = "";
	$.ajax({
		url: "com.primeton.bps.process.process.getOpinions.biz.ext",
		type: "POST",
		cache: false,
		data: nui.encode(param),
		contentType: 'text/json',
		success: function(text) {
			var obj = text.data;
			// console.log(text)
			// var obj = eval('(' + data + ')');
			for(var i = 0; i < obj.length; i++) {
				if(i < obj.length - 1) {
					html += '<li><div class="line"></div><h3>' + obj[i].activityName + '</h3><div class="opinion_p_div"><span>审核意见</span><p>' + obj[i].opinionContent + '</p></div>';
					html += '<div><span>办理部门</span><p>' + obj[i].deptName + '</p></div>';
					html += '<div><span>审批人</span><p>' + obj[i].userName + '</p></div>';
					html += '<div class="opinion_bo"><span>办理时间</span><p>' + obj[i].opinionTime + '</p></div></li>';
				} else {
					html += '<li class="active"><h3>' + obj[i].activityName + '</h3><div class="opinion_p_div"><span>审核意见</span><p>' + obj[i].opinionContent + '</p></div>';
					html += '<div><span>办理部门</span><p>' + obj[i].deptName + '</p></div>';
					html += '<div><span>审批人</span><p>' + obj[i].userName + '</p></div>';
					html += '<div class="opinion_bo"><span>办理时间</span><p>' + obj[i].opinionTime + '</p></div></li>';
				}
			}
			$('.opinion_p ul').html(html);
			if(obj.length - 1 < 0) {
				$("#filesID").hide();
			} else {
				$("#filesID").show();
			}
		}
	});
}

/*上传文件 注引用入layui.js与layui.css*/
var uploadFiles = [];
var uploadFilesNum = null;
function onloadFileList() {
	layui.use(['form', 'table', 'layedit', 'laydate', 'upload'], function() {
		var form = layui.form;
		var laydate = layui.laydate;
		var upload = layui.upload;
		var attachmentBodyView = $('#attachmentBody');
		var files;
		var uploadInst = upload.render({
			elem: '#selectAttachment',
			url: '/default/system/fileupload?type=06',
			accept: 'file',
			multiple: true,
			auto: true,
			choose: function(obj) {},
			done: function(res, index, upload) {
				var uploadFile = {};
				uploadFile.attachmentAddress = res[0].documentFilePath;
				uploadFile.attachmentName = res[0].documentName;
				uploadFile.attachmentContent = res[0].documentName;
				uploadFile.index = index;
				//uploadFilesObj=uploadFile;
				uploadFiles.push(uploadFile);
				var fileInfo = $(['<li id="upload-' + index + '"><div class="title">' + res[0].documentName + '</div><div class="load-files-ct"><a class="demo-delete" style="cursor: pointer;"><img src="/default/dingding/DD/img/ico_del.png" /></a></div></li>'].join(''));
				fileInfo.find('.demo-delete').on('click', function() {
					for(var i = 0; i < uploadFiles.length; i++) {
						var uploadFile = uploadFiles[i];
						if(uploadFile.index == index) {
							deleteFile = uploadFile;
							var param = {
								"url": uploadFile.attactmentFileUrl
							};
							var jsonParam = JSON.stringify(param);
							uploadFiles.remove(deleteFile);
							$.ajax({
								url: "com.ygc.product.ehall.elobby.paper.document.deleteTempFile.biz.ext",
								type: 'POST',
								data: jsonParam,
								async: false,
								cache: false,
								contentType: 'text/json',
								success: function(text) {
									fileInfo.remove();				
									uploadFilesNum = attachmentBodyView.find('li').length;
								}
							});
						}
					}
				});
				attachmentBodyView.append(fileInfo);
				uploadFilesNum = attachmentBodyView.find('li').length;
			}
		});
	});
	//移除文件
	Array.prototype.remove = function(obj) {
		for(var i = 0; i < this.length; i++) {
			var temp = this[i];
			if(!isNaN(obj)) {
				temp = i;
			}
			if(temp == obj) {
				for(var j = i; j < this.length; j++) {
					this[j] = this[j + 1];
				}
				this.length = this.length - 1;
			}
		}
	};

}
/**
 *加载文件方法带删除方法
 *processInstId(传流程实例ID)
 *ApprovalListID(传tbody或是table表格的ID号)
 */
function loadFiles_unstudent_check(processInstIds, ApprovalListID) {
	//判断processInstIds是否有值
	if(processInstIds == undefined || processInstIds == null) {
		return;
	}
	var ALID = document.getElementById(ApprovalListID);
	var html = "";
	var param = {
		"processInstId": processInstIds
	};
	$.ajax({
		url: "com.ygc.product.ehall.getFiles.getFiles.getFile.biz.ext",
		type: "POST",
		cache: false,
		data: nui.encode(param),
		contentType: 'text/json',
		dataType: "json",
		success: function(text) {
			var obj = text.data;
			// var obj = eval('(' + data + ')');
			if(obj.length > 0) {
				for(var i = 0; i < obj.length; i++) {
					html += '<li id="tab' + i + '"><div class="title">' + obj[i].attachmentName + '</div><div class="load-files-ct"><a onclick=deleteFile(\"' + obj[i].attachmentAddress + '\",\"tab' + i + '\")><img class="del"  src="/default/dingding/DD/img/ico_del.png" /></a><a href=\"/default' + obj[i].attachmentAddress + '\" download="' + obj[i].attachmentName + '"><img class="download" src="/default/dingding/DD/img/ico_down.png"/></a></li>';
				}
				ALID.innerHTML = html;
				uploadFilesNum = $(ALID).find('li').length;
				if(obj.length - 1 < 0) {
					$("#filesID2").hide();
				} else {
					$("#filesID2").show();
				}
			}
		}
	});
}
/**
 *加载文件方法带无删除方法
 *processInstId(传流程实例ID)
 *ApprovalListID(传tbody或是table表格的ID号)
 */
function loadFiles(processInstIds, ApprovalListID) {
	//判断processInstIds是否有值
	if(processInstIds == undefined || processInstIds == null) {
		return;
	}
	var ALID = document.getElementById(ApprovalListID);
	var html = "";
	var param = {
		"processInstId": processInstIds
	};
	$.ajax({
		url: "com.ygc.product.ehall.getFiles.getFiles.getFile.biz.ext",
		type: "POST",
		cache: false,
		data: nui.encode(param),
		contentType: 'text/json',
		success: function(text) {
			var obj = text.data;
			// var obj = eval('(' + data + ')');
			if(obj.length > 0) {
				for(var i = 0; i < obj.length; i++) {
					html += '<li id="tab' + i + '"><div class="title">' + obj[i].attachmentName + '</div><div class="load-files-ct"><a href=\"/default' + obj[i].attachmentAddress + '\" download="' + obj[i].attachmentName + '"><img class="download" src="/default/dingding/DD/img/ico_down.png"/></a></div></li>';
				}
				ALID.innerHTML = html;
				uploadFilesNum = $(ALID).find('li').length;
				if(obj.length - 1 < 0) {
					$("#filesID2").hide();
				} else {
					$("#filesID2").show();
				}
			}
		}
	});
}
//删除文件方法
function deleteFile(fileurl, my) {
	var data = {
		data: fileurl
	};
	$.ajax({
		url: "com.ygc.product.ehall.getFiles.getFiles.deleteTempFile.biz.ext",
		type: "POST",
		cache: false,
		data: nui.encode(data),
		contentType: 'text/json',
		success: function(text) {
			$("#" + my + "").remove();
		}
	});
}
//修改申请人联系电话
function updateTel(type) {
	var telVal = $("#upTel").val();
	if(!Verifil.checkMobile(telVal)) {
		DDAlert("请输入正确的手机号");
		return;
	}
	$("#tel").val(telVal);
	$(".popup[data-type=" + type + "]").hide();
	$('html, body').removeAttr("style");
	dd.ready(function() {
		dd.device.notification.alert({
			message: "修改成功",
			title: "提示", //可传空
			buttonName: "确定",
			onSuccess: function() {},
			onFail: function(err) {}
		});
	});
}
//selectMobile根据需要再封装函数
function MobileSelectFun() {}

MobileSelectFun.prototype = {
	obj: {},
	/***
	 * 固定“是/否”下拉菜单函数
	 * 
	 * trigger：mobileSelect插件作用的dom元素
	 * title：mobileSelect插件的标题
	 * mobileSelectCallBack：接受用户下拉选择后的callBack回调
	 */
	selectFixedOption: function() {
		new MobileSelect({
			trigger: this.obj.trigger,
			title: this.obj.title,
			wheels: [{
				data: this.obj.weels
			}],
			callback: MobileSelectCallBackt[this.obj.mobileSelectCallBack]
		});
	},
	/**
	 * 单轮子带一层数据获取下拉菜单函数
	 * 
	 * trigger：为mobileSelect插件定义元素位置
	 * title：为mobileSelect插件定义相应的title
	 * id：对应下拉菜单接口获取的id字段
	 * value: 对应下拉菜单接口获取的value字段
	 * childs: 对应下拉菜单接口获取的childs字段
	 * json：执行下拉菜单数据获取的ajax传递相应的字段
	 * textSuccess: ajaj回调的数据字段
	 * mobileSelectCallBack：选中下拉数据后执行的回调
	 * url：获取下拉菜单数据的接口
	 */
	setSelect: function() {
		var that = this;
		$.ajax({
			url: that.obj.url,
			type: "POST",
			dataType: "json",
			data: that.obj.json,
			async: false,
			success: function(text) {
				console.log(text)
				//$.isEmptyObject,判断非空对象（{}），如是空对象，则返回true
				if(!$.isEmptyObject(text)) {
					var dataArr = text[that.obj.textSuccess];
					new MobileSelect({
						trigger: that.obj.trigger,
						title: that.obj.title,
						keyMap: {
							id: that.obj.id,
							value: that.obj.value,
							childs: that.obj.childs
						}, //字段名映射，当后台返回的数据格式，字段名字与插件不一样时，可以替换）
						wheels: [{
							data: dataArr
						}],
						callback: MobileSelectCallBackt[that.obj.mobileSelectCallBack]
					});
				}
			}
		});
	},
	/***
	 * 双轮子数据获取下拉菜单函数
	 * 
	 * trigger：mobileSelect插件作用的dom元素
	 * title：mobileSelect插件的标题
	 * oneAjaxUrl：第一个ajax接口
	 * oneAjaxSuccData：第一个ajax请求成功返回的数据字段名;
	 * oneFieldId：第一个ajax返回的数据的id字段名
	 * oneFieldValue：第一个ajax返回的数据的value字段名
	 * twoAjaxUrl：第二个ajax接口
	 * twoAjaxParameter：第一个ajax传递给第二个ajax所需数据的字段名
	 * twoAjaxSuccData：第二个ajax请求成功返回的数据字段名;
	 * twoFieldId：第二个ajax返回的数据的id字段名
	 * twoFieldValue：第二个ajax返回的数据的value字段名
	 * mobileSelectCallBack：接受用户下拉选择后的callBack回调
	 */
	getCompanyUser: function() {
		var that = this;
		$.ajax({
			dataType: 'json',
			url: that.obj.oneAjaxUrl,
			cache: false,
			async: false, //这里选择异步为false，那么这个程序执行到这里的时候会暂停，等待
			success: function(data) {
				if(!$.isEmptyObject(data)) {
					var dataArr = data[that.obj.oneAjaxSuccData];
					var mobileSelectArr = [];
					$.each(dataArr, function(index, data) {
						$.ajax({
							dataType: 'json',
							url: that.obj.twoAjaxUrl,
							data: {
								orgid: data[that.obj.twoAjaxParameter]
							},
							cache: false,
							async: false,
							success: function(res) {
								if(!$.isEmptyObject(res)) {
									var dataToArr = res[that.obj.twoAjaxSuccData];
									var childsArr = [];
									$.each(dataToArr, function(index, data) {
										var childsObj = {
											id: data[that.obj.twoFieldId],
											value: data[that.obj.twoFieldValue]
										};
										childsArr.push(childsObj);
									});
									var mobileSelectObj = {
										id: data[that.obj.oneFieldId],
										value: data[that.obj.oneFieldValue],
										childs: childsArr
									};
									mobileSelectArr.push(mobileSelectObj);
								}
							}
						});
					});
					new MobileSelect({
						trigger: that.obj.trigger,
						title: that.obj.title,
						wheels: [{
							data: mobileSelectArr
						}],
						triggerDisplayData: false, //不添加选中的内容到trigger元素上
						callback: MobileSelectCallBackt[that.obj.mobileSelectCallBack]
					});
				}
			}
		});
	}
};

function loopMobileSelect(dataArr, id, value, sucData) {
	var result = "";
	$.each(dataArr, function(index, data) {
		if(data[id] === sucData) {
			result = dataArr[index][value];
		}
	});
	return result;
}
//textarea获取焦点时显示说明（有说明的时候展示）
function showExplain(fn) {
	var $fn = $(fn);
	if($fn.is(":focus")) {
		$fn.next().slideDown();
	} else {
		$fn.next().slideUp();
	}
}
//loading 动画
var loadingAnimation= {
	open: function(msg) {
		var loading = document.getElementsByClassName('loading')[0];
		//判断弹窗是否存在，如果存在，则消除，防止多个弹窗出现
		if (loading) {
			loadingAnimation.close();
		}
		var strElem = '<div class="loading" style="position: fixed;top: 0;right: 0;bottom: 0;left:0;margin: auto;z-index: 99999999;background: #000;opacity: .6;">'
						+'<div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-size: 0;">'
							+'<canvas id="loadingCanvas" style="display: inline-block;width: 100px;"></canvas>'
							+'<p style="color:#fff;text-align: center;margin: 0;padding: 0;display: inline-block;height: 50px;line-height: 50px;vertical-align: top;font-size: 14px;">'+ msg +'</p>'
				        +'</div>'
				    +'</div>';
	    $('body').append(strElem);
		var loadingT = document.getElementsByClassName('loading')[0];
		//阻止弹窗显示之后，用户滑动屏幕，内容跟着滚动，阻止移动的端的默认滑动事件
		loadingT.addEventListener('touchmove', function (event) {
            event.preventDefault();
    	}, false);
	    (function() {
	    	var canvas = document.getElementById("loadingCanvas"),
            ctx = canvas.getContext("2d"),
            w = canvas.width,
            h = canvas.height,
            x = w/2,
            y = h/2,
            radius = 50;
            ctx.fillStyle = "#000";
            ctx.fillRect(0,0,w,h);

            var r = [6,7,7.5,8,9,10];
            var angle = [10,25,45,65,90,120];
            var alpha = [0.25,0.35,0.45,0.65,0.8,1];
            var x1=[],y1=[];

            (function setIntervals() {
                ctx.fillStyle = "#000";
                ctx.fillRect(0,0,w,h);
                x1 = [];
                y1 = [];
                for(var i = 0; i < r.length; i ++){
                    if(angle[i] >= 360) angle[i] = 0;
                    ctx.beginPath();
                    ctx.font = "1rem sans-serif";
                    ctx.fillStyle = "rgba(72,216,252,"+alpha[i]+")";
                    x1.push( x + radius*Math.cos(angle[i]*Math.PI/180));
                    y1.push( y + radius*Math.sin(angle[i]*Math.PI/180));
                    ctx.arc(x1[i],y1[i],r[i],0,2*Math.PI, true);
                    ctx.closePath();
                    ctx.fill();
                    angle[i] += 6;
                }
                setTimeout(setIntervals, 25);
            })();
	    })()
	},
	close: function() {
		var body = document.getElementsByTagName('body')[0];
		var loading = document.getElementsByClassName('loading')[0];
		body.removeChild(loading);
	}
}
//获取url后面的参数
function GetRequest() {
   var url = location.search; //获取url中"?"符后的字串  
   var theRequest = new Object();  
   if (url.indexOf("?") != -1) {  
      var str = url.substr(1);  
      strs = str.split("&");  
      for(var i = 0; i < strs.length; i ++) {  
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
      }  
   }  
   return theRequest;  
} 
// 判断是否含有大写字母
function hasCapital(str) {
    var result = str.match(/^.*[A-Z]+.*$/);
    if(result==null) return false;
    return true;
}

// 判断是否含有小写字母
function hasLowercase(str) {
    var result = str.match(/^.*[a-z]+.*$/);
    if(result==null) return false;
    return true;
}

/**
 * 获取数组对象中时间离当前最近最近的对象下标
  * <param>timeArr</param> —— Array —— 数组对象[{}]
  * <param>key</param> —— String —— 数组对象中需要用来比较时间的key
  *
*/
function latelyDate(timeArr, key) {
	var timestamp = Date.now();
	var min;
	var index = 0;
	timeArr.forEach(function(item, i) {
		var itemStamp = new Date(item[key]).getTime();
		var interVal = Math.abs(timestamp - itemStamp);
		if (min == void 0) { min = interVal } else {
			if (min > interVal) {
				min = interVal;
				index = i;
			}
		}
	})
	return index;
}