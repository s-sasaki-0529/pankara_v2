/**
  カラオケ一覧画面のストア
*/
import http from '../lib/http'
import CONST from '../lib/constants'
export default {
  state: {
    // APIからフェッチしたカラオケ一覧
    events: [],
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
      totalPages: 0,
      page: 1,
      per: CONST.PER
    },
  },

  mutations: {
    setEvents (state, events) {
      state.events = events
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
        totalPages: 0,
        page: 1,
        per: CONST.PER
      }
    }
  },

  actions: {
    // APIからカラオケの詳細を取得する
    fetchEvents ({ state, commit, dispatch }) {
      dispatch('showLoadingView')

      const params = {
        page: state.pager.page,
        per: state.pager.per,
        title: state.searchQuery.title,
        sort_order: 'desc',
        members: state.searchQuery.wantOnlyMine ? [9] : null // TODO: ログインユーザに差し替え
      }
      http.getEvents(params).then((response) => {
        commit('setEvents', response.data)
        dispatch('hideLoadingView')
        commit('setPager', {
          total: Number(response.headers['total-count']),
          totalPages: Number(response.headers['total-pages'])
        })
      })
    },
    // ページを切り替える
    changePage ({ state, commit }, page) {
      commit('setPager', { page: page })
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
      commit('unsetIsShowSearchDialog')
    },
  }
}
