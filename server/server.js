const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use((request, response, next) => {
    response.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': request.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    });
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/file", (request, response) => {
    response.setHeader('Content-Type', 'text/html');
    let basepath = "../"; //解析目录路径
    let filterFile = ["node_modules", "\\.+.*", "yarn.lock"]; //过滤文件名，使用，隔开
    let stopFloor = 10; //遍历层数
    let generatePath = `./log/${new Date().getTime()}.txt`; //生成文件路径
    let isFullPath = true; //是否输出完整路径

    // 输出文件路径
    function getPartPath(dirPath) {
        let base = basepath.split(/\/|\\/g);
        dirPath = dirPath.split(/\/|\\/g);
        while (base.length && dirPath.length && base[0] === dirPath[0]) {
            base.shift();
            dirPath.shift();
        }
        return dirPath.join("/");
    }

    function isFilterPath(item) {
        for (let i = 0; i < filterFile.length; i++) {
            let reg = filterFile[i];
            if (item.match(reg) && item.match(reg)[0] === item) return true;
        }
        return false;
    }

    function processDir(dirPath, dirTree = [], floor = 1) {
        if (floor > stopFloor) return;
        let list = fs.readdirSync(dirPath);
        list = list.filter((item) => {
            return !isFilterPath(item);
        });

        list.forEach((itemPath) => {
            const fullPath = path.join(dirPath, itemPath);
            const fileStat = fs.statSync(fullPath);
            const isFile = fileStat.isFile();//判断是否是文件
            const isDirectory = fileStat.isDirectory(); // 判断是否是文件夹
            const dir = {
                label: isFullPath ? getPartPath(fullPath) : itemPath,
                name: itemPath,
                isFile: isFile, // 是否是文件
                isDirectory: isDirectory // 是否是目录
            };
            if (isDirectory) {
                dir.children = processDir(fullPath, [], floor + 1);
            }

            dirTree.push(dir);
        });
        return dirTree;
    }

    let dirTree = [];
    dirTree = processDir(basepath, dirTree);
    let fileTree = '';

    function consoleTree(tree, floor = 1, str = "", adder = "───", isLast = false) {
        str += adder;
        for (let i = 0; i < tree.length; i++) {
            if (floor === 1 && i === 0) {
                fileTree += "\n" + "┌" + str + tree[i].name;
            } else if (
                (isLast || floor === 1) &&
                i === tree.length - 1 &&
                !tree[i].children
            ) {
                fileTree += "\n" + "└" + str + tree[i].name;
            } else {
                fileTree += "\n" + "├" + str + tree[i].name;
            }
            if (tree[i].children)
                consoleTree(
                    tree[i].children,
                    floor + 1,
                    str,
                    adder,
                    (isLast || floor === 1) && i === tree.length - 1
                );
        }
    }
    function writeTree(filePath, content) {
        clearTxt(generatePath);
        fs.writeFileSync(filePath, `${content}`);
    }
    function clearTxt(filePath) {
        fileTree = "";
        fs.writeFileSync(filePath, "");
    }
    // 生成tree格式的目录
    consoleTree(dirTree);
    writeTree(generatePath, fileTree);
    response.send(dirTree)
});
app.get('/edit', (request, response) => {
    if (!request.query.path) {
        response.end('文件路径出错了')
        return
    }
    const basepath = '../' + request.query.path; // 完整文件路径
    console.log("文件路径", basepath)
    let file = fs.createReadStream(basepath, {
        encoding: "utf-8"
    });
    response.setHeader('Content-Type', 'text/html');
    file.on("open", function (fd) {
        console.log("打开文件，开始读取内容")
    });

    file.on("data", function (data) {
        response.end(data);
    });

    file.on("end", function () {
        console.log('文件读取结束')
        response.end()
    });

    file.on("close", function () {
        console.log("关闭文件")
    });

    file.on('error', function () {
        console.log("读取文件失败")
    })
})

app.post('/save', (req, res) => {
    let basepath = './' + req.body.path;
    let out = fs.createWriteStream(basepath, {
        encoding: "utf-8"
    });
    out.on("open", function () {
        console.log('打开文件，开始保存');
    });
    out.write(req.body.code, function () {
        res.send("保存成功");
    });
})
app.listen(8000, (err) => {
    if (!err) {
        console.log("服务器已经启动，地址")
    }
})