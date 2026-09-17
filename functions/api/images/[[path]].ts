interface Env { IMAGES: R2Bucket }

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const raw = params.path
  const key = Array.isArray(raw) ? raw.join('/') : String(raw ?? '')
  if (!key) return new Response('Not found', { status: 404 })

  const object = await env.IMAGES.get(key)
  if (!object) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  return new Response(object.body, { headers })
}
