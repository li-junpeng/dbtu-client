const ConnectionDetailComponents: Record<DatabaseIdent, () => any> = {
  mysql: () => import('@/components/database/mysql/connection-detail.vue'),
  sql_server_2012: () => import('@/components/database/sql_server_2012/connection-detail.vue')
}

export const getConnectionDetailCom = (ident: DatabaseIdent): (() => Promise<any>) => {
  const component = ConnectionDetailComponents[ident]
  return !component ? () => Promise.reject() : component
}
