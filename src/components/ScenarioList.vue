<script setup lang="ts">
import type { Scenario } from '../types'
import { VALIDATION } from '../constants'
import ScenarioCard from './ScenarioCard.vue'

const props = defineProps<{
  scenarios: Scenario[]
}>()

const emit = defineEmits<{
  add: []
  remove: [id: string]
  'update:scenario': [scenario: Scenario]
}>()
</script>

<template>
  <section>
    <!-- シナリオカード一覧 -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ScenarioCard
        v-for="scenario in scenarios"
        :key="scenario.id"
        :scenario="scenario"
        :can-delete="scenarios.length > VALIDATION.scenarioCount.min"
        @update:scenario="$emit('update:scenario', $event)"
        @delete="$emit('remove', scenario.id)"
      />
    </div>

    <!-- シナリオ追加ボタン -->
    <div class="mt-4 flex justify-center">
      <button
        type="button"
        :disabled="scenarios.length >= VALIDATION.scenarioCount.max"
        class="rounded-lg border-2 border-dashed border-gray-300 px-6 py-2 text-sm text-gray-500 transition hover:border-blue-400 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        @click="$emit('add')"
      >
        ＋ シナリオを追加
        <span class="ml-1 text-xs text-gray-400">({{ scenarios.length }}/{{ VALIDATION.scenarioCount.max }})</span>
      </button>
    </div>
  </section>
</template>
