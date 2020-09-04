import vue from "vue"
import axios from "axios"

export default {
    post: (url, headers, params) => {
   
        
        return new Promise((reslove, reject) => {
            axios.post(url, params, headers).then(res => { 
                switch (res.data.code) {
                    case 1:
                        // 返回
                        resolve({
                            msg: res,
                            // data: utils.decrypt(resultData.data, "MonitoR6G2iLdHg4")
                            data: res.data,
                            code: res,
                        })
                        break;
                    case 0:
                        reslove({
                            // 看返回的结果
                            data: res.data,
                            // code: resultData.code,
                        })
                        break;

                }
            }).catch(error => {
                reject(error)
            })
        })
    }
}