<template>
    <div>
        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="rendiciones"
            :pagination.sync="pagination"
            select-all
            item-key="fondo"
            class="elevation-1"
        >
            <template slot="headers" slot-scope="props">
            <tr>
                <th>
                <v-checkbox
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    primary
                    hide-details
                    @click="toggleAll" 
                ></v-checkbox>
                </th>
                <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['text-xs-left', 'column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
                >
                
                {{ header.text }}
                <v-icon small>arrow_upward</v-icon>
                </th>
            </tr>
            </template>

            <template slot="items" slot-scope="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
                <td>
                <v-checkbox
                    :input-value="props.selected"
                    primary
                    hide-details
                ></v-checkbox>
                </td>
                <td class="text-xs-left">{{ props.item.fondo }}</td>
                <td class="text-xs-left">{{ props.item.fechainicio }}</td>
                <td class="text-xs-left">{{ props.item.fechafin }}</td>
                <td class="text-xs-left">{{ props.item.total }}</td>
                    <td class="justify-center layout px-0">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editItem(props.item)"
                        >
                            edit
                        </v-icon>
                        <v-icon
                            small
                            @click="deleteItem(props.item)"
                        >
                            delete
                        </v-icon>
                    </td>     
            </tr>
            </template>
        </v-data-table>

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

    </div>
</template>


<script>
import FormularioRendiciones from '@/components/FormularioRendiciones.vue'
import TablaBoletas from '@/components/TablaBoletas.vue'



export default {
    name: "TablaRendiciones",

    data: () => ({

        name: "TablaRendiciones",
        selected: [],    
        rendiciones: [],
        boletas: [],
        API: 'http://localhost:3000/boletas', //cargar datos con: json-server --watch boletas.json
        APIb: 'http://localhost:3000/rendiciones',

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
        },

        pagination: {
            sortBy: 'fondo'
        },

        headers: [
            { text: 'Fondo',        align: 'left', value: 'fondo'},
            { text: 'Fecha Inicio', align: 'left', value: 'fechainicio' },
            { text: 'Fecha Fin',    align: 'left', value: 'fechafin' },
            { text: 'Total',        align: 'left', value: 'total' },
            { text: 'Estado',       align: 'left', value: 'estado' },
        ],

        headersb: [
            { text: 'ID',               align: 'left', value: 'id' },
            { text: 'Numero Boleta',    align: 'left', value: 'boleta' },
            { text: 'Tipo de Gasto',    align: 'left', value: 'gasto' },
            { text: 'Fecha',            align: 'left', value: 'fecha' },
            { text: 'Monto',            align: 'left', value: 'monto' },
            { text: 'Foto',             align: 'left', value: 'foto' },     
        ],
                
        
        }),

        created () {
            let vm = this
            this.$http.get(vm.API).then(response => {                 
                //console.log(response.body); 
                vm.boletas = response.body.boletas;
                //console.log(response.body); 

            });

            this.$http.get(vm.APIb).then(response => {
                vm.rendiciones = response.body;
                //console.log(response.body); 
            })                    
        },

        methods: {
            toggleAll (e) {           
                //console.log(this.boletas.length)
                e.preventDefault();
                e.stopImmediatePropagation();
                console.log('1');
                if (this.selected.length < this.rendiciones.length){
                    this.selected = this.rendiciones.slice();
                    console.log('todos');
                }        
                else{
                    this.selected = [];
                    console.log('ninguno');
                }
                //console.log(this.boletas.slice())
            },

            changeSort (column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } 
                else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },

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

        computed:{
            
        },
    
        components:{
            TablaBoletas            
        }
}
</script>