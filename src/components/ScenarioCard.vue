<script setup lang="ts">
import { computed } from 'vue'
import type { Scenario, PlanType, HourlyScenario, PartialUpfrontScenario } from '../types'
import {
  PLAN_LABELS,
  SCENARIO_COLORS,
  VALIDATION,
  DEFAULT_HOURLY_RATE,
  DEFAULT_HOURS_PER_MONTH,
  DEFAULT_PARTIAL_UPFRONT_FEE,
  DEFAULT_PARTIAL_MONTHLY_FEE,
} from '../constants'
import ExchangeRateInput from './ExchangeRateInput.vue'

const props = defineProps<{
  scenario: Scenario
  canDelete: boolean
}>()

const emit = defineEmits<{
  'update:scenario': [scenario: Scenario]
  delete: []
}>()

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
  if (isHourly.value) {
    emit('update:scenario', { ...props.scenario, [field]: value } as Scenario)
  } else {
    emit('update:scenario', { ...props.scenario, [field]: value } as Scenario)
  }
}

function onPlanTypeChange(e: Event) {
  const newType = (e.target as HTMLSelectElement).value as PlanType
  const base = {
    id: props.scenario.id,
    name: props.scenario.name,
    color: props.scenario.color,
    exchangeRates: props.scenario.exchangeRates,
  }

  if (newType === 'riPartialUpfront') {
    emit('update:scenario', {
      ...base,
      planType: 'riPartialUpfront',
      upfrontFee: DEFAULT_PARTIAL_UPFRONT_FEE,
      monthlyFee: DEFAULT_PARTIAL_MONTHLY_FEE,
    })
  } else {
    const hourlyRate =
      props.scenario.planType !== 'riPartialUpfront'
        ? props.scenario.hourlyRate
        : DEFAULT_HOURLY_RATE
    const hoursPerMonth =
      props.scenario.planType !== 'riPartialUpfront'
        ? props.scenario.hoursPerMonth
        : DEFAULT_HOURS_PER_MONTH
    emit('update:scenario', { ...base, planType: newType, hourlyRate, hoursPerMonth })
  }
}

function onRatesUpdate(rates: number[]) {
  emit('update:scenario', { ...props.scenario, exchangeRates: rates })
}
</script>

<template>
  <div
    class="rounded-xl border-2 bg-white p-4 shadow-sm flex flex-col gap-3"
    :style="{ borderColor: scenario.color }"
  >
    <!-- ヘッダー行：名前・色・削除 -->
    <div class="flex items-center gap-2">
      <!-- カラーピッカー -->
      <div class="flex gap-1">
        <button
          v-for="c in SCENARIO_COLORS"
          :key="c"
          type="button"
          class="h-4 w-4 rounded-full border-2 transition-transform hover:scale-110"
          :style="{ backgroundColor: c, borderColor: scenario.color === c ? '#374151' : 'transparent' }"
          @click="updateField('color', c)"
        />
      </div>
      <!-- シナリオ名 -->
      <input
        type="text"
        :value="scenario.name"
        maxlength="20"
        class="flex-1 rounded border border-gray-300 px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400"
        @input="updateField('name', ($event.target as HTMLInputElement).value)"
      />
      <!-- 削除ボタン -->
      <button
        type="button"
        :disabled="!canDelete"
        class="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
        @click="$emit('delete')"
      >
        削除
      </button>
    </div>

    <!-- プランタイプ -->
    <div>
      <label class="mb-1 block text-xs text-gray-500">プランタイプ</label>
      <select
        :value="scenario.planType"
        class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        @change="onPlanTypeChange"
      >
        <option v-for="(label, key) in PLAN_LABELS" :key="key" :value="key">
          {{ label }}
        </option>
      </select>
    </div>

    <!-- オンデマンド・RI前払いなし・RI全額前払い用フィールド -->
    <template v-if="hourlyScenario">
      <div class="grid grid-cols-2 gap-3">
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
      </div>
    </template>

    <!-- RI一部前払い用フィールド -->
    <template v-else-if="partialScenario">
      <div class="grid grid-cols-2 gap-3">
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
      </div>
    </template>

    <!-- 為替レート -->
    <ExchangeRateInput :rates="scenario.exchangeRates" @update:rates="onRatesUpdate" />
  </div>
</template>
