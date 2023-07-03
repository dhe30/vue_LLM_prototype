<template>
    
  <div>
    <b-navbar toggleable="lg" type="light" id="b-navbar">
        <b-navbar-brand href="#">Proto type</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-button-group v-for="api in apis" :key="api.name">
                <b-button @click="$emit('chooseAPI', api.name)" :variant="api.name === selectedAPI? 'primary': 'outline-primary'"> {{ api.name }}</b-button>
            </b-button-group>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-button-group>
                <b-button disabled> Automate </b-button>
                <b-button @click="$emit('disable')" :variant="disable? 'success' : 'danger'"> {{ disable? 'Disabled' : 'Disable' }} </b-button>
            </b-button-group>
        </b-navbar-nav>
        </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
    name: 'NavBar',
    props: [ 'apis', 'selectedAPI', 'disable' ]
}
</script>

<style>
    #b-navbar {
        padding: 20px 0 0 20px;
    }
    .ml-auto {
        margin-left: auto;
        padding: 0 20px 0 0;
    }
</style>