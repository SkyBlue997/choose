import React, { useState, useRef, useEffect } from 'react';
import type { Wheel, WheelOption } from '../types';

interface WheelSpinnerProps {
  wheel: Wheel;
  onSpinComplete: (result: string) => void;
}

interface Segment {
  option: WheelOption;
  startAngle: number;
  endAngle: number;
  displayStartAngle: number;
  displayEndAngle: number;
}

export const WheelSpinner: React.FC<WheelSpinnerProps> = ({ wheel, onSpinComplete }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [canvasSize, setCanvasSize] = useState(400);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { options, settings } = wheel;

  // 响应式调整画布大小
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // 移动端使用较小尺寸，桌面端使用较大尺寸
        const size = Math.min(width - 40, window.innerWidth < 768 ? 320 : 400);
        setCanvasSize(size);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 计算扇区
  const calculateSegments = (): Segment[] => {
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
    let currentAngle = 0;
    let currentDisplayAngle = 0;
    const displayAnglePerOption = 360 / options.length;

    return options.map((option) => {
      // 实际权重角度（用于抽奖计算）
      const angleSize = (option.weight / totalWeight) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSize;
      currentAngle = endAngle;

      // 显示角度（如果隐藏权重，则平均分配）
      const displayStartAngle = settings.hideWeights ? currentDisplayAngle : startAngle;
      const displayEndAngle = settings.hideWeights
        ? currentDisplayAngle + displayAnglePerOption
        : endAngle;
      currentDisplayAngle = displayEndAngle;

      return {
        option,
        startAngle,
        endAngle,
        displayStartAngle,
        displayEndAngle,
      };
    });
  };

  const segments = calculateSegments();

  // 绘制转盘
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 支持高 DPI 屏幕
    const dpr = window.devicePixelRatio || 1;
    const size = canvasSize;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制扇区
    segments.forEach((segment) => {
      const startAngle = (segment.displayStartAngle - 90) * (Math.PI / 180);
      const endAngle = (segment.displayEndAngle - 90) * (Math.PI / 180);

      // 绘制扇区
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = segment.option.color;
      ctx.fill();

      // 绘制边界
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 绘制文字 - 根据画布大小调整字体
      const midAngle = (segment.displayStartAngle + segment.displayEndAngle) / 2;
      const textAngle = (midAngle - 90) * (Math.PI / 180);
      const textRadius = radius * 0.7;
      const textX = centerX + Math.cos(textAngle) * textRadius;
      const textY = centerY + Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(midAngle * (Math.PI / 180));
      ctx.fillStyle = '#ffffff';
      const fontSize = Math.max(12, Math.min(16, size / 25));
      ctx.font = `bold ${fontSize}px system-ui, -apple-system`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText(segment.option.label, 0, 0);
      ctx.restore();
    });

    // 绘制中心圆 - 根据画布大小调整
    const centerCircleRadius = Math.max(40, Math.min(50, size / 8));
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerCircleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [segments, canvasSize]);

  // 开始旋转
  const handleSpin = () => {
    if (isSpinning || options.length === 0) return;

    setIsSpinning(true);

    // 计算获胜扇区
    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
    let random = Math.random() * totalWeight;
    let winningSegment: Segment | null = null;

    for (const segment of segments) {
      random -= segment.option.weight;
      if (random <= 0) {
        winningSegment = segment;
        break;
      }
    }

    if (!winningSegment) {
      winningSegment = segments[segments.length - 1];
    }

    // 计算最终角度（指针指向获胜扇区的中心）
    // 使用 displayStartAngle 和 displayEndAngle，因为这是画布上实际绘制的角度
    const winningAngle = (winningSegment.displayStartAngle + winningSegment.displayEndAngle) / 2;
    const spins = 5 + Math.random() * 3; // 5-8 圈
    const finalRotation = 360 * spins + (360 - winningAngle) + Math.random() * 20 - 10;

    // 设置旋转
    setRotation(finalRotation);

    // 3秒后完成
    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(winningSegment!.option.label);
    }, 3000);
  };

  // 响应式按钮大小
  const buttonSize = Math.max(80, Math.min(96, canvasSize / 4));

  return (
    <div ref={containerRef} className="relative flex flex-col items-center w-full">
      {/* 指针 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <div className="w-0 h-0 border-l-[12px] sm:border-l-[15px] border-l-transparent border-r-[12px] sm:border-r-[15px] border-r-transparent border-t-[24px] sm:border-t-[30px] border-t-red-500 drop-shadow-lg" />
      </div>

      {/* 转盘 */}
      <div className="relative mt-6 sm:mt-8">
        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            className="drop-shadow-2xl"
          />
        </div>

        {/* 中心按钮 */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-full bg-gradient-to-br from-pink-400 to-purple-500
            text-white font-semibold text-base sm:text-lg shadow-lg
            transition-all duration-200 prevent-zoom
            ${isSpinning
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-110 hover:shadow-xl active:scale-95'
            }
          `}
          style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
        >
          {isSpinning ? '...' : '开始'}
        </button>
      </div>
    </div>
  );
};
