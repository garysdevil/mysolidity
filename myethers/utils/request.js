import axios from 'axios';
import fs from 'fs';
import path from 'path';

// const data = {
//     userId: 1
// };
const sendPostRequest = async (url, data) => {
    try {
        const resp = await axios.post(url, data);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};


const sendGetRequest = async (url) => {
    try {
        const resp = await axios.get(url);
        return resp.data;
    } catch (err) {
        // Handle Error Here

        console.error("===Request Error", err, "===Request Error.");
    }
};


// url 是图片地址，如，https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ
// filepath 是文件下载的本地目录
// filename 是下载后的文件名
const downloadFile = async (url, folderpath, filename) => {
    if (!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath);
    }
    const filepath = path.resolve(folderpath, filename);

    let { data } = await axios({
      url,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    })
    await fs.promises.writeFile(filepath, data, 'binary');
}

export { sendGetRequest, sendPostRequest, downloadFile };


const test = async _ => {
    const urlPre = 'https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/'
    let arr = new Array();
    for (let i = 0; i < 2; i++){
        const url = urlPre + i;
        const data = await sendGetRequest(url);
        if (data == undefined || data.image == undefined){
            arr[i] = {};
            console.log(i, data);
            continue;
        }else{
            const cid = data.image.slice(7)
            const jsonStr = JSON.stringify({i, cid});
            arr[i] = JSON.parse(jsonStr);
        }
    }
    console.log(arr);
}

(async _ => {
    // await test();
})()