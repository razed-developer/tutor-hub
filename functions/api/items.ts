interface Env { DB: D1Database }

type CatalogueRow = {
  id: number
  name: string
  image_url: string
  target_url: string
  type: 'game' | 'tool' | 'link'
  enabled: number
  sort_order: number
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT id, name, image_url, target_url, type, enabled, sort_order
     FROM catalogue_items
     WHERE enabled = 1
     ORDER BY sort_order, name`,
  ).all<CatalogueRow>()

  return Response.json(results.map(item => ({
    id: String(item.id),
    name: item.name,
    image: item.image_url,
    url: item.target_url,
    type: item.type,
    enabled: Boolean(item.enabled),
    sortOrder: item.sort_order,
  })))
}
