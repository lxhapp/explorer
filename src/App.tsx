import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FileExplorer from './components/FileExplorer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/files/*" element={<FileExplorer />} />
        <Route path="*" element={<Navigate to="/files" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;