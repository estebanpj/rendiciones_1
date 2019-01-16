<template>

<div>
  <v-app>
  
    <section>
      <v-navigation-drawer v-model="drawer" fixed app>
        <v-list dense>

          <router-link to="/" >
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>home</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>Inicio</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </router-link>



          <router-link to="/Rendiciones">
            <v-list-tile >
              <v-list-tile-action>
                <v-icon>description</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>Mis Rendiciones</v-list-tile-title>
              </v-list-tile-content>          
            </v-list-tile>
          </router-link>

    
          <router-link to="/Boletas">
            <v-list-tile >
              <v-list-tile-action>
                <v-icon>photo_library</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>Boletas Cargadas</v-list-tile-title>
              </v-list-tile-content>            
            </v-list-tile>
          </router-link>

        </v-list>
      </v-navigation-drawer>

      <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{$route.name}}</v-toolbar-title>
      </v-toolbar>

      <v-content>
        <router-view/>                
      </v-content>

    </section>

    <v-footer color="indigo" app>
      <span class="white--text">&copy; Esteban Pino J. 2018</span>
    </v-footer>

  </v-app>

  </div>

  </template>

<script>
 //import HelloWorld from './components/HelloWorld'
 import Rendiciones from './components/Rendiciones'
 import Boletas from './components/Boletas'
 import TablaBoletas from './components/TablaBoletas'

  export default {

    data: () => ({
      drawer: null
    }),

    components:{
      Rendiciones,
      Boletas,
      TablaBoletas,
      
    },

    
  } 

</script>