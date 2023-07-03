<template>
  <NavBar :apis="apis" :selectedAPI="selectedAPI" :disable="disable" @chooseAPI="(name) => chooseSelectedAPI(name)" @disable="() => {disable = !disable; console.log(disable)}"></NavBar>
  <b-container class="contain">
    <b-row>
      <b-col>

        <b-form @submit.prevent="invokeSelectedAPI()">
          <label class="text-label"> Start writing here: </label>
          <b-form-textarea id="text-area" type="text" v-model="essay" rows="14"></b-form-textarea>
          <b-button id="invoke-button" type="submit" v-if="!automated" :disabled="loading"> Invoke API </b-button>
        </b-form>
        <div v-show="false">
            <div>
              You have written {{ automated ? checker : static_checker }} words
            </div>
            <label for="">Select LLM: </label>
            <div v-for="api in apis" :key="api.key">
              <button @click="chooseSelectedAPI(api.name)"> {{ api.name }} </button>
            </div>
        </div>
        <div v-show="false">
          <form @submit.prevent="upload_api()">
            <input type="text" placeholder="Display name" required v-model="name">
            <input type="text" placeholder="Endpoint" required v-model="endpoint">
            <input type="text" placeholder="Key" required v-model="key">
            <button>Submit API</button>
          </form>
        </div>
      </b-col>
      <b-col>
        <div>
          <b-tabs content-class="mt-3" align="right">
            <b-tab title="prePrompt">

              <b-card
                title="Provide a prompt:"
                style=""
                class="mb-2"
              >
                <b-card-text>
                  <b-form-group description="Type 000 to indicate where the user submitted writing should be placed.">
                    <b-form-textarea id="prompt-area" type="text" rows="7" placeholder="dd" :value="prePrompt" v-model="prePrompt"></b-form-textarea>
                  </b-form-group>
                </b-card-text>
              </b-card>
            
            </b-tab>
            <b-tab title="Responses" active>
              <b-card v-show="tumble" border-variant="light" style="object-fit: contain; width: 30vw; margin: auto; padding-top: 10%; opacity: 0.4;">
                <b-card-img bottom :src="require('../assets/tumbleweed.png')" alt="Image 21"></b-card-img>   
                <b-card-text style="font-family:'Courier Prime', monospace;">Do something...</b-card-text>          
              </b-card>
              <b-card v-show="loading">
                  <b-skeleton animation="wave" width="85%"></b-skeleton>
                  <b-skeleton animation="wave" width="55%"></b-skeleton>
                  <b-skeleton animation="wave" width="70%"></b-skeleton>
                </b-card>
              <div v-for="response in responses" :key="response.prompt">
                <b-alert v-show="!loading" show>{{response.output}}</b-alert>
              </div>   

            </b-tab>
          </b-tabs>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import call_PaLM2 from '../api/palm/index'
import NavBar from '../components/NavBar.vue'
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: { NavBar },
  setup() {
    const store = useStore()
    const automated = ref(false)
    const essay = ref('')
    const static_checker = ref(0)
    const apis = computed(() => store.state.data.apis)
    const disable = ref(false)
    const loading = ref(false)
    const tumble = ref(true)
    const checker = computed(() => {
      const list = essay.value.split(' ')
      return list[list.length - 1] === '' ? list.length - 1 : list.length
    })

    const invoke_checker = () => {
      const list = essay.value.split(' ')
      static_checker.value = list[list.length - 1] === '' ? list.length - 1 : list.length
    }

    const name = ref('')
    const endpoint = ref('')
    const key = ref('')
    const upload_api = () => {
      store.commit('upload_api', {name: name.value, endpoint: endpoint.value, key: key.value})
    }

    // API 
    const responses = ref([])
    const prePrompt = ref('Please provide feedback on how to improve the following sentence(s). List some areas to improve, such as grammar, topic, eleboration, and more. Assume you are evaluating the response and need to provide a score from 0, which is completely inadequte, to 100, which is perfect. Here is the writing that you will evaluate: 000')
    const selectedAPI = ref('PaLM2')
    var previousPrompt = ''
    const chooseSelectedAPI = (name) => {
      selectedAPI.value = name
    }

    const invokeSelectedAPI = async () => {
      if (disable && essay.value) {
        let prompt = prePrompt.value.replace(/000/g, `\"${essay.value}\"`)
        if (responses.length === 0 || prompt !== previousPrompt && essay.value !== '') {
          console.log("check")
          if (selectedAPI.value === 'PaLM2') {
            tumble.value = false
            loading.value = true
            let output = await call_PaLM2(prompt)
            if (output) {
              loading.value = false
              console.log(output)
              previousPrompt = prompt
              responses.value.push({output: output.candidates[0].content, prompt: prompt})
              console.log("responses: " + responses.value.length)
            }
          }
        }
      } else {
        console.log('fail to call')
        console.log(essay)
        // responses.value.push({output: essay.value, prompt: "whatever"})
        // console.log("responses: " + responses.value.length)
      }
    }
    return { automated, essay, checker, static_checker, disable, invoke_checker, 
      apis, name, endpoint, key, upload_api,
      invokeSelectedAPI, chooseSelectedAPI, selectedAPI,
      prePrompt, responses, loading, tumble
     }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');
.text-label {
  width: 100%;
  /* border: 1px solid red; */
  text-align: left;
  font-family: 'Courier Prime', monospace;
  font-size: 1.75rem;
}
.contain {
  margin: 30px 0 0 5px;
}
#prompt-area {
  padding: 20px;
  resize: none;
  text-align: justify;
}
#text-area {
  height: 65vh;
}
#invoke-button {
  width: 100%;
  margin: 10px 0 0 0;
}
</style>