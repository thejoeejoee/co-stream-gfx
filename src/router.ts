import { createRouter, createWebHistory } from 'vue-router'
import GfxMain from '@/components/gfx/Main.vue'
import Debug from '@/components/Debug.vue'
import Director from '@/components/director/Director.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: GfxMain,
    },
    {
      path: '/debug',
      component: Debug,
    },
    {
      path: '/director',
      component: Director,
    },
  ],
})
