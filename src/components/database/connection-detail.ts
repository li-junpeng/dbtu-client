import { ObjectUtils } from '@/common/utils/ObjectUtils'

const ConnectionDetailComs: Record<DatabaseIdent, any> = {
  mysql: import.meta.glob('./mysql/connection-detail.vue'),
  sql_server_2012: import.meta.glob('./sql_server_2012/connection-detail.vue')
}

export const getConnectionDetailCom = (ident: DatabaseIdent): (() => Promise<string>) | null => {
  const modules = ConnectionDetailComs[ident]
  if (ObjectUtils.isNotEmpty(modules)) {
    for (let key in modules) {
      if (key) {
        return modules[key]
      }
    }
  }
  return null
}
