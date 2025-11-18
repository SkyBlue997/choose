import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WheelList } from './pages/wheel/WheelList';
import { WheelEdit } from './pages/wheel/WheelEdit';
import { WheelPlay } from './pages/wheel/WheelPlay';
import { FingerRoulette } from './pages/FingerRoulette';
import { RandomNumber } from './pages/RandomNumber';
import { CoinFlip } from './pages/CoinFlip';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 默认路由 */}
        <Route path="/" element={<Navigate to="/wheel" replace />} />

        {/* 转盘路由 */}
        <Route path="/wheel" element={<WheelList />} />
        <Route path="/wheel/edit/:id" element={<WheelEdit />} />
        <Route path="/wheel/play/:id" element={<WheelPlay />} />

        {/* 其他功能路由 */}
        <Route path="/finger" element={<FingerRoulette />} />
        <Route path="/number" element={<RandomNumber />} />
        <Route path="/coin" element={<CoinFlip />} />

        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to="/wheel" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
