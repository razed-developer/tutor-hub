interface Env { DB: D1Database }

type HubItem = {
  id: string
  name: string
  url: string
  image: string
  type: 'game' | 'tool' | 'link'
  enabled: number | boolean
  sort_order: number
}

const json = (data: unknown, status = 200) => Response.json(data, { status })

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    'SELECT id, name, url, image, type, enabled, sort_order FROM items ORDER BY sort_order, name',
  ).all<HubItem>()

  return json(results.map(item => ({
    id: item.id,
    name: item.name,
    url: item.url,
    image: item.image,
    type: item.type,
    enabled: Boolean(item.enabled),
    sortOrder: item.sort_order,
  })))
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const item = await request.json<{
    id?: string
    name?: string
    url?: string
    image?: string
    type?: 'game' | 'tool' | 'link'
    enabled?: boolean
    sortOrder?: number
  }>()

  if (!item.name?.trim() || !item.url?.trim() || !['game', 'tool', 'link'].includes(item.type ?? '')) {
    return json({ error: 'Name, URL, and type are required.' }, 400)
  }

  const id = item.id ?? crypto.randomUUID()
  await env.DB.prepare(
    `INSERT INTO items (id, name, url, image, type, enabled, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name=excluded.name, url=excluded.url, image=excluded.image,
       type=excluded.type, enabled=excluded.enabled, sort_order=excluded.sort_order`,
  ).bind(id, item.name.trim(), item.url.trim(), item.image?.trim() ?? '', item.type, item.enabled === false ? 0 : 1, item.sortOrder ?? 0).run()

  return json({ ok: true, id })
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return json({ error: 'Missing id.' }, 400)
  await env.DB.prepare('DELETE FROM items WHERE id = ?').bind(id).run()
  return json({ ok: true })
}
