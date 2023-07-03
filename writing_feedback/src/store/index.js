import { createStore } from 'vuex'
const { client, MODEL_NAME } = require('../api/palm/index')

export default createStore({
  state: {
    data: { 
      apis: [
        { 
          name: 'PaLM2',
          endpoint: 'N/a', 
          key: 'N/a'
        }, 
        { 
          name: 'Test1',
          endpoint: 'N/a', 
          key: 'N/a'
        }
      ]
    }
  },
  getters: {
  },
  mutations: {
    upload_api(state, payload) { 
      state.data.apis.push(payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
