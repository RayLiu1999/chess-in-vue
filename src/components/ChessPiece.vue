<template>
  <div class="chess-pieces">
    <component :is="type" :color="color"></component>
  </div>
</template>

<script>
import P from "./pieces/Pawn.vue";
import R from "./pieces/Rook.vue";
import N from "./pieces/Knight.vue";
import B from "./pieces/Bishop.vue";
import Q from "./pieces/Queen.vue";
import K from './pieces/King.vue';

export default {
  components: {
    P,
    R,
    N,
    B,
    Q,
    K
  },
  props: {
    type: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
};
</script>

<style scoped>
.chess-pieces {
  font-size: 24px;
  text-align: center;
}

.black {
  fill: #000000;
}

.white {
  fill: #FFFFFF;
}
</style>