import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { WheelSpinner } from '../../components/WheelSpinner';
import { useWheelsStore } from '../../hooks/useWheelsStore';
import { formatTimestamp } from '../../utils/storage';

export const WheelPlay: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { wheels, addHistory, getWheelHistory } = useWheelsStore();

  const wheel = wheels.find((w) => w.id === id);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!wheel) {
      navigate('/wheel');
    }
  }, [wheel, navigate]);

  if (!wheel) return null;

  const history = getWheelHistory(wheel.id, 10);

  const handleSpinComplete = (result: string) => {
    setCurrentResult(result);
    addHistory(wheel.id, result);
  };

  const handleEdit = () => {
    navigate(`/wheel/edit/${wheel.id}`);
  };

  const handleBack = () => {
    navigate('/wheel');
  };

  return (
    <Layout
      title={wheel.title}
      leftButton={
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="返回"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      }
      rightButton={
        <button
          onClick={handleEdit}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="编辑"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      }
      showBottomNav={false}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 转盘 */}
        <div className="flex justify-center">
          <WheelSpinner wheel={wheel} onSpinComplete={handleSpinComplete} />
        </div>

        {/* 当前结果 */}
        {currentResult && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center animate-bounce-in">
            <div className="text-sm text-gray-500 mb-2">结果是</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
              {currentResult}
            </div>
            <button
              onClick={() => setCurrentResult(null)}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all text-sm font-medium"
            >
              再次抽取
            </button>
          </div>
        )}

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">最近记录</h3>
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
                    <span className="font-medium text-gray-900">{item.result}</span>
                    <span className="text-sm text-gray-500">{formatTimestamp(item.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 选项预览 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">所有选项</h3>
          <div className="flex flex-wrap gap-2">
            {wheel.options.map((option) => (
              <span
                key={option.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                <span className="text-sm font-medium text-gray-700">{option.label}</span>
                {!wheel.settings.hideWeights && (
                  <span className="text-xs text-gray-500">×{option.weight}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
