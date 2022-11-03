import  contentHash from 'content-hash';

// 
const getZksyncContentHashByCid = (cid) => {
    const contentH_1 =  contentHash.fromIpfs(cid);
    // const ipfsHash = contentHash.decode(contentH_1)
    // console.log(ipfsHash == cid);
    const contentH = "0x" + contentH_1.slice(contentH_1.length-64, contentH_1.length+1); // 获取zksync长度的 contentHash
    return JSON.stringify({contentH});
}

const random = async _ => {
    // 随机数
    const random = Math.random();  // 小于1的随机数
    const random_1 = random.toFixed(5); // 取5位小数，并且转为字符串
    Math.floor(Math.random()*100+1) // 取1到100的随机数
}

// 示范 await delay(1000); // 等待1秒
const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
} 

export { getZksyncContentHashByCid, delay };


const test = async _ => {
    const cid = 'Qmc4g6TMc8CpjhQh3XPpc4ozPCF9viQNcyoDFU42PdZ6Zh'
    getZksyncContentHashByCid(cid)
}

(async _ => {
    // await test();
})()