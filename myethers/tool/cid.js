import  contentHash from 'content-hash';

(async _ => {
    const ipfsHash = 'Qmc4g6TMc8CpjhQh3XPpc4ozPCF9viQNcyoDFU42PdZ6Zh'
    const contentH = contentHash.fromIpfs(ipfsHash)
    console.log(contentH);
    const cid = contentHash.decode(contentH)
    console.log(cid);

})()

