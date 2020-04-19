/* utils.js */
// Guardar Cache Dinamico
function guardar_cache_dinamico( dynamic_cache, request, response ) {
    if ( response.ok ) {
        return caches.open( dynamic_cache ).then( cache => {
            cache.put( request, response.clone() )
            return response.clone()
        })
    } else {
        return response
    }

}