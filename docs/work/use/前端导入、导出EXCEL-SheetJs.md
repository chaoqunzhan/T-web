在日常开发中，遇到批量导入的情况，通常是将文件上传至后端来解析excel文件流。这种做法会占用一定的带宽和后端性能，SheetJS是用于多种电子表格格式的解析器和编写器。通过使用SheetJS，前端可以直接实现.xlsx, .xlsm, .txt, .csv, .html等文件的导出和导入，比如，将execl文件转化为json，或者将json导出为execl。当然这一定程度上也会消耗前端的性能，但这对于数据安全更有保障，而且也有利于前后端交互的统一性。本文将介绍如何使用sheetJS，实现纯前端的execl数据导出和导入，并简单介绍sheetJS相关概念：

sheetJS社区版js-xlsx地址为：https://github.com/SheetJS/sheetjs

相关概念
execl与js-xlsx之间的关系，这两者有着极强的对应关系，如下：

execl名词	js-xlsx类型
工作簿	workBook
工作表	Sheets
单元格	cell
就像我们熟悉的execl文件一样，工作簿里有可能存在多个工作表，每个工作表里也很多单元格，js-xlsx有workBook对象，里面可以存在和创建Sheets，在Sheets对象里还存在很多的cell元素。

js-xlsx的安装
参考官方文档：

script引入：
```js
<script lang="javascript" src="dist/xlsx.full.min.js"></script>

CDN引入：
//npm方式
$ npm install xlsx

//bower方式
$ bower install js-xlsx

```
Json数据导出为execl文件
为了把json数据导出为execl文件，我们需要执行三个步骤：

创建工作簿，就是创建一个workBook对象；
在工作簿里新建工作表，就是新建Sheets对象；
把数据写入表格的单元格里，就是把Json数据写入cell中；
代码示例如下：

//data为json数据，
Export(){
  let wb = XLSX.utils.book_new(),	//新建工作簿
    sheet = {},
  sheet = XLSX.utils.json_to_sheet(data, {skipHeader:true});	//新建工作表
  XLSX.utils.book_append_sheet(wb, sheet, 'name');	//工作表添加到工作簿中
  XLSX.writeFile(wb, 'name.xlsx');
}

XLSX.utils.json_to_sheet获取对象数组并且返回一张基于对象自动生成”headers”的工作表。默认的列顺序由第一次出现的字段决定，这些字段通过使用Object.keys得到，不过可以使用选项参数覆盖。

Option Name	Default	Description
header		使用指定的列顺序 (默认 Object.keys)
dateNF	FMT 14	字符串输出使用指定的日期格式
cellDates	false	存储日期为类型 d (默认是 n)
skipHeader	false	如果值为true, 输出不包含header行
原始的表单不能以明显的方法复制，因为JS对象的keys必须是独一无二的。之后用e_1 和 S_1替换第二个e 和 S。

var ws = XLSX.utils.json_to_sheet([
  { S:1, h:2, e:3, e_1:4, t:5, J:6, S_1:7 },
  { S:2, h:3, e:4, e_1:5, t:6, J:7, S_1:8 }
], {header:["S","h","e","e_1","t","J","S_1"]});
或者可以跳过header行：

var ws = XLSX.utils.json_to_sheet([
  { A:"S", B:"h", C:"e", D:"e", E:"t", F:"J", G:"S" },
  { A: 1,  B: 2,  C: 3,  D: 4,  E: 5,  F: 6,  G: 7  },
  { A: 2,  B: 3,  C: 4,  D: 5,  E: 6,  F: 7,  G: 8  }
], {header:["A","B","C","D","E","F","G"], skipHeader:true});
skipHeader:true导出会跳过表头字段。

除了json_to_sheet，还有其他的数据导入Sheets对象的方法：

aoa_to_sheet 把转换JS数据数组的数组为工作表。
table_to_sheet 把DOM TABLE元素转换为工作表。
sheet_add_aoa 把JS数据数组的数组添加到已存在的工作表中。
sheet_add_json 把JS对象数组添加到已存在的工作表中。
详情查看文档：https://github.com/SheetJS/sheetjs

XLSX.utils.book_append_sheet用来把工作表添加到工作簿中，XLSX.utils.book_append_sheet(wb, sheet,name)方法有三个参数:

wb: 要写入的工作簿

sheet:工作表

name:工作表的名称

XLSX.write(wb, write_opts) 用来写入工作簿 wb。 XLSX.writeFile(wb, filename, write_opts) 把 wb 写入到特定的文件 filename 中。如果是基于浏览器的环境，此函数会强制浏览器端下载。 XLSX.writeFileAsync(filename, wb, o, cb) 把 wb 写入到特定的文件 filename 中。如果 o 被省略，写入函数会使用第三个参数作为回调函数。其中write_opts是写入配置，可以配置包括输出数据编码、把字节存储为类型d等等属性。filename就是文件名了。

excel文件读取为Json数据
首先，用到iview-UI的Upload组件，然后在组件的before-upload钩子（上传前）中执行数据解析。

//.html
<Upload class="ml10" :action="uploadUrl"  :format="['xlsx', 'xls']" name="file" :before-upload="beforeUpload">
    <Button  icon="ios-cloud-upload-outline">导入修改</Button>
</Upload>
//.js
beforeUpload(file, fileList){
  const f = file;
  let reader = new FileReader();		//创建FileReader对象
  reader.readAsArrayBuffer(f);			//读取指定的Blob中的内容
  reader.onload = function (e) {		//读取file完成后
      let data = e.target.result;
      let workbook = XLSX.read(data, {
          type: 'array'
      });
      let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];  //获取第一张数据表
      var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {header:1});		//把工作表转化为Json
      console.log('jsonArr:',jsonArr)
  };
}
FileReader 是一个常用的web API，FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用File和Blob对象指定要读取的文件或数据。FileReader.onload处理load事件，该事件在读取操作完成时触发。reader.readAsArrayBuffer开始读取指定的Blob中的内容, 一旦完成, result 属性中保存的将是被读取文件的 ArrayBuffer数据对象。

XLSX.read(data, read_opts) 用来解析数据 data。 XLSX.readFile(filename, read_opts) 用来读取文件名 filename 并且解析。read_opts为读取配置，可以用来配置输入数据编码等。XLSX.utils.sheet_to_json把工作表转化为Json。

其实SheetJS除了简单的导入和导出excel文件之外，还支持其他的文件类型，而且还能设置文件样式等，功能强大，慢慢挖掘！