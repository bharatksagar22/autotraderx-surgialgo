import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  liveSignals: [],
  latestSignals: [], // For fetched latest signals
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const signalsSlice = createSlice({
  name: 'signals',
  initialState,
  reducers: {
    addLiveSignal: (state, action) => {
      state.liveSignals.unshift(action.payload); // Add to the beginning of the array
      if (state.liveSignals.length > 50) { // Keep a manageable number of live signals
        state.liveSignals.pop();
      }
    },
    setLatestSignals: (state, action) => {
      state.latestSignals = action.payload;
    },
    setSignalsLoading: (state) => {
      state.status = 'loading';
    },
    setSignalsSuccess: (state) => {
      state.status = 'succeeded';
    },
    setSignalsError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    clearSignalsError: (state) => {
      state.error = null;
      if (state.status === 'failed') {
        state.status = 'idle';
      }
    }
  },
});

export const { 
  addLiveSignal, 
  setLatestSignals,
  setSignalsLoading,
  setSignalsSuccess,
  setSignalsError,
  clearSignalsError
} = signalsSlice.actions;

export default signalsSlice.reducer;

// Selector to get live signals
export const selectLiveSignals = (state) => state.signals.liveSignals;
export const selectLatestSignals = (state) => state.signals.latestSignals;
export const selectSignalsStatus = (state) => state.signals.status;
export const selectSignalsError = (state) => state.signals.error;