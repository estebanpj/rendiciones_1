<template>

    <div class="TablaBoletas">
        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="boletas"
            :pagination.sync="pagination"
            select-all
            item-key="id"
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

                    <td class="text-xs-left">{{ props.item.id }}</td>
                    <td class="text-xs-left">{{ props.item.boleta }}</td>
                    <td class="text-xs-left">{{ props.item.gasto }}</td>
                    <td class="text-xs-left">{{ props.item.fecha }}</td>
                    <td class="text-xs-left">{{ props.item.monto }}</td>
                    <td class="text-xs-left">{{ props.item.motivo }}</td>
                    <td class="text-xs-left">{{ props.item.foto }}</td>

                    <td class="justify-center layout px-0">
                        <v-icon
                            small
                            class="mr-2"
                            @click="editItem(props.item.id)"
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

            <v-layout row justify-center> <!-- formulario nueva boleta -->
                <v-dialog v-model="dialog" persistent max-width="600px"> <!-- Ventana emergente nueva boleta -->        
                    <v-btn slot="activator" color="primary" dark>Nueva Boleta</v-btn> <!-- Boton nueva boleta -->        
                    <v-card>
                    <v-card-title>
                        <span class="headline">Nuevo Gasto</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                        <v-layout wrap>

                            <v-flex xs12 > <!--lista de gastos-->
                            <v-select
                                v-model="datos.gasto"
                                :items="['Estacionamiento', 'Peajes', 'Alimentación', 'Alojamiento', 'Otros Gastos']"
                                label="Tipo de Gasto"
                                required
                            ></v-select>
                            </v-flex>

                            <v-flex md6>
                            <v-text-field v-model="datos.boleta" label="Numero de Boleta" required></v-text-field>
                            </v-flex>

                            <v-layout row wrap> <!-- calendario-->
                            <v-flex sm6 class="xs-center">
                                <v-menu
                                ref="menu"
                                :close-on-content-click="false"
                                v-model="menu"
                                :nudge-right="40"
                                :return-value.sync="date"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                min-width="290px"
                                >
                                <v-text-field
                                    slot="activator"
                                    v-model="datos.fecha"
                                    label="Fecha de Boleta"
                                    prepend-icon="event"
                                    readonly
                                ></v-text-field>
                                <v-date-picker v-model="datos.fecha" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.menu.save(datos.fecha)">OK</v-btn>
                                </v-date-picker>
                                </v-menu>
                            </v-flex>                  
                            </v-layout>

                            <v-spacer></v-spacer>
                            
                            <v-flex md6>
                            <v-text-field v-model="datos.monto" label="Monto" prefix="$" required></v-text-field>
                            </v-flex>
                            
                            <v-flex sm6>
                            <v-text-field v-model="datos.motivo" label="Motivo" required></v-text-field>
                            </v-flex>
                            
                        </v-layout>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-card-text>

                    
                    <div>
                        <input  type="file" @change="fileSelected" >
  	                    <a class="button is-primary is-small" @click="uploadFile">Upload</a>
                    </div>
                    
                    <!--
                     <div>
                        <input  type="file" >
  	                    <a class="button is-primary is-small" >Upload</a>
                    </div>
                    -->

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat="flat" @click="closeThisDialog">Close</v-btn>
                        <v-btn color="blue darken-1" flat="flat" @click="loadData">Save</v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
    </div>
    

</template>


<script>
import FormularioBoletas from '@/components/FormularioBoletas.vue'

export default {
    data ()  {
        return{

            name:   "TablaBoletas",
            dialog: false,
            date:   new Date().toISOString().substr(0, 10),
            menu:   false,
            modal:  false,
            menu2:  false,
            API:    'http://localhost:3000/boletas', //cargar datos con: json-server --watch boletas.json
            boletas:  [],
            selected: [],
            editedIndex: -1,

            datos: {                    
                id: '',
                boleta: '',
                gasto: '',
                fecha: '',
                monto: '',
                motivo:'',
                foto: ''
            },

            pagination: {
                sortBy: 'id'
            },
            
            headers: [
                { text: 'ID',               align: 'left', value: 'id' },
                { text: 'Numero Boleta',    align: 'left', value: 'boleta' },
                { text: 'Tipo de Gasto',    align: 'left', value: 'gasto' },
                { text: 'Fecha',            align: 'left', value: 'fecha' },
                { text: 'Monto',            align: 'left', value: 'monto' },
                { text: 'Motivo',           align: 'left', value: 'motivo' },
                { text: 'Foto',             align: 'left', value: 'foto' },
                { text: 'Acciones',         align: 'left', value: 'acciones' },     
            ],
            
        }
    },

    created () {
      let vm = this
      this.$http.get(vm.API).then(response => { 
        
        //console.log(response.body); 
        vm.boletas = response.body;
      })
        
    },

    methods: {
        /*clickeado(){
            console.log(selected)
            props.selected = !props.selected
            console.log(selected)
        },*/

		uploadFile() {  
			let formData = new FormData();
			formData.append('upload_file',this.file)
            formData.append('id',53) 

			this.$http.post( 'http://localhost:8080/src/docs/upload',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
				).then(response=>{	})
                
                .catch(response=>{
					console.log(response);
				});
 
			},
 
			fileSelected:function($event){
                this.file =$event.target.files[0]
            },
        

        toggleAll (e) { 
            
            //console.log(this.boletas.length)
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('1');

            if (this.selected.length < this.boletas.length){
                this.selected = this.boletas.slice();
                console.log('todos');
            }
            
            else{
                this.selected = [];
                console.log('ninguno');
            }
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
            console.log("dialog closed")                
        },

        editItem (item) {
            this.editedIndex = this.boletas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            let vm = this
            const index = this.boletas.indexOf(item)
            console.log('delete: '+ index)
            console.log('delete: '+ item.body)
            console.log('delete: '+ item.id)
            confirm('Are you sure you want to delete this item?') && 
            (this.$http.delete(vm.API , {id: index}/*{body: {id: item.id}}*/ ).then(response =>{
                console.log("status")
            })) && this.boletas.splice(index, 1)
        },
        
        

        loadData(){

            let vm = this
            this.$http.get(vm.API).then(response => {
                console.log(response.body.length + ": tamaño")
                this.ide= response.body.length +1               //numero de datos en json 
                this.datos.id=this.ide
                console.log("ide: "+ this.ide)             
            })

            vm.boletas.push(this.datos)
            console.log(this.datos)
            console.log("datos cargado")
                
            this.$http.post(vm.API, {   
                    
                id: this.ide+1,
                boleta: this.datos.boleta,
                gasto: this.datos.gasto,
                fecha: this.datos.fecha,
                monto: this.datos.monto,
                motivo: this.datos.motivo,
                foto: this.datos.foto
            }) //carga de datos del formulario en json
            .then(response => {

                console.log(this.datos.monto)
                this.closeThisDialog()                    
                //this.reload()
                console.log('fin')
            }, 
            response=> {
                //error callback
            });
        },
        
        reload(){
            location.reload(true)
        }

    }, //fin methods

    components: {
        FormularioBoletas
    }
  
    
}
</script>
