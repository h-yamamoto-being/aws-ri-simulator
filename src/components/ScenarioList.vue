<script setup lang="ts">
import type { Scenario } from '../types'
import ScenarioCard from './ScenarioCard.vue'

defineProps<{
  scenarios: Scenario[]
}>()

const emit = defineEmits<{
  'update:scenario': [scenario: Scenario]
}>()
</script>

<template>
  <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <ScenarioCard
      v-for="scenario in scenarios"
      :key="scenario.id"
      :scenario="scenario"
      @update:scenario="$emit('update:scenario', $event)"
    />
  </section>
</template>
