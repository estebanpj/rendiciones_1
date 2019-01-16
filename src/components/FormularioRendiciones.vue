<template>
    <v-layout row justify-center> <!-- nueva rendicion -->
        <v-dialog v-model="dialog" persistent > <!-- Ventana emergente nueva rendicion -->        
            <v-btn slot="activator" color="primary" dark>Nueva Rendición</v-btn> <!-- Boton nueva rendicion -->        
            <v-card>
                <v-card-title>
                    <span class="headline">Asignar Boletas</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>                       

                            <v-flex md12>
                            <v-text-field v-model="datos.fondo" label="Numero de Fondo por Rendir" required></v-text-field>
                            </v-flex>

                            <v-layout row wrap> <!-- calendario-->
                            <v-flex md 12>
                                <v-menu
                                ref="menu1"
                                :close-on-content-click="false"
                                v-model="menu"
                                :nudge-right="40"
                                :return-value.sync="datos.date1"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                                >
                                <v-text-field
                                    slot="activator"
                                    v-model="datos.date1"
                                    label="Fecha Entrega de Fondo"
                                    prepend-icon="event"
                                    readonly
                                ></v-text-field>
                                <v-date-picker v-model="datos.date1" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.menu1.save(datos.date1)">OK</v-btn>
                                </v-date-picker>
                                </v-menu>
                            </v-flex>                  
                            </v-layout>

                            <v-layout row wrap> <!-- calendario-->
                            <v-flex md12>
                                <v-menu
                                ref="menu2"
                                :close-on-content-click="false"
                                v-model="menu2"
                                :nudge-right="40"
                                :return-value.sync="datos.date2"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                                >
                                <v-text-field
                                    slot="activator"
                                    v-model="datos.date2"
                                    label="Fecha Rendición de Fondo"
                                    prepend-icon="event"
                                    readonly
                                ></v-text-field>
                                <v-date-picker v-model="datos.date2" 
                                                no-title 
                                                scrollable
                                                reactive
                                                value="dd-mm-YYYY"
                                                >
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.menu2.save(datos.date2)">OK</v-btn>
                                </v-date-picker>
                                </v-menu>
                            </v-flex>                  
                            </v-layout>

                            <v-spacer></v-spacer>
                            
                            <v-flex md6>
                            <v-text-field v-model="datos.monto" label="Monto" prefix="$" required></v-text-field>
                            </v-flex>
                            
                            <v-container grid-list-md>
                                <tablaBoletas/>
                            </v-container>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat="flat" @click= "closeThisDialog">Close</v-btn>
                                <v-btn color="blue darken-1" flat="flat" @click= "loadData">Save</v-btn>
                            </v-card-actions>
                        </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import TablaBoletas from '@/components/TablaBoletas.vue'
import TablaRendicionesVue from './TablaRendiciones.vue';
    
    
    export default {
        
        name: "FormularioRendiciones",
        props:{           
            rendiciones: []
            //dialogue: Boolean
        },

        data: function () {
            
            return {
                date1: new Date().toISOString().substr(0, 10),
                date2: new Date().toISOString().substr(0, 10),
                menu: false,
                menu2: false,
                dialog:false,
                APIb: 'http://localhost:3000/rendiciones', //cargar datos con: json-server --watch boletas.json
                newRendicion: {},
                
                datos: {
                fondo: '',                    
                date1: '',
                date2: '',
                monto: '',
                estado: 'Enviada'
                }
            }
        },

        methods:{
            closeThisDialog(){
                
            this.dialog = !this.dialog
                
            console.log("dialog closed" + this.datos.fondo)
                
            },        

            loadData(){

                let vm = this
                this.$http.get(vm.APIb).then(response => {
                    console.log(response.body.length + ": tamaño")
                    this.ide= response.body.length +1               //numero de datos en json 
                    console.log("ide: "+ this.ide)             
                })
                
                this.$http.post(vm.APIb, {   
                    id: this.ide,
                    fondo: this.datos.fondo,                    
                    fechainicio: this.datos.date1,
                    fechafin: this.datos.date2,
                    total: this.datos.monto,
                    estado: this.datos.estado
                }) //carga de datos del formulario en json
                .then(response => {

                    console.log(this.datos.monto)
                    this.closeThisDialog()                    
                    this.$emit("newRow")
                    console.log('fin')

                }, response=> {
                    //error callback
                });
            },
        },

        components: {
            TablaBoletas
        }
        
        
    
    }

</script>
