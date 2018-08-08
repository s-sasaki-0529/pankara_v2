/**
  カラオケ一覧画面のストア
*/
import http from '../lib/http'
import CONST from '../lib/constants'
export default {
  state: {
    // APIからフェッチしたカラオケ一覧
    events: [],
    // APIからフェッチ中であるか？
    isLoading: false,
    // 全カラオケをフェッチ済みか？
    isAllLoaded: false,
    // 検索ダイアログが表示されている？
    isShowSearchDialog: false,
    // 検索条件
    searchQuery: {
      title: '',
      wantOnlyMine: false
    },
    // ページャ
    pager: {
      total: 0,
      page: 1,
      per: CONST.PER
    },
  },

  mutations: {
    appendEvents (state, events) {
      state.events = state.events.concat(events)
    },
    setIsLoading (state) {
      state.isLoading = true
    },
    setIsAllLoaded (state) {
      state.isAllLoaded = true
    },
    setIsShowSearchDialog (state) {
      state.isShowSearchDialog = true
    },
    setSearchQuery (state, query) {
      state.searchQuery = query
    },
    setPager (state, pager) {
      state.pager = {
        ...state.pager,
        ...pager
      }
    },
    unsetEvents (state) {
      state.events = []
    },
    unsetIsLoading (state) {
      state.isLoading = false
    },
    unsetIsAllLoaded (state) {
      state.isAllLoaded = false
    },
    unsetIsShowSearchDialog (state) {
      state.isShowSearchDialog = false
    },
    unsetSeachQuery (state) {
      state.searchQuery = {
        title: '',
        wantOnlyMine: false
      }
    },
    unsetPager (state) {
      state.pager = {
        total: 0,
        page: 1,
        per: CONST.PER
      }
    }
  },

  actions: {
    // APIからカラオケの詳細を取得する
    fetchEvents ({ state, commit }) {
      commit('setIsLoading')

      const params = {
        page: state.pager.page,
        per: state.pager.per,
        title: state.searchQuery.title,
        sort_order: 'desc',
        members: state.searchQuery.wantOnlyMine ? [9] : null // TODO: ログインユーザに差し替え
      }
      http.getEvents(params).then((response) => {
        commit('appendEvents', response.data)
        commit('unsetIsLoading')
        commit('setPager', { total: Number(response.headers['total-count']) })

        if (response.data.length == 0) {
          commit('setIsAllLoaded')
        } else {
          commit('unsetIsAllLoaded')
        }
      })
    },
    // ページを切り替える
    pageIncrement ({ state, commit }) {
      commit('setPager', { page:  state.pager.page + 1 })
    },
    // 検索ダイアログを表示する
    showSearchDialog ({ commit }) {
      commit('setIsShowSearchDialog')
    },
    // 検索を実行せずに検索ダイアログを閉じる
    cancelSearchDialog ({ commit }) {
      commit('unsetSeachQuery')
      commit('unsetIsShowSearchDialog')
    },
    // 検索を実行して検索ダイアログを閉じる
    submitSearchDialog ({ commit }, query) {
      commit('setSearchQuery', query)
      commit('unsetPager')
      commit('unsetEvents')
      commit('unsetIsAllLoaded')
      commit('unsetIsShowSearchDialog')
    },
  }
}
