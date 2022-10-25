import axios from 'axios';

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
        console.error(err);
    }
};

export { sendGetRequest, sendPostRequest };


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
    await test();
})()