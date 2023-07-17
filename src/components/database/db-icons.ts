import IconMySQL from './mysql/icon.vue'
import IconSqlServer2012 from './sql_server_2012/icon.vue'
import type { Component } from 'vue'

export const DatabaseIcons: Record<DatabaseIdent, Component> = {
  mysql: IconMySQL,
  sql_server_2012: IconSqlServer2012
}
