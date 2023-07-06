<template>
  <NavBar :apis="apis" :selectedAPI="selectedAPI" :disable="disable" :automated="automated" @chooseAPI="(name) => chooseSelectedAPI(name)" @disable="() => {disable = !disable; console.log(disable)}" @automate="() => {automated = !automated; console.log(disable)}"></NavBar>
  <b-container class="contain">
    <b-row>
      <b-col>
        <b-form @submit.prevent="invokeSelectedAPI()">
          <label class="text-label"> Start writing here: {{ checker }}</label>
          <b-form-textarea @keyup="handleText" @paste="handlePaste" id="text-area" type="text" v-model="essay" rows="14" :state="!error? !(essay.trim() === preEssay && prePrompt.trim() === preprePrompt): null"></b-form-textarea>
          <b-overlay id="invoke-button" :show="loading" rounded opacity="0.6" spinner-small spinner-variant="primary" class="d-inline-block">
            <b-button type="submit" :disabled="loading"> Invoke API </b-button>
          </b-overlay>
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
                style="background-color: rgba(215, 237, 250, 0.756);"
                class="mb-2"
              > 
              <b-card-sub-title><b-badge style="background-color:rgb(80, 157, 132); margin: 3px 0 8px 0;" @click="handle_set_prompt">{{ set_prompt === 'default'? 'Set to a general prompt':'Set to an LEQ specific prompt' }}</b-badge></b-card-sub-title>
                <b-card-text>
                  <b-form-group description="Type 000 to indicate where the user submitted writing should be injected.">
                    <b-form-textarea  class="big-idea" id="prompt-area" type="text" rows="7" placeholder="dd" :value="prePrompt" v-model="prePrompt" style="font-size: 15px;">
              
                    </b-form-textarea>
                  </b-form-group>
                </b-card-text>
              </b-card>
            
            </b-tab>
            <b-tab title="Responses" active>
              <div style="height: 62vh; overflow-y: auto;">
                <b-card v-show="tumble" border-variant="light" style="object-fit: contain; width: 300px; margin: auto; padding-top: 10%; opacity: 0.4;">
                  <b-card-img id="target-img" bottom :src="require('../assets/robot.png')" alt="Image 21" style="width: 200px;"></b-card-img>   
                  <b-popover target="target-img" triggers="hover" placement="top">
                    <a href="https://www.flaticon.com/free-icons/robot" title="robot icons">Robot icons created by Freepik - Flaticon</a>
                  </b-popover>
                  <b-card-text style="font-family:'Courier Prime', monospace; padding-top: 20px;">Do something...</b-card-text>          
                </b-card>
                <b-card v-show="loading">
                    <b-skeleton animation="wave" width="85%"></b-skeleton>
                    <b-skeleton animation="wave" width="55%"></b-skeleton>
                    <b-skeleton animation="wave" width="70%"></b-skeleton>
                  </b-card>
                <div v-for="response in responses" :key="response.prompt">
                  <b-alert show class="big-idea" style="margin: 5px; text-align: left; font-size: 14px;letter-spacing: 0.12em; word-spacing: 0.16em; line-height: 1.8em;">
                    <b-badge variant="light" style="color: black; background-color: rgba(255, 241, 48, 0.69);">{{ response.API}}</b-badge>
                    {{response.output}}
                  </b-alert>
                </div>   
              </div>
              <b-button @click="responses = []; tumble = true" variant="danger" :disabled="!responses.length" style="margin-top: 10px;">Clear</b-button>
            </b-tab>
          </b-tabs>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import call_PaLM2 from '../api/palm/index'
