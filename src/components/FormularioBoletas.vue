<template>

    <v-layout row justify-center> <!-- nueva boleta -->
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
                    :items="['Estacionamiento', 'Peajes', 'Alimentación', 'Alojamiento', 'Otros Gastos']"
                    label="Tipo de Gasto"
                    required
                  ></v-select>
                </v-flex>

                <!--  
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Nombre*" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Apellidos" hint="example of helper text only on focus"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="RUT" 
                    required
                  ></v-text-field>
                </v-flex>

                -->

                <v-flex md6>
                  <v-text-field label="Numero de Boleta" required></v-text-field>
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
                        v-model="date"
                        label="Fecha de Boleta"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="date" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>                  
                </v-layout>

                <v-spacer></v-spacer>
                
                <v-flex md6>
                  <v-text-field label="Monto" prefix="$" required></v-text-field>
                </v-flex>
                
                <v-flex sm6>
                  <v-text-field label="Motivo" required></v-text-field>
                </v-flex>
                
              </v-layout>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>


          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat="flat" @click="closeThisDialog">Close</v-btn>
            <v-btn color="blue darken-1" flat="flat" @click="loadData">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    
</template>

<script>
export default {
    name: "FormularioBoletas",
    props: {

        //date: Date,
        //menu: Boolean,
        //modal: Boolean,
        //menu2: Boolean,
        //dialog: Boolean,

        API: String
    }, 

    data: function () {
            
            return {
                dialog:false,
                date: new Date().toISOString().substr(0, 10),
                menu: false,
                modal: false,
                menu2: false,
                APIi: 'http://localhost:3000/boletas',

                datos: {                    
                    id: '',
                    boleta: '',
                    gasto: '',
                    fecha: '',
                    monto: '',
                    foto: ''
                }
                
            }
        },

        methods:{
            closeThisDialog(){
                
            this.dialog = !this.dialog                
            console.log("dialog closed")
                
            },

            loadData(){

                let vm = this
                this.$http.get(vm.APIi).then(response => {
                    console.log(response.body.length + ": tamaño")
                    this.ide= response.body.length +1               //numero de datos en json 
                    console.log("ide: "+ this.ide)             
                })
                
                this.$http.post(vm.APIi, {   
                    
                    id: this.ide,
                    boleta: this.datos.boleta,
                    gasto: this.datos.gasto,
                    fecha: this.datos.fecha,
                    monto: this.datos.monto,
                    foto: this.datos.foto
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
      
    
}
</script>
