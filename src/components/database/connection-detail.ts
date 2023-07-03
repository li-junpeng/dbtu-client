const ConnectionDetailComponents: Record<DatabaseIdent, () => any> = {
  mysql: () => import('./mysql/connection-detail.vue'),
  sql_server_2012: () => import('./sql_server_2012/connection-detail.vue')
}

export const getConnectionDetailCom = (ident: DatabaseIdent): () => Promise<unknown> => {
  const component = ConnectionDetailComponents[ident]
  return !component ? () => Promise.reject() : component
}
