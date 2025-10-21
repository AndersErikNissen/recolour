<script setup>
import FilledButton from './FilledButton.vue';
import IconLogo from './icons/IconLogo.vue';

const links = [
  {
    path: '/',
    title: 'Dashboard',
  },
  {
    path: '/tickets/queue',
    title: 'Queue',
  },
  {
    path: '/approved-photos',
    title: 'Approved photos',
  },
  {
    path: '/partners',
    title: 'Partners',
  },
];


</script>

<template>
  <header class="inline-block shrink-0">
    <div class="rounded-3xl bg-brand-950 text-brand-50 text-sm p-3 sticky top-3">
      <div class="flex justify-center pt-6 pb-8 relative">
        <div class="w-24">
          <IconLogo />
        </div>
        <RouterLink class="absolute size-full" to="/" />
      </div>
  
      <navigation class="block">
        <ul class="font-sans flex flex-col items-stretch">
          <li class="grid" v-for="link in links" :key="link">
            <RouterLink activeClass="bg-brand-900" :to="link.path" class="p-3 px-5 rounded-full">
              {{ link.title }}
            </RouterLink>
          </li>
        </ul>
      </navigation>

      <!-- <div class="mt-10 grid">
        <FilledButton tag="RouterLink" to="/login">
          <span>Login</span>
        </FilledButton>
      </div> -->
    </div>
  </header>
</template>