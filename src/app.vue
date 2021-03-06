<template>
  <main>
    <settings-dialog id="settings_dialog" @saved="updateSettings"></settings-dialog>
    <header>
      <section>
        <i id="icon" class="fas fa-tint header_icon"></i>
        <form @submit.prevent="sendQuery">
          <input id="search" v-model="input" type="text"
          placeholder="Search for a city" autocomplete="off">
        </form>
        <a id="search_icon" @click="sendQuery">
          <i class="fas fa-search header_icon"></i>
        </a>
      </section>
      <section>
        <nav>
          <a>
            <i id="loading_spinner" class="fas fa-spinner header_icon"></i>
          </a>
          <a @click="promptForGPS(false)">
            <i class="fas fa-map-marker fa-fw header_icon"></i>
          </a>
          <a @click="openSettings">
            <i class="fas fa-cog fa-fw header_icon"></i>
          </a>
        </nav>
      </section>
    </header>
    <main-app :query="query" :id="id" :position="position" :update="update"></main-app>
    <div id="watermark_text">
      Weather data provided by <a target="_blank" ref="noopener noreferrer" href="https://openweathermap.org/">OpenWeatherMap</a>
    </div>
  </main>
</template>

<script>
  import Main from './components/main.vue';
  import Dialog from './components/dialog.vue';

  export default {
    data () {
      return {
        input: '',
        query: '',
        id: '',
        position: '',
        update: ''
      }
    },
    components: {
      'main-app': Main,
      'settings-dialog': Dialog
    },
    created: function() {
      if (!window.localStorage || !localStorage.getItem('castform-visited')) {
        localStorage.setItem('castform-visited', 'true');
        localStorage.setItem('castform-default-location', 'Toronto');
        localStorage.setItem('castform-fahrenheit', 'false');
      }
      this.promptForGPS(true);
    },
    methods: {
      sendQuery: function() {
        if (this.input.length > 0) {
          this.query = this.input;
          document.getElementById('loading_spinner').style.opacity = 1;          
        }
      },
      sendPosition: function(pos) {
        this.position = pos;
      },
      sendDefaultLocation: function() {
        this.query = localStorage.getItem('castform-default-location');
      },
      sendLastLocation: function() {
        this.id = localStorage.getItem('castform-last-id');
      },
      promptForGPS: function(initialLoad) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.sendPosition, this.sendDefaultLocation);
        } else {
          this.sendDefaultLocation();
        }
        if (!initialLoad) {
          document.getElementById('loading_spinner').style.opacity = 1;
        }
      },
      openSettings: function() {
        document.getElementById('settings_dialog').classList.add('dialog_open');
      },
      updateSettings: function(time) {
        this.update = time;
        document.getElementById('loading_spinner').style.opacity = 1;
        this.sendLastLocation();
      }
    }
  }
</script>

<style>
  :root {
    --weather-clear-day: deepskyblue;
    --weather-mixed-day: skyblue;
    --weather-overcast-day: #bbb;
    --weather-rain-day: #999;
    --weather-thunderstorm-day: grey;
    --weather-snow-day: #ccc;
    --weather-clear-night: #001f3a;
    --weather-overcast-night: #1e1e1e;
    --search-background-day: rgba(0, 0, 0, 0.1);
    --search-background-night: rgba(255, 255, 255, 0.1);
    --shadow: rgba(0, 0, 0, 0.2);
  }
  html {
    height: 100vh;
  }
  body {
    height: 100%;
    margin: 0;
    background-color: grey;
    transition: background-color 1s;
    color: rgba(255, 255, 255, 0.9);
  }
  main {
    font-family: 'Open Sans', sans-serif;
    position: relative;
    text-shadow: 0px 1px 2px var(--shadow);
    height: 100%;
  }
  h1, h2 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    color: white;
  }
  header {
    display: flex;
    flex-direction: row;
    background: linear-gradient(rgba(0, 0, 0, 0.1), transparent);
    height: 56px;
  }
  header section {
    display: inline-flex;
    flex: 1;
    justify-content: center;
    margin: auto;
  }
  header section:first-child {
    justify-content: flex-start;
    margin-left: 1rem;
  }
  header section:last-child {
    justify-content: flex-end;
    margin-right: 1rem;
  }
  header a {
    margin: 0.5em;
    transition: 0.25s color;
    cursor: pointer;
  }
  header a:hover {
    color: white;
  }
  header nav a:first-child {
    margin-left: 0;
  }
  header nav a:last-child {
    margin-right: 0;
  }
  form {
    margin: auto 0;
  }
  #search {
    background: var(--search-background-day);
    transition: background 1s;
    border: none;
    border-radius: 2px;
    padding: 8px;
    color: white;
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    width: 10em;
  }
  #search::placeholder {
    color: rgba(255, 255, 255, 0.33);
  }
  #search_icon {
    margin: auto 1em;
  }
  #icon {
    color: #b7eaff;
    background-color: #0066db;
    width: 1.5rem;
    padding: 0.5rem;
    border-radius: 50%;
    margin-right: 0.5em;
  }
  .header_icon {
    font-size: 1.5em;
    filter: drop-shadow(0px 1px 2px var(--shadow));
  }
  .header_icon:active {
    color: rgba(255, 255, 255, 0.5);
  }
  #loading_spinner {
    opacity: 1;
    margin-left: 0.5rem;
    animation-name: loading;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: steps(8);
    cursor: default;
    transition: opacity 0.1s;
  }
  #loading_spinner:active, #loading_spinner:hover {
    color: rgba(255, 255, 255, 0.9);
  }
  #watermark_text {
    position: fixed;
    bottom: 0.5rem;
    right: 1rem;
    color: rgba(255, 255, 255, 0.33);
    font-size: 0.75rem;
  }
  #watermark_text a {
    text-decoration: none;
    color: inherit;
  }
  @keyframes loading {
    0% { transform: rotate(0); }
    100% { transform: rotate(360deg); }
  }
  @media (max-width: 480px) {
    header section:first-child {
      flex: 0;
    }
    #search_icon {
      display: none;
    }
  }
</style>