import call_jurassic from '../api/jurassic/index'
import call_chatGTP from '../api/chatGPT/index'
import call_cohere from '../api/cohere/index'
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
    const error = ref(true)
    const changes = ref(0)
    const preprePrompt = ref('Please provide feedback on how to improve the following sentence(s). List some areas to improve, such as grammar, topic, elaboration, and more. Assume you are evaluating the response and need to provide a score from 0, which is completely inadequate, to 100, which is perfect. Here is the writing that you will evaluate: 000')
    const preEssay = ref('')
    var lock = false
    const set_prompt = ref('AP')

    const handle_set_prompt = () => {
      if (set_prompt.value === 'AP') {
        prePrompt.value = apPrompt.value
        set_prompt.value = 'default'
      } else if (set_prompt.value === 'default') {
        prePrompt.value = defaultPrompt.value
        set_prompt.value = 'AP'
      }
    }

    const checker = computed(() => {
      var list = essay.value.split(' ')
      list = list.filter((elem) => {return elem !== ''}) 
      return list.length
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
    const apPrompt = ref('Hello! I\'m seeking feedback on my AP World History practice questions. Below, you\'ll find my writing piece that responds to one of the long-form, short-form, or document-based questions you encounter in the test. I would appreciate it if you could provide constructive feedback on my responses and grade them based on the AP World History rubric. Thank you for your assistance!\n\nHere is my writing piece: 000\n\nAdditionally, based on the AP World History rubric, please evaluate and grade each response on a scale of 1-7, where 1 represents the lowest performance and 7 represents the highest performance. Only provide a point if the writing adequately contains each of the following categories. Your feedback and grading will be greatly appreciated!\n\nAP World History Rubric:\n\n1.Thesis/Claim\n2.Contextualization\n3.Evidence\n4.Analysis & Reasoning\n5.Organization & Structure\n6.Concluding statement\n7.Use of Historical Evidence\n\nPlease provide your evaluation and grade the response based on the rubric. Thank you!')
    const defaultPrompt = ref('Please provide feedback on how to improve the following sentence(s). List some areas to improve, such as grammar, topic, elaboration, and more. Assume you are evaluating the response and need to provide a score from 0, which is completely inadequate, to 100, which is perfect. Here is the writing that you will evaluate: 000')
    const prePrompt = ref('Please provide feedback on how to improve the following sentence(s). List some areas to improve, such as grammar, topic, elaboration, and more. Assume you are evaluating the response and need to provide a score from 0, which is completely inadequate, to 100, which is perfect. Here is the writing that you will evaluate: 000')
    const selectedAPI = ref('PaLM2')
    const previousPrompt = ref('')
    const chooseSelectedAPI = (name) => {
      console.log(name)
      previousPrompt.value = ''
      selectedAPI.value = name
    }

    const invokeSelectedAPI = async () => {
      console.log('calling2?')
      if (!disable.value && essay.value) {
        let prompt = prePrompt.value.replace(/000/g, `\"${essay.value}\"`)
        if ((responses.length === 0 || prompt !== previousPrompt.value) && essay.value !== '') {
          console.log("check")
          console.log(selectedAPI.value)
          console.log(selectedAPI.value === 'cohere')
          let attachAPI = selectedAPI.value
          tumble.value = false
          loading.value = true
          if (selectedAPI.value === 'PaLM2') {
            let output = await call_PaLM2(prompt)
            if (output) {
              loading.value = false
              console.log(output)
              previousPrompt.value = prompt
              preprePrompt.value = prePrompt.value.trim()
              preEssay.value = essay.value.trim()
              lock = false
              changes.value = 0
              responses.value.unshift({output: output, prompt: prompt, API: attachAPI})
              console.log("responses: " + responses.value.length)
            }
          } else if (selectedAPI.value === 'Jurassic2') {
            let output = await call_jurassic(prompt)
            if (output) {
              loading.value = false
              console.log(output)
              previousPrompt.value = prompt
              preprePrompt.value = prePrompt.value.trim()
              preEssay.value = essay.value.trim()
              lock = false
              changes.value = 0
              responses.value.unshift({output: output, prompt: prompt, API: attachAPI})
              console.log("responses: " + responses.value.length)
            }
          } else if (selectedAPI.value === 'chatGTP') {
            let output = await call_chatGTP(prompt)
            if (output) {
              loading.value = false
              console.log(output)
              previousPrompt.value = prompt
              preprePrompt.value = prePrompt.value.trim()
              preEssay.value = essay.value.trim()
              lock = false
              changes.value = 0
              responses.value.unshift({output: output, prompt: prompt, API: attachAPI})
              console.log("responses: " + responses.value.length)
            }
          }
         else if (selectedAPI.value === 'cohere') {
          console.log('calling1?')
            let output = await call_cohere(prompt)
            if (output) {
              loading.value = false
              console.log(output)
              previousPrompt.value = prompt
              preprePrompt.value = prePrompt.value.trim()
              preEssay.value = essay.value.trim()
              lock = false
              changes.value = 0
              responses.value.unshift({output: output, prompt: prompt, API: attachAPI})
              console.log("responses: " + responses.value.length)
            }
          }
        
        else {
          error.value = false
        }
      }
      } else {
        console.log('fail to call')
        console.log(essay.value, disable.value)
        console.log(!disable && essay.value)
        tumble.value = false
        responses.value.push({output: "    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", prompt: "whatever", API: 'Daniel'})
        // console.log("responses: " + responses.value.length)
      }
    }

    //AUTOMATION 
    const limit = ref(200)
    var on_the_lookout = false
    var ellipsis_event = false
    const handleText = (e) => {
      if (!lock && automated) {
        if (e.key === '.' && !on_the_lookout && changes.value >= limit.value){
          on_the_lookout = true
          console.log('on the lookout!')
        } else if (on_the_lookout && e.key === '.') {
          ellipsis_event = true
          console.log('it\'s an ellipsis!')
        } else if (on_the_lookout && e.key !== '.' && !ellipsis_event && changes.value >= limit.value) {
          changes.value = 0
          on_the_lookout = false
          console.log('allowed to invoke API!')
          lock = true
          invokeSelectedAPI()
        } else {
          if (ellipsis_event && e.key !== '.') {
            on_the_lookout = false 
            ellipsis_event = false
            console.log('avoided the ellipsis event!')
          }
          changes.value += 1
          console.log(changes.value)
        }
      }
    }
    var trigger = false
    const handlePaste = (e) => {
      if (!lock && automated) {
        let paste = (e.clipboardData || window.clipboardData).getData("text");
        paste = paste.trim()
        changes.value += paste.length
        if (changes.value >= limit.value) {
          if (paste.charAt(paste.length - 1) === '.') {
            lock = true
            console.log('paste event invoke API!')
            console.log('point of interest', essay.value)
            trigger = true
          }
        }
        console.log(paste, paste.length, essay.value)
      }
    }

    watch(essay, (newEssay) => {
      if (trigger) {
        console.log((essay.value))
        invokeSelectedAPI()
        trigger = false
      }
    })
    return { automated, essay, checker, static_checker, disable, invoke_checker, 
      apis, name, endpoint, key, upload_api,
      invokeSelectedAPI, chooseSelectedAPI, selectedAPI,
      prePrompt, responses, loading, tumble, previousPrompt, error,
      preprePrompt, preEssay,
      handleText, handlePaste, lock, set_prompt,
      handle_set_prompt
     }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime&family=Inter&display=swap');
.text-label {
  width: 100%;
  /* border: 1px solid red; */
  text-align: left;
  font-family: 'Courier Prime', monospace;
  font-size: 1.55rem;
}
.contain {
  margin:auto;
  padding-top:30px;
}
#prompt-area {
  padding: 20px;
  border-bottom: 20px solid white;
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
.big-idea {
  letter-spacing: 0.12em; word-spacing: 0.16em; line-height: 1.8em;
}

</style>