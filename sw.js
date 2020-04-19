/* sw.js */
// importar archivo utils
importScripts('js/utils.js')

const CACHE_STATIC = "twittor-static-2"
const CACHE_DYNAMIC = "twittor-dynamic-1"
const CACHE_DINAMIC_LIMIT = 50
const CACHE_INMUTABLE = "twittor-inmutable-1"

const APP_SHELL_STATIC  = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/utils.js'
]

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]

self.addEventListener('install', e => {
    const cache_static = caches.open( CACHE_STATIC ).then(cache => {
        return cache.addAll( APP_SHELL_STATIC )
    })
    const cache_inmutable = caches.open( CACHE_INMUTABLE ).then( cache => {
        return cache.addAll( APP_SHELL_INMUTABLE )
    })
    e.waitUntil( 
        Promise.all([
            cache_static,
            cache_inmutable
        ])
    )
})

self.addEventListener('activate', e => {
    const delete_caches = caches.keys().then( keys => {
        keys.forEach( key => {
            if ( key !== CACHE_STATIC && key.includes('twittor-static')) {
                return caches.delete(key)
            }
        })
    })
    e.waitUntil( delete_caches )
})

self.addEventListener( 'fetch', e => {
    const fetch_event = caches.match(e.request).then( resp => {
        if ( resp ) {
            return resp
        } else {
            return fetch( e.request ).then( newResp => {
                return guardar_cache_dinamico( CACHE_DYNAMIC, e.request, newResp )
            })
        }
    })
})