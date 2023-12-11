import { createStore, mapMutations, mapState } from "vuex";

const store = createStore({
  state: {
    selectedStatus: {
      piece: {},
      position: {},
    },
    validMoves: [],
    round: 0,
  },
  mutations: {
    // setSelectedStatus(state, payload) {
    //   Object.assign(state, payload);
    // }
    setSelectedStatus(state, piece) {
      state.selectedStatus = piece;
    }, 
    setValidMoves(state, moves) {
      state.validMoves = moves;
    },
    addRound(state) {
      state.round++;
    }
  },
  actions: {

  },
  modules: {
  }
});

export default store;