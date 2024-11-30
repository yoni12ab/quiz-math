import React from 'react';
import './App.css';
import MathQuizGame from './components/Quize';
import { ChakraProvider } from '@chakra-ui/react';
import { defaultSystem } from '@chakra-ui/react';

function App() {
  return (
    <React.StrictMode>
      <ChakraProvider value={defaultSystem}>
        <MathQuizGame />
      </ChakraProvider>
    </React.StrictMode>
  );
}

export default App;
