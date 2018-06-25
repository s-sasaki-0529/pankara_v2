import Vue        from 'vue'
import Vuex       from 'vuex'
import VueRouter  from 'vue-router'
import Vuetify    from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css'
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css'
import Events     from './vuex/events'
import Event      from './vuex/event'
import PageLayout from './component/PageLayout'
import PageEvents from './component/page/events/PageEvents'
import PageEvent  from './component/page/event/PageEvent'
import ROUTES     from './lib/routes'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Vuetify)

// URLに対応するコンポーネントを定義
const routes = [
  { path: ROUTES.EVENTS_PATH(), component: PageEvents },
  { path: ROUTES.EVENT_PATH(':id'), component: PageEvent },
]

// vuexモジュールを定義
const store = new Vuex.Store({
  modules: {
    events: Events,
    event: Event,
  }
})

// ページ全体をVueコンポーネント化
new Vue({
  store,
  router: new VueRouter({ routes }),
  components: {
    PageLayout: PageLayout
  }
}).$mount('#app')
