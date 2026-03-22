<script setup lang="ts">
import { ref, computed } from 'vue'
import { VALIDATION } from '../constants'

const props = defineProps<{
  rates: number[]
}>()

const emit = defineEmits<{
  'update:rates': [rates: number[]]
}>()

const expanded = ref(false)

// 全月が同一レートなら一括設定欄に表示、異なれば空文字
const bulkValue = computed(() => {
  const first = props.rates[0]
  return props.rates.every(r => r === first) ? String(first) : ''
})

const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

function onBulkInput(e: Event) {
  const v = parseFloat((e.target as HTMLInputElement).value)
  if (!isValid(v)) return
  emit('update:rates', Array(12).fill(v) as number[])
}

function onMonthInput(index: number, e: Event) {
  const v = parseFloat((e.target as HTMLInputElement).value)
  if (!isValid(v)) return
  const updated = [...props.rates]
  updated[index] = v
  emit('update:rates', updated)
}

function isValid(v: number): boolean {
  return !isNaN(v) && v >= VALIDATION.exchangeRate.min && v <= VALIDATION.exchangeRate.max
}
</script>

<template>
  <div class="mt-3 border-t border-gray-200 pt-3">
    <!-- 一括設定 -->
    <div class="flex items-center gap-2">
      <label class="text-xs text-gray-500 whitespace-nowrap">為替レート（円/ドル）</label>
      <input
        type="number"
        :value="bulkValue"
        :min="VALIDATION.exchangeRate.min"
        :max="VALIDATION.exchangeRate.max"
        step="1"
        placeholder="150"
        class="w-20 rounded border border-gray-300 px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-400"
        @change="onBulkInput"
      />
      <span class="text-xs text-gray-400">円（全月共通）</span>
      <button
        type="button"
        class="ml-auto text-xs text-blue-500 hover:text-blue-700"
        @click="expanded = !expanded"
      >
        {{ expanded ? '▲ 月別を閉じる' : '▼ 月別で設定' }}
      </button>
    </div>

    <!-- 月別設定 -->
    <div v-if="expanded" class="mt-2 grid grid-cols-3 gap-1">
      <div
        v-for="(rate, i) in rates"
        :key="i"
        class="flex items-center gap-1"
      >
        <span class="w-7 text-right text-xs text-gray-400">{{ MONTH_LABELS[i] }}</span>
        <input
          type="number"
          :value="rate"
          :min="VALIDATION.exchangeRate.min"
          :max="VALIDATION.exchangeRate.max"
          step="1"
          class="w-16 rounded border border-gray-300 px-1 py-0.5 text-xs text-right focus:outline-none focus:ring-1 focus:ring-blue-400"
          @change="(e) => onMonthInput(i, e)"
        />
      </div>
    </div>
  </div>
</template>
