/**
 * 앱 데이터 저장하기
 * @param content
 * @returns {Promise<unknown>}
 */
async function setAppConfig(content){
    return new Promise((resolve) => {
        browser.storage.local.set(content, function(res){
            resolve(res);
        });
    });
}

/**
 * 앱 데이터 불러오기
 * @param id
 * @returns {Promise<unknown>}
 */
async function getAppConfig(id){
    return new Promise((resolve, reject) => {
        browser.storage.local.get(id, function(res){
            if(typeof res[id] === 'undefined'){
                reject(false);
            }else{
                resolve(res[id]);
            }
        });
    });
}

async function getApplicationConfig(){
    const isEnabled = await getAppConfig('app');

    if(isEnabled===true){
        document.getElementById('appEnabledSwitch').checked = true;
    }
}

document.getElementById('appEnabledSwitch').addEventListener('change', function(){
    var object = document.getElementById('appEnabledSwitch').checked;
    if(object===false){
        setAppConfig({app: false}).then(r => {});
    }else{
        setAppConfig({app: true}).then(r => {});
    }
});

// 애플리케이션 실행
getApplicationConfig().then(r => {});