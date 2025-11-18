import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { useWheelsStore } from '../../hooks/useWheelsStore';
import { formatTimestamp } from '../../utils/storage';

export const WheelList: React.FC = () => {
  const navigate = useNavigate();
  const { wheels, createWheel, deleteWheel } = useWheelsStore();

  const handleCreateWheel = () => {
    console.log('🎯 创建转盘按钮被点击');
    try {
      const newWheel = createWheel('新转盘');
      console.log('✅ 转盘创建成功:', newWheel);
      console.log('🔄 准备导航到:', `/wheel/edit/${newWheel.id}`);

      // 使用 setTimeout 确保状态更新完成后再导航
      setTimeout(() => {
        navigate(`/wheel/edit/${newWheel.id}`);
      }, 0);
    } catch (error) {
      console.error('❌ 创建转盘出错:', error);
    }
  };

  const handlePlayWheel = (wheelId: string) => {
    navigate(`/wheel/play/${wheelId}`);
  };

  const handleEditWheel = (e: React.MouseEvent, wheelId: string) => {
    e.stopPropagation();
    navigate(`/wheel/edit/${wheelId}`);
  };

  const handleDeleteWheel = (e: React.MouseEvent, wheelId: string) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个转盘吗？')) {
      deleteWheel(wheelId);
    }
  };

  return (
    <Layout title="我的转盘">
      <div className="space-y-4">
        {/* 空状态 */}
        {wheels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有转盘</h3>
            <p className="text-gray-500 mb-8">创建第一个转盘，开始做决定吧！</p>
            <button
              onClick={handleCreateWheel}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              创建转盘
            </button>
          </div>
        ) : (
          <>
            {/* 转盘列表 */}
            {wheels.map((wheel) => (
              <div
                key={wheel.id}
                onClick={() => handlePlayWheel(wheel.id)}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* 图标 */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-3xl flex-shrink-0">
                      {wheel.emoji}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {wheel.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {wheel.options.length} 个选项
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {wheel.options.slice(0, 3).map((option) => (
                          <span
                            key={option.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: option.color }}
                            />
                            {option.label}
                          </span>
                        ))}
                        {wheel.options.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-500">
                            +{wheel.options.length - 3}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatTimestamp(wheel.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => handleEditWheel(e, wheel.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="编辑"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteWheel(e, wheel.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="删除"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 创建按钮 */}
            <button
              onClick={handleCreateWheel}
              className="w-full py-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-gray-700 font-medium border-2 border-dashed border-gray-200 hover:border-purple-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建新转盘
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};
