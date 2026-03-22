<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Scenario, HourlyScenario, PartialUpfrontScenario } from '../types'
import { PLAN_LABELS, VALIDATION } from '../constants'

const props = defineProps<{
  scenario: Scenario
}>()

const emit = defineEmits<{
  'update:scenario': [scenario: Scenario]
}>()

const open = ref(false)

const isHourly = computed(() =>
  props.scenario.planType !== 'riPartialUpfront'
)

const hourlyScenario = computed<HourlyScenario | null>(() =>
  isHourly.value ? (props.scenario as HourlyScenario) : null
)

const partialScenario = computed<PartialUpfrontScenario | null>(() =>
  !isHourly.value ? (props.scenario as PartialUpfrontScenario) : null
)

function updateField(field: string, value: string | number) {
  emit('update:scenario', { ...props.scenario, [field]: value } as Scenario)
}


</script>

<template>
  <div
    class="min-w-0 rounded-xl border-2 bg-white shadow-sm"
    :style="{ borderColor: scenario.color }"
  >
    <!-- アコーディオンヘッダー -->
    <button
      type="button"
      class="flex w-full items-center justify-between px-4 py-3 text-left"
      @click="open = !open"
    >
      <div class="flex items-center gap-2 min-w-0">
        <span
          class="h-3 w-3 shrink-0 rounded-full"
          :style="{ backgroundColor: scenario.color }"
        />
        <span class="truncate text-sm font-semibold text-gray-800">
          {{ PLAN_LABELS[scenario.planType] }}
        </span>
      </div>
      <span class="ml-2 shrink-0 text-xs text-gray-400">{{ open ? '▼' : '▶' }}</span>
    </button>

    <!-- アコーディオン本体：設定値フィールド -->
    <div v-if="open" class="border-t border-gray-100 px-4 pb-4 pt-3 flex flex-col gap-3">
      <!-- オンデマンド・RI前払いなし・RI全額前払い用フィールド -->
      <template v-if="hourlyScenario">
        <div>
          <label class="mb-1 block text-xs text-gray-500">時間単価（USD/hour）</label>
          <input
            type="number"
            :value="hourlyScenario.hourlyRate"
            :min="VALIDATION.hourlyRate.min"
            :max="VALIDATION.hourlyRate.max"
            step="0.001"
            class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-400"
            @change="updateField('hourlyRate', parseFloat(($event.target as HTMLInputElement).value))"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs text-gray-500">月間稼働時間（h）</label>
          <input
            type="number"
            :value="hourlyScenario.hoursPerMonth"
            :min="VALIDATION.hoursPerMonth.min"
            :max="VALIDATION.hoursPerMonth.max"
            step="1"
            class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-400"
            @change="updateField('hoursPerMonth', parseFloat(($event.target as HTMLInputElement).value))"
          />
        </div>
      </template>

      <!-- RI一部前払い用フィールド -->
      <template v-else-if="partialScenario">
        <div>
          <label class="mb-1 block text-xs text-gray-500">RI の前払い料金（USD）</label>
          <input
            type="number"
            :value="partialScenario.upfrontFee"
            :min="VALIDATION.upfrontFee.min"
            step="0.01"
            class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-400"
            @change="updateField('upfrontFee', parseFloat(($event.target as HTMLInputElement).value))"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs text-gray-500">RI の月額料金（USD）</label>
          <input
            type="number"
            :value="partialScenario.monthlyFee"
            :min="VALIDATION.monthlyFee.min"
            step="0.01"
            class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-400"
            @change="updateField('monthlyFee', parseFloat(($event.target as HTMLInputElement).value))"
          />
        </div>
      </template>
    </div>
  </div>
</template>
