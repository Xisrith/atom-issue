import { Provider } from 'jotai';
import { Component } from './atom/Component';
import { store } from './atom/store';

function App() {
  return (
    <Provider store={store}>
      <Component />
    </Provider>
  )
}

export default App
