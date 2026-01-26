<script setup lang="ts">
import type {NavigationMenuItem, TabsItem} from '@nuxt/ui'

const items: TabsItem[] = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Unread',
    value: 'unread'
  }
]

const menu: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-house',
  active: true
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  badge: '4'
}, {
  label: 'Contacts',
  icon: 'i-lucide-users'
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  children: [{
    label: 'General'
  }, {
    label: 'Members'
  }, {
    label: 'Notifications'
  }]
}]
</script>


<template>
  <UApp>
    <UDashboardGroup>
      <UDashboardSidebar collapsible>
        <template #header>
          <UDashboardSidebarCollapse/>
        </template>

        <template #default="{ collapsed }">
          <UNavigationMenu
              :collapsed="collapsed"
              :items="menu"
              orientation="vertical"
          />
        </template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar title="Inbox">
            <template #leading>

            </template>

            <template #trailing>
              <UBadge label="4" variant="subtle"/>
            </template>

            <template #right>
              <UTabs :items="items" default-value="all" size="sm" class="w-40" :content="false"/>
            </template>


          </UDashboardNavbar>
          navbar
        </template>
      </UDashboardPanel>

      <slot/>
    </UDashboardGroup>

  </UApp>
</template>