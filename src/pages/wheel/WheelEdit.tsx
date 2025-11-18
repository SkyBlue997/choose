import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { useWheelsStore } from '../../hooks/useWheelsStore';
import { DEFAULT_WHEEL_THEMES } from '../../types';

export const WheelEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { wheels, updateWheel, addOption, updateOption, deleteOption, batchAddOptions, updateSettings } = useWheelsStore();

  const wheel = wheels.find((w) => w.id === id);
  const [showBatchAdd, setShowBatchAdd] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 给一个短暂的延迟，等待状态同步
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!wheel) {
        console.log('⚠️ 转盘未找到，返回列表页');
        navigate('/wheel');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [wheel, navigate]);

  // 加载中或转盘不存在时显示加载状态
  if (isLoading || !wheel) {
    return (
      <Layout title="加载中..." showBottomNav={false}>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">加载中...</div>
        </div>
      </Layout>
    );
  }

  const handleSave = () => {
    navigate(`/wheel/play/${wheel.id}`);
  };

  const handleBack = () => {
    navigate('/wheel');
  };

  const handleBatchAdd = () => {
    if (!batchText.trim()) return;

    const labels = batchText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (labels.length > 0) {
      batchAddOptions(wheel.id, labels);
      setBatchText('');
      setShowBatchAdd(false);
    }
  };

  return (
    <Layout
      title="编辑转盘"
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
          onClick={handleSave}
          className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-medium rounded-full hover:shadow-md transition-all"
        >
          保存
        </button>
      }
      showBottomNav={false}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 标题输入 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            问题标题
          </label>
          <input
            type="text"
            value={wheel.title}
            onChange={(e) => updateWheel(wheel.id, { title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg"
            placeholder="例如：今晚吃什么？"
          />
        </div>

        {/* 选项列表 */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">选项</h3>
            <button
              onClick={() => setShowBatchAdd(!showBatchAdd)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              批量添加
            </button>
          </div>

          {/* 批量添加面板 */}
          {showBatchAdd && (
            <div className="mb-4 p-4 bg-purple-50 rounded-xl">
              <textarea
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                rows={5}
                placeholder="每行一个选项，例如：&#10;火锅&#10;烧烤&#10;日料"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleBatchAdd}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                >
                  确定
                </button>
                <button
                  onClick={() => {
                    setShowBatchAdd(false);
                    setBatchText('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 选项列表 */}
          <div className="space-y-3">
            {wheel.options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3 group">
                {/* 颜色点 */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={option.color}
                    onChange={(e) => updateOption(wheel.id, option.id, { color: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    title="选择颜色"
                  />
                </div>

                {/* 标签输入 */}
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(wheel.id, option.id, { label: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder={`选项 ${index + 1}`}
                />

                {/* 权重 */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={option.weight}
                    onChange={(e) => {
                      const weight = parseInt(e.target.value) || 1;
                      updateOption(wheel.id, option.id, { weight: Math.max(1, Math.min(100, weight)) });
                    }}
                    className="w-16 px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">权重</span>
                </div>

                {/* 删除按钮 */}
                {wheel.options.length > 2 && (
                  <button
                    onClick={() => deleteOption(wheel.id, option.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="删除"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 添加选项按钮 */}
          <button
            onClick={() => addOption(wheel.id)}
            className="w-full mt-3 py-3 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-gray-600 hover:text-purple-600 font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加选项
          </button>
        </div>

        {/* 高级设置 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-semibold text-gray-900">高级设置</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="px-6 pb-6 space-y-4">
              {/* 允许重复结果 */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">允许重复结果</div>
                  <div className="text-sm text-gray-500">多次抽签时，允许抽到相同的选项</div>
                </div>
                <input
                  type="checkbox"
                  checked={wheel.settings.allowDuplicateResults}
                  onChange={(e) => updateSettings(wheel.id, { allowDuplicateResults: e.target.checked })}
                  className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-400"
                />
              </label>

              {/* 隐藏权重 */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">隐藏权重</div>
                  <div className="text-sm text-gray-500">扇区面积相同，但实际概率按权重计算</div>
                </div>
                <input
                  type="checkbox"
                  checked={wheel.settings.hideWeights}
                  onChange={(e) => updateSettings(wheel.id, { hideWeights: e.target.checked })}
                  className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-400"
                />
              </label>

              {/* 重复选项填满转盘 */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">重复选项填满转盘</div>
                  <div className="text-sm text-gray-500">选项较少时，重复展示填满整个转盘</div>
                </div>
                <input
                  type="checkbox"
                  checked={wheel.settings.repeatOptionsToFill}
                  onChange={(e) => updateSettings(wheel.id, { repeatOptionsToFill: e.target.checked })}
                  className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-400"
                />
              </label>

              {/* 主题选择 */}
              <div>
                <div className="font-medium text-gray-900 mb-3">主题配色</div>
                <div className="grid grid-cols-2 gap-3">
                  {DEFAULT_WHEEL_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        updateWheel(wheel.id, {
                          theme,
                          options: wheel.options.map((opt, idx) => ({
                            ...opt,
                            color: theme.colors[idx % theme.colors.length],
                          })),
                        });
                      }}
                      className={`
                        p-3 rounded-xl border-2 transition-all
                        ${wheel.theme.id === theme.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex gap-1 mb-2">
                        {theme.colors.slice(0, 6).map((color, idx) => (
                          <div
                            key={idx}
                            className="flex-1 h-6 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{theme.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
