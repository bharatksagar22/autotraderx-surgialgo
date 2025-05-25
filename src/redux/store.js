import { configureStore } from '@reduxjs/toolkit';
import signalsReducer from '@/redux/slices/signalsSlice';

const store = configureStore({
  reducer: {
    signals: signalsReducer,
    // Add other reducers here as needed
  },
});

export default store;