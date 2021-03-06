let admin = require('../helper/hrquery');
let user = require('../helper/userquery');
let tokenfun = require('./jwttoken');

module.exports = {
    adminforget: (obj) => {
        return new Promise((solve, reject) => {
            admin.emailfind(obj).then((resolve) => {
                if (resolve == null || resolve.length <= 0) solve({ 'ok': 0 })
                else {
                    obj.token = tokenfun.gettoken(obj.email);
                    admin.admintokenupdate(obj).then(data => solve({ 'ok': 1, 'token': obj.token }))
                        .catch(err => reject(err))
                }
            }).catch(err => reject(err))
        })
    },
    userforget: (obj) => {
        return new Promise((solve, reject) => {
            user.emailfind(obj).then((resolve) => {
                if (resolve == null || resolve.length <= 0) solve({'ok':0 }) 
                else {
                    obj.token = tokenfun.gettoken(obj.email);
                    user.usertokenupdate(obj).then(data => solve({ 'ok': 1, 'token': obj.token }))
                        .catch(err => reject(err))
                }
            }).catch(err => reject(err))
        })
    }
}