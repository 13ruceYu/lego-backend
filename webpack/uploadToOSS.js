/* eslint-disable @typescript-eslint/no-var-requires */
const OSS = require('ali-oss');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// 设置环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const publicPath = path.resolve(__dirname, '../app/public');

// 新增一个实例
const client = new OSS({
  accessKeyId: process.env.ALC_ACCESS_KEY || '',
  accessKeySecret: process.env.ALC_SECRET_KEY || '',
  bucket: 'lego-backend-vue',
  endpoint: 'oss-cn-hangzhou.aliyuncs.com',
});

async function run() {
  // 从文件夹获取对应的文件列表
  const publicFile = fs.readdirSync(publicPath);
  const files = publicFile.filter(f => f !== 'page.nj');
  const res = await Promise.all(
    files.map(async filename => {
      const savedOSSPath = path.join('h5-assets', filename);
      const filePath = path.join(publicPath, filename);
      const result = await client.put(savedOSSPath, filePath);
      const { url } = result;
      return url;
    }),
  );
  console.log('上传成功', res);
}

run();
