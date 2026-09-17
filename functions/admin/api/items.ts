interface Env { DB: D1Database }

type ItemInput = {
  id?: number
  name?: string
  image?: string
  url?: string
  type?: 'game' | 'tool' | 'link'
  enabled?: boolean
  sortOrder?: number
}

const json = (data: unknown, status = 200) => Response.json(data, { status })

const selectSql = `SELECT id, name, image_url, target_url, type, enabled, sort_order
  FROM catalogue_items ORDER BY sort_order, name`

const mapItem = (item: any) => ({
  id: String(item.id), name: item.name, image: item.image_url, url: item.target_url,
  type: item.type, enabled: Boolean(item.enabled), sortOrder: item.sort_order,
})

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(selectSql).all()
  return json(results.map(mapItem))
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const item = await request.json<ItemInput>()
  if (!item.name?.trim() || !item.url?.trim() || !['game', 'tool', 'link'].includes(item.type ?? '')) {
    return json({ error: 'Name, destination, and type are required.' }, 400)
  }

  const values = [item.name.trim(), item.image?.trim() ?? '', item.url.trim(), item.type, item.enabled === false ? 0 : 1, Number(item.sortOrder) || 0]

  if (item.id) {
    await env.DB.prepare(`UPDATE catalogue_items SET name=?, image_url=?, target_url=?, type=?, enabled=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .bind(...values, item.id).run()
    return json({ ok: true, id: item.id })
  }

  const result = await env.DB.prepare(`INSERT INTO catalogue_items (name, image_url, target_url, type, enabled, sort_order) VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(...values).run()
  return json({ ok: true, id: result.meta.last_row_id }, 201)
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isInteger(id) || id <= 0) return json({ error: 'Valid id required.' }, 400)
  await env.DB.prepare('DELETE FROM catalogue_items WHERE id=?').bind(id).run()
  return json({ ok: true })
}
