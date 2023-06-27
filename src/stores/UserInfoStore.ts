import { defineStore } from 'pinia'
import { ObjectUtils } from '@/common/utils/ObjectUtils'

export const useUserInfoStore = defineStore('useUserInfoStore', {

  state: () => {
    return {
      user: {} as UserInfo
    }
  },

  actions: {

    getCurrent(): UserInfo | null {
      return ObjectUtils.isEmpty(this.user) ? null : this.user
    }

  },

  persist: {
    key: '__dbtu_user_info',
    storage: localStorage,
    paths: ['user']
  }

})
