import React, { useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import { useFingerRouletteStore } from '../hooks/useFingerRouletteStore';

export const FingerRoulette: React.FC = () => {
  const {
    config,
    players,
    winners,
    isSelecting,
    updateConfig,
    addPlayer,
    clearPlayers,
    selectWinners,
    reset,
  } = useFingerRouletteStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelecting || winners.length > 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    addPlayer({ x, y });
  };

  const handleStart = async () => {
    if (players.length === 0) return;
    await selectWinners();
  };

  const handleReset = () => {
    reset();
  };

  const isWinner = (playerId: string) => {
    return winners.some((w) => w.id === playerId);
  };

  return (
    <Layout title="手指轮盘">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 设置区域 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">设置</h3>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              {showSettings ? '收起' : '展开'}
            </button>
          </div>

          {showSettings && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  获胜人数
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateConfig({ winnerCount: Math.max(1, config.winnerCount - 1) })}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {config.winnerCount}
                  </span>
                  <button
                    onClick={() => updateConfig({ winnerCount: Math.min(10, config.winnerCount + 1) })}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 主游戏区域 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* 提示信息 */}
          {players.length === 0 && winners.length === 0 && (
            <div className="text-center mb-6">
              <p className="text-gray-600">点击下方圆形区域加入游戏</p>
              <p className="text-sm text-gray-400 mt-1">当前参与人数：0</p>
            </div>
          )}

          {players.length > 0 && winners.length === 0 && (
            <div className="text-center mb-6">
              <p className="text-gray-600">当前参与人数：{players.length}</p>
              <p className="text-sm text-gray-400 mt-1">继续点击添加玩家，或点击开始按钮</p>
            </div>
          )}

          {winners.length > 0 && (
            <div className="text-center mb-6">
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                获胜者
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {winners.map((winner) => (
                  <span
                    key={winner.id}
                    className="px-4 py-2 rounded-full text-white font-medium"
                    style={{ backgroundColor: winner.color }}
                  >
                    {winner.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 游戏区域 */}
          <div
            ref={containerRef}
            onClick={handleContainerClick}
            className={`
              relative w-full aspect-square max-w-md mx-auto rounded-full
              bg-gradient-to-br from-purple-50 to-pink-50
              border-4 border-purple-200
              overflow-hidden
              ${isSelecting || winners.length > 0 ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* 玩家点 */}
            {players.map((player) => {
              const isPlayerWinner = isWinner(player.id);
              const shouldFade = winners.length > 0 && !isPlayerWinner;

              return (
                <div
                  key={player.id}
                  className={`
                    absolute -translate-x-1/2 -translate-y-1/2
                    transition-all duration-500
                    ${shouldFade ? 'opacity-0 scale-0' : 'opacity-100'}
                    ${isPlayerWinner ? 'scale-150 z-10' : 'scale-100'}
                  `}
                  style={{
                    left: `${player.position.x}%`,
                    top: `${player.position.y}%`,
                  }}
                >
                  <div
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      text-white font-bold shadow-lg
                      ${isPlayerWinner ? 'animate-pulse' : ''}
                    `}
                    style={{ backgroundColor: player.color }}
                  >
                    {player.name}
                  </div>
                </div>
              );
            })}

            {/* 中央提示 */}
            {players.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-purple-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <p className="text-purple-400 font-medium">点击加入</p>
                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 mt-6">
            {winners.length > 0 ? (
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                重新开始
              </button>
            ) : (
              <>
                <button
                  onClick={clearPlayers}
                  disabled={players.length === 0}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  清空
                </button>
                <button
                  onClick={handleStart}
                  disabled={players.length === 0 || isSelecting}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSelecting ? '抽选中...' : '开始'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 说明 */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">使用说明</p>
              <ul className="space-y-1 text-blue-600">
                <li>• 点击圆形区域添加玩家</li>
                <li>• 设置获胜人数</li>
                <li>• 点击「开始」随机选出获胜者</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
