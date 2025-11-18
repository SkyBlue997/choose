import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useCoinFlipStore } from '../hooks/useCoinFlipStore';
import { formatTimestamp } from '../utils/storage';

export const CoinFlip: React.FC = () => {
  const {
    stats,
    history,
    selectedStyle,
    currentResult,
    isFlipping,
    availableStyles,
    flipCoin,
    resetStats,
    changeStyle,
  } = useCoinFlipStore();

  const [showHistory, setShowHistory] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);

  const handleFlip = async () => {
    if (!isFlipping) {
      await flipCoin();
    }
  };

  const totalFlips = stats.headsCount + stats.tailsCount;
  const headsPercentage = totalFlips > 0 ? ((stats.headsCount / totalFlips) * 100).toFixed(1) : '0.0';
  const tailsPercentage = totalFlips > 0 ? ((stats.tailsCount / totalFlips) * 100).toFixed(1) : '0.0';

  return (
    <Layout title="抛硬币">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 统计区域 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">统计</h3>
            {totalFlips > 0 && (
              <button
                onClick={resetStats}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                重置
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-4xl mb-2">{selectedStyle.headsEmoji}</div>
              <div className="text-2xl font-bold text-blue-600">{stats.headsCount}</div>
              <div className="text-sm text-blue-500">{headsPercentage}%</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-4xl mb-2">{selectedStyle.tailsEmoji}</div>
              <div className="text-2xl font-bold text-purple-600">{stats.tailsCount}</div>
              <div className="text-sm text-purple-500">{tailsPercentage}%</div>
            </div>
          </div>
        </div>

        {/* 硬币展示区 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* 硬币 */}
          <div className="flex justify-center mb-8">
            <div
              className={`
                w-64 h-64 rounded-full flex items-center justify-center
                bg-gradient-to-br from-yellow-100 to-yellow-200
                shadow-2xl border-8 border-yellow-300
                transition-all duration-1000
                ${isFlipping ? 'animate-spin-flip' : ''}
              `}
            >
              <div className="text-9xl">
                {currentResult === null
                  ? '❓'
                  : currentResult === 'heads'
                  ? selectedStyle.headsEmoji
                  : selectedStyle.tailsEmoji}
              </div>
            </div>
          </div>

          {/* 结果文字 */}
          {currentResult !== null && !isFlipping && (
            <div className="text-center mb-6 animate-bounce-in">
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {currentResult === 'heads' ? '正面' : '反面'}
              </p>
            </div>
          )}

          {/* 抛硬币按钮 */}
          <button
            onClick={handleFlip}
            disabled={isFlipping}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFlipping ? '抛掷中...' : '抛硬币'}
          </button>
        </div>

        {/* 硬币样式选择 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">硬币样式</h3>
            <button
              onClick={() => setShowStylePicker(!showStylePicker)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              {showStylePicker ? '收起' : '展开'}
            </button>
          </div>

          {showStylePicker && (
            <div className="grid grid-cols-2 gap-3">
              {availableStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => changeStyle(style)}
                  className={`
                    p-4 rounded-xl border-2 transition-all
                    ${selectedStyle.id === style.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <div className="flex justify-center gap-3 mb-2">
                    <span className="text-3xl">{style.headsEmoji}</span>
                    <span className="text-3xl">{style.tailsEmoji}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 text-center">
                    {style.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                最近记录 ({history.length})
              </h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {showHistory ? '收起' : '展开'}
              </button>
            </div>

            {showHistory && (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {item.result === 'heads'
                          ? selectedStyle.headsEmoji
                          : selectedStyle.tailsEmoji}
                      </span>
                      <span className="font-medium text-gray-900">
                        {item.result === 'heads' ? '正面' : '反面'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
