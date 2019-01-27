var CACHE_NAME  = "shocknine-cache-v0-02";

var urlsToCache = [
    "/",
    "https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js",
    "https://unpkg.com/onsenui@2.10.6/js/onsenui.min.js",
    "https://unpkg.com/onsenui@2.10.6/css/onsenui.css",
    "https://unpkg.com/onsenui@2.10.6/css/onsen-css-components.min.css",
    "https://unpkg.com/vue-onsenui@2.6.1/dist/vue-onsenui.js",
    "https://unpkg.com/vuex@3.0.1/dist/vuex.js",
    "https://unpkg.com/axios@0.18.0/dist/axios.min.js",
    "https://unpkg.com/vuex-persistedstate@2.5.4/dist/vuex-persistedstate.umd.js",
    "images/assets/allergie/allergy01_kani.png",
    "images/assets/allergie/allergy02_ebi.png",
    "images/assets/allergie/allergy03_tamago.png",
    "images/assets/allergie/allergy04_milk.png",
    "images/assets/allergie/allergy05_peanut.png",
    "images/assets/allergie/allergy06_komugi.png",
    "images/assets/allergie/allergy07_soba.png",
    "images/assets/allergie/allergy08_awabi.png",
    "images/assets/allergie/allergy09_ika.png",
    "images/assets/allergie/allergy10_ikura.png",
    "images/assets/allergie/allergy11_mikan.png",
    "images/assets/allergie/allergy12_cashew.png",
    "images/assets/allergie/allergy13_kiwi.png",
    "images/assets/allergie/allergy14_gyuniku.png",
    "images/assets/allergie/allergy15_kurumi.png",
    "images/assets/allergie/allergy16_goma.png",
    "images/assets/allergie/allergy17_sake.png",
    "images/assets/allergie/allergy18_saba.png",
    "images/assets/allergie/allergy19_daizu.png",
    "images/assets/allergie/allergy20_toriniku.png",
    "images/assets/allergie/allergy21_banana.png",
    "images/assets/allergie/allergy22_butaniku.png",
    "images/assets/allergie/allergy23_matsutake.png",
    "images/assets/allergie/allergy24_momo.png",
    "images/assets/allergie/allergy25_yamaimo.png",
    "images/assets/allergie/allergy26_ringo.png",
    "images/assets/allergie/allergy27_gelatine.png",
    "images/assets/menu-category/bread_syokupan.png",
    "images/assets/menu-category/food_gohan_hakumai.png",
    "images/assets/menu-category/food_men_chuka.png",
    "images/assets/menu-category/food_men_udon.png",
    "images/assets/menu-category/nan.png",
    "images/assets/menu-category/school1_syougaku.png",
    "images/assets/menu-category/school3_chugaku.png",
    "images/assets/menu-icon/breakfast.png",
    "images/assets/menu-icon/danger.png",
    "images/assets/menu-icon/farmer.png",
    "images/assets/menu-icon/gdpr.png",
    "images/assets/menu-icon/menu.png",
    "images/assets/menu-icon/newspaper.png",
    "images/assets/menu-icon/piggy-bank.png",
    "images/assets/menu-icon/speedometer.png",
    "images/assets/menu-icon/whisk.png",
    "images/assets/menu-icon/wind.png",
    "images/assets/menu-icon/yes-t-logo-front-bk.png",
    "images/assets/menu-icon/handa.png",
    "images/assets/menu-icon/ogrium.png",
    "images/assets/kyusyoku_haizen.png",
    "images/icon-android/icon-192x192.png",
    "images/icon-android/icon-512x512.png",
    "images/icon-ios/Icon-60@3x.png",
    "images/original/logo.png",
    "images/favicon-32x32.png",
    "images/favicon-96x96.png",
];

// 残したいキャッシュのバージョンをこの配列に入れる
const CACHE_KEYS = [
    CACHE_NAME
];

self.addEventListener('install', event => {
    console.log('Service Worker Installing');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(
                function(cache){
                    // 指定したリソースをキャッシュへ追加
                    // 1つでも失敗したらService Workerのインストールはスキップされる
                    return cache.addAll(urlsToCache);
                })
    );
});

// 新しいバージョンのServiceWorkerが有効化されたとき
self.addEventListener('activate', event => {
    console.log('Service Worker Activating');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => {
                    return !CACHE_KEYS.includes(key);
                }).map(key => {
                    // 不要なキャッシュを削除
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    console.log("FETCHING");
    var online = navigator.onLine;

    // ファイルパス ~/test.htmlにアクセスすると、このファイル自体は無いがServiceWorkerがResponseを作成して表示してくれる
    if (event.request.url.indexOf('test.html') !== -1) {
        return event.respondWith(new Response('no page'));
    }

    if(online){
        console.log("ONLINE");
        //このパターンの処理では、Responseだけクローンすれば問題ない
        //cloneEventRequest = event.request.clone();
        event.respondWith(
            caches.match(event.request)
                .then(
                    function (response) {
                        if (response) {
                            //オンラインでもローカルにキャッシュでリソースがあればそれを返す
                            //ここを無効にすればオンラインのときは常にオンラインリソースを取りに行き、その最新版をキャッシュにPUTする
                            return response;
                        }
                        //request streem 1
                        return fetch(event.request)
                            .then(function(response){
                                //ローカルキャッシュになかったからネットワークから落とす
                                //ネットワークから落とせてればここでリソースが返される

                                // Responseはストリームなのでキャッシュで使用してしまうと、ブラウザの表示で不具合が起こる(っぽい)ので、複製したものを使う
                                cloneResponse = response.clone();

                                if(response){
                                    if(response || response.status === 200){
                                        console.log("正常にリソースを取得");
                                        caches.open(CACHE_NAME)
                                            .then(function(cache)
                                            {
                                                console.log("キャッシュへ保存");
                                                //初回表示でエラー起きているが致命的でないので保留
                                                cache.put(event.request, cloneResponse)
                                                    .then(function(){
                                                        console.log("保存完了");
                                                    });
                                            });
                                    }else{
                                        return event.respondWith(new Response('200以外のエラーをハンドリングしたりできる'));
                                    }
                                    return response;
                                }
                            }).catch(function(error) {
                                return console.log(error);
                            });
                    })
        );
    }else{
        console.log("OFFLINE");
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                        // キャッシュがあったのでそのレスポンスを返す
                        if (response) {
                            return response;
                        }
                        //オフラインでキャッシュもなかったパターン
                        return caches.match("offline.html")
                            .then(function(responseNodata)
                            {
                                return responseNodata;
                            });
                    }
                )
        );
    }
});