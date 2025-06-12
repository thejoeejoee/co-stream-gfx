<template>
  <country-flag
      v-if="props.country"
      :country="(convertIocCode(props.country.toUpperCase()) || {iso3: ''}).iso3.toLowerCase()"
      :size="props.size"
  />
</template>

<script setup lang="ts">
import CountryFlag from "vue-country-flag-next";

import {convertIocCode} from "convert-country-codes"

const props = defineProps({
  country: {
    type: [String, null],
    required: true
  },
  size: {
    type: String,
    default: "big"
  }
})
</script>