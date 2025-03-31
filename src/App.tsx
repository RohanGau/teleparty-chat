import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./store/index"; 
import AppRoutes from './routes/AppRoutes';
import './App.css';


const App: React.FC = () => {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          <header className="App-header">
            <h1>Teleparty Chat</h1>
          </header>
          <main>
            <AppRoutes />
          </main>
        </div>
      </PersistGate>
    </Provider>
  );
};

export default App;
