import { createStore } from 'vuex';

const store = createStore({
  state: {
    selectedStatus: {
      piece: {},
      position: {},
    },
    validMoves: [],
    round: 1,
  },
  mutations: {
    // setSelectedStatus(state, payload) {
    //   Object.assign(state, payload);
    // }
    setSelectedStatus(state, piece) {
      // eslint-disable-next-line no-param-reassign
      state.selectedStatus = piece;
    },
    setValidMoves(state, moves) {
      // eslint-disable-next-line no-param-reassign
      state.validMoves = moves;
    },
    addRound(state) {
      // eslint-disable-next-line no-param-reassign
      state.round += 1;
    },
  },
  actions: {

  },
  modules: {
  },
});

export default store;
