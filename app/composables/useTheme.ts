import { computed, onMounted } from 'vue'
import { params } from '~/state'

export function useTheme() {
  const theme = computed(() => params.get('theme') === 'iof' ? 'iof' : 'co')
  const isIOF = computed(() => theme.value === 'iof')

  onMounted(() => {
    if (isIOF.value) {
      document.documentElement.classList.add('theme-iof')
    }
  })

  return { theme, isIOF }
}
