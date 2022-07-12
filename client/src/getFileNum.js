/*
 * @Author: 韦永愿 1638877065@qq.com
 * @Date: 2022-07-11 15:31:14
 * @LastEditors: 韦永愿 1638877065@qq.com
 * @LastEditTime: 2022-07-11 16:17:54
 * @FilePath: \webide\src\getFileNum.js
 * @Description: 
 * Copyright (c) 2022 by 韦永愿 email: 1638877065@qq.com, All Rights Reserved.
 */
const fs = require('fs');
const path = require('path');

var dirMap = {};

function processDir(dirPath,fileInf) {
    console.log("路径",dirPath)
    const list = fs.readdirSync(dirPath);
    console.log("文件",list)
    list.forEach(itemPath => {
        const fullPath = path.join(dirPath, itemPath);
        const fileStat = fs.statSync(fullPath);
        const isFile = fileStat.isFile();
        if (isFile) {
            fileInf[0]++;
			fileInf[1] += fs.statSync(fullPath).size;
        } else {
            fileInf[0] += processDir(fullPath,[0,0])[0];
			fileInf[1] += processDir(fullPath,[0,0])[1];
        }
    });
	dirMap[dirPath] = '文件数：' + fileInf[0] + '，文件大小：' + (fileInf[1] / 1024 / 1024).toFixed(2) + 'M';
	return fileInf;
}

function judgeIsJsFile(fileName) {
    const jsReg = /(.*)(\.js)$/g;
    return jsReg.test(fileName);
}

function renameJsToTs(fileName) {
    const jsReg = /(.*)(\.js)$/g;
    return fileName.replace(jsReg, ($$, $1, $2) => $1 + '.ts');
}
function getFileAttr(path){
	fs.statSync(path,function(err,stats){
		//    获取文件的大小；
		console.log('获取文件的大小',stats.size);
		//    获取文件最后一次访问的时间
		console.log('获取文件最后一次访问的时间',stats.atime.toLocaleString());
		//    文件创建的时间；
		console.log('文件创建的时间',stats.birthtime.toLocaleString());
		//    文件最后一次修改时间
		console.log('文件最后一次修改时间',stats.mtime.toLocaleString());
		//    状态发生变化的时间；
		console.log('状态发生变化的时间',stats.ctime.toLocaleString())
		//判断是否是文件；是返回true；不是返回false；
		console.log('判断是否是文件',stats.isFile())
		//    判断是否是目录；是返回true、不是返回false；
		console.log('判断是否是目录',stats.isDirectory())
	})
}
const basepath = '../';
console.log('获取中，请稍后……');
processDir(basepath,[0,0]);
let showDir = ["broadband-flow","business","group-customer","guangdong-network-cloud","network-app"];
for(let k in showDir){
	console.log(showDir[k] + ':' + dirMap[showDir[k]]);
}