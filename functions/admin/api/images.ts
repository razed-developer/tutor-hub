interface Env { IMAGES: R2Bucket }

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const extensions: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const form = await request.formData()
  const file = form.get('image')
  if (!(file instanceof File)) return Response.json({ error: 'Choose an image.' }, { status: 400 })
  if (!allowed.has(file.type)) return Response.json({ error: 'Use JPG, PNG, WebP, or GIF.' }, { status: 400 })
  if (file.size > 8 * 1024 * 1024) return Response.json({ error: 'Image must be 8 MB or smaller.' }, { status: 400 })

  const key = `${crypto.randomUUID()}.${extensions[file.type]}`
  await env.IMAGES.put(key, file.stream(), { httpMetadata: { contentType: file.type } })
  return Response.json({ key, url: `/api/images/${key}` }, { status: 201 })
}
