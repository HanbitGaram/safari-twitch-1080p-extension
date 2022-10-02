let pageLoaded = false;
let videoLoading = null;
let applicationPrevUrl = null;

function applicationExecute(){
    document.body.querySelector("video").play();
}

/**
 * 애플리케이션 반복 로직
 * @returns {boolean}
 */
function applicationLoop(){
    const currentLocation = document.location.href;
    let videoObject = document.body.querySelector("video");

    if(
        typeof currentLocation.split("/")[4] !== 'undefined'
        || currentLocation.split("/")[3]==='videos'
        || typeof currentLocation.split("/")[3] === 'undefined'
        || document.body.querySelector("video")===null
    ){
        return false;
    }

    fetch("https://api.twitch.kwabang.net/hls/"+currentLocation.split("/")[3])
        .then((response) => response.json())
        .then((data) => {
            videoObject.src=data[0];
            videoObject.addEventListener('canplay', applicationExecute, {once:true});
        });
}

/**
 * 앱 데이터 저장하기
 * @param content 배열 콘텐츠
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
 * @param id 타이틀
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

let appInit = setInterval(function(){
    if(document.body.querySelector("video")!==null){

        document.body.querySelector("video").addEventListener('canplay', async function () {
            let app = await getAppConfig('app');
            if (document.location.href !== applicationPrevUrl && app === true) {
                console.log("[트위치 영상 로딩 중...]");
                document.body.querySelector("video").pause();
                applicationPrevUrl = document.location.href;
                applicationLoop();
            }
        });

        clearInterval(appInit);
    }
},1000);