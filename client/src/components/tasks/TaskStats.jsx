import { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Layers, Clock, Flame, CheckCircle2 } from 'lucide-react';

const AnimatedCount = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (end === 0) {
      const timer = setTimeout(() => {
        setCount(0);
      }, 0);
      return () => clearTimeout(timer);
    }
    
    const duration = 800; // ms
    const increment = Math.ceil(end / (duration / 16));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

export const TaskStats = () => {
  const { stats, loading } = useTasks();

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.Total,
      label: 'Tasks Total',
      icon: Layers,
      colorClass: 'text-text-primary border-t-2 border-t-text-muted',
      bgGlow: 'hover:shadow-[0_0_20px_rgba(161,161,170,0.08)]'
    },
    {
      title: 'Pending',
      value: stats.Pending,
      label: 'Need Attention',
      icon: Flame,
      colorClass: 'text-accent-amber border-t-2 border-t-accent-amber',
      bgGlow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]'
    },
    {
      title: 'In-Progress',
      value: stats['In-Progress'] || 0,
      label: 'Being Worked On',
      icon: Clock,
      colorClass: 'text-accent-blue border-t-2 border-t-accent-blue',
      bgGlow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]'
    },
    {
      title: 'Completed',
      value: stats.Completed,
      label: 'Done!',
      icon: CheckCircle2,
      colorClass: 'text-accent-green border-t-2 border-t-accent-green',
      bgGlow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]'
    }
  ];

  if (loading && stats.Total === 0) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full select-none">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-28 rounded-xl skeleton border border-border-subtle" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full select-none">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`p-5 rounded-xl bg-bg-secondary border border-border-subtle ${card.colorClass} ${card.bgGlow} shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between h-28`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
                {card.title}
              </span>
              <Icon className="w-4 h-4 text-text-muted" />
            </div>
            
            <div className="flex flex-col text-left mt-2">
              <span className="text-3xl font-display font-extrabold text-text-primary">
                <AnimatedCount value={card.value} />
              </span>
              <span className="text-[10px] text-text-muted font-medium mt-1 font-mono uppercase tracking-wider">
                {card.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;
