addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const imageUrl = url.searchParams.get('image')

  if (!imageUrl) {
    return new Response('Image URL not specified', { status: 400 })
  }

  const width = parseInt(url.searchParams.get('width')) || 800
  const cache = caches.default

  let response = await cache.match(request)
  if (!response) {
    const resizedImage = await resizeImage(imageUrl, width)
    response = new Response(resizedImage, { headers: { 'Content-Type': 'image/jpeg' } })
    event.waitUntil(cache.put(request, response.clone()))
  }

  return response
}

async function resizeImage(imageUrl, width) {
  const response = await fetch(imageUrl)
  const arrayBuffer = await response.arrayBuffer()

  const { ImagePool } = require('@cloudflare/images')
  const imagePool = new ImagePool()
  const image = imagePool.ingestImage(arrayBuffer)
  await image.preProcess()
  const resizedImage = await image.resize({ width })
  const { data } = await resizedImage.encode()

  return data
}
