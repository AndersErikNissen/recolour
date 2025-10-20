<script setup>
import IconLogo from './components/icons/IconLogo.vue';


</script>

<template>
  <header>
    <div>
      <IconLogo />

      <div>
        <button>OPERATOR</button>
        <button>MANAGER</button>
      </div>
    </div>
  </header>

  <aside>

  </aside>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>

</style>
