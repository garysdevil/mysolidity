// 链下签名数据 // 通过打开控制，并且游览器插件已经按照metamask插件

ethereum.enable() // 打开以太坊的插件，连接metamask钱包里的账户

// 填入执行签名的钱包地址
account = "0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D"

// 填入hash一次过的数据， 例如 “secrete message” 字符串hash后的数据是 0x226036b34a5bafd6b14ef4046c0f25edcb50e0cd72e1bff4068de5564e2af569
hash = "0x226036b34a5bafd6b14ef4046c0f25edcb50e0cd72e1bff4068de5564e2af569"

// 进行签名操作 // 输入 钱包地址，字符串
ethereum.request({method: "personal_sign", params: [account, hash]}) // metamask弹出提示框，点击确认后在Peomise里查看签名后的数据。