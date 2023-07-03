const CreateConnectionComs: Record<DatabaseIdent, () => any> = {
  mysql: () => import('@/components/database/mysql/create-connection.vue'),
  sql_server_2012: () => import('@/components/database/sql_server_2012/create-connection.vue')
}

export const getCreateConnectionCom = (ident: DatabaseIdent): () => Promise<any> => {
  const component = CreateConnectionComs[ident]
  return !component ? () => Promise.reject() : component
}
