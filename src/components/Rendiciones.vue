<template>
    <div>

        <TablaRendiciones/>
        <!--<FormularioRendiciones @newRow="reload"/>-->
    

    
    </div>
</template>

<script>
    import TablaRendiciones from '@/components/TablaRendiciones.vue'
    //import FormularioRendiciones from '@/components/FormularioRendiciones.vue'

    props: {
        
    }
     export default {
        name: "rendiciones",
        //date1: new Date().toISOString().substr(0, 10),
        //date2: new Date().toISOString().substr(0, 10),
        menu: false,
        modal: false,
        menu2: false,
        //dialog: false,


        methods:{
            reload(){
                location.reload(true)
            }
        },
        
        components: {
            TablaRendiciones,
            //FormularioRendiciones
        }

    
  }
</script>
