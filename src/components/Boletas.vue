 <template>

  <div class="boletas">
    
    <TablaBoletas/>
    <!--<formularioBoletas/>--> 
        
  </div>

</template>


<script>
  import TablaBoletas from '@/components/TablaBoletas.vue'
  


  export default {
    name: "Boletas",
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    dialog: false,

    

    components: {
      
      TablaBoletas
    }
  }
</script>