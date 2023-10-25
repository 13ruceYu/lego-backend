/* eslint-disable @typescript-eslint/no-var-requires */
const OSS = require('ali-oss');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const publicPath = path.resolve(__dirname, '../app/public');

const client = new OSS({
  accessKeyId: process.env.ALI_ACCESS_KEY || '',
  accessKeySecret: process.env.ALI_SECRET_KEY || '',
  bucket: process.env.ALI_OSS_BUCKET,
  endpoint: process.env.ALI_OSS_ENDPOINT,
});

async function run() {
  // 从文件夹获取对应文件列表
  const publicFiles = fs.readdirSync(publicPath);
  const files = publicFiles.filter(f => f !== 'page.nj');
  const res = await Promise.all(
    files.map(async fileName => {
      const ossPath = path.join('h5-assets', fileName);
      const filePath = path.join(publicPath, fileName);
      const result = await client.put(ossPath, filePath);
      const { url } = result;
      return url;
    }),
  );
  console.log('上传成功', res);
}

run();
