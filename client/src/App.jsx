/*
 * @Author: 韦永愿 1638877065@qq.com
 * @Date: 2022-07-11 15:35:11
 * @LastEditors: 韦永愿 1638877065@qq.com
 * @LastEditTime: 2022-07-12 17:37:12
 * @FilePath: \webide\src\App.jsx
 * @Description: 
 * Copyright (c) 2022 by 韦永愿 email: 1638877065@qq.com, All Rights Reserved.
 */
import { useEffect, useState } from "react";
import { Menu, Button } from "antd";
import {
  FolderOpenFilled,
  FileFilled
} from '@ant-design/icons';

import './App.css';
import AceEditor from "react-ace";
import "./App.css"
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

function App() {
  const [directory, setDirectory] = useState([]);
  const [code, setCode] = useState(null);
  const [editPath, setEditPath] = useState(null);
  useEffect(() => {
    document.title = "Web IDE"
    getDirectory();
  }, [])
  const getDirectory = () => {
    fetch("http://10.10.0.145:8000/file")
      .then(res => res.json())
      .then(data => {
        console.log("目录", data)
        setDirectory([...data])
      })
  }
  const onChange = (value) => {
    setCode(value);
  }
  const editFile = (path) => {
    fetch("http://10.10.0.145:8000/edit?path=" + path)
      .then(res => res.text())
      .then(data => {
        setCode(data);
      })
  }
  const onSave = () => {
    if (!code) {
      return
    }
    console.log("保存代码", code)
    fetch("http://10.10.0.145:8000/save", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code, path: editPath })
    })
      .then(res => res.text())
      .then(data => {
        console.log("保存结果", data)
      })
  }
  const formateMenu = (parmas) => {
    if (parmas.children) {
      return <Menu.SubMenu icon={<FolderOpenFilled style={{ color: "#ebbc12", fontSize: "24" }} />} title={parmas.name} key={parmas.label}>
        {
          parmas.children.map(item => formateMenu(item))
        }
      </Menu.SubMenu>
    }
    return <Menu.Item
      icon={<FileFilled style={{ color: "#b5afaf", fontsize: "22" }} />}
      key={parmas.label}
      onClick={() => {
        editFile(parmas.label);
        setEditPath(parmas.label)
      }}
      onContextMenu={(e) => {
        e.stopPropagation();
        console.log("右键")
      }}
    >{parmas.name}</Menu.Item>
  }
  return <div className='ide-container'>
    <div className='directory'>
      <Menu mode="inline">
        {
          directory.map(item => formateMenu(item))
        }
      </Menu>

    </div>
    <div className='content'>
      <div className="operation">
        <Button type="primary" onClick={onSave}>保存</Button>
      </div>
      <AceEditor
        placeholder="Placeholder Text"
        mode="javascript"
        theme="monokai"
        name="blah2"
        onChange={onChange}
        fontSize={24}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={code}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
        width="100%"
        height="100%"
      />
    </div>
  </div>;
}

export default App;
