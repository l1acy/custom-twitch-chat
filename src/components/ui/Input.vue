<script setup>
const props = defineProps({
  id: String,
  label: String,
  placeholder: String,
  modelValue: [String, Number],
  required: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:modelValue']);

</script>

<template>
    <div>
        <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      @input="emit('update:modelValue', $event.target.value)"
    >
    </div>
</template>

<style scoped>
div {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
label {
    color: #fafafa;
}
input {
    padding: 8px 12px;
    background-color: #09090b;
    border: 1px solid #27272a;
    border-radius: 10px;
    max-width: 300px;
    color: #fafafa;
}
input::placeholder {
    color: #a1a19b;
}
</style>