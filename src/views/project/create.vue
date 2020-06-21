<template>
  <detail :is-edit="false" />
</template>

<script>
import Detail from './components/detail'

export default {
  name: 'CreateForm',
  components: { Detail }
}
</script>

