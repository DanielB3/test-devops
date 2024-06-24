addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // Obtener parámetros de redimensionamiento de la URL
  const width = parseInt(url.searchParams.get('width')) || 0
  const height = parseInt(url.searchParams.get('height')) || 0
  const imageUrl = url.searchParams.get('image')

  if (!imageUrl) {
    return new Response('URL de la imagen no proporcionada', { status: 400 })
  }

  const imageRequest = new Request(imageUrl)
  const imageResponse = await fetch(imageRequest)

  if (!imageResponse.ok) {
    return new Response('No se pudo obtener la imagen', { status: 500 })
  }

  const imageBuffer = await imageResponse.arrayBuffer()
  const resizedImageBuffer = await resizeImage(imageBuffer, width, height)

  return new Response(resizedImageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000'
    }
  })
}

async function resizeImage(imageBuffer, width, height) {
  // Lógica para redimensionar la imagen usando una librería adecuada
  // Esto es un placeholder y debes reemplazarlo con una librería de redimensionamiento de imágenes en Cloudflare Workers

  // Por ejemplo, puedes usar la librería Sharp para redimensionar imágenes
  // const sharp = require('sharp')
  // const resizedBuffer = await sharp(imageBuffer).resize(width, height).toBuffer()
  // return resizedBuffer

  // Placeholder para el ejemplo
  return imageBuffer
}
