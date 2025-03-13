"use client";

import { useState, useEffect, memo } from "react";

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isComplete: false,
  };
};

const Countdown = memo(({ targetDate, onComplete }: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(targetDate)
  );

  useEffect(() => {
    // Atualiza o countdown a cada segundo
    const timer = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining(targetDate);
      setTimeRemaining(newTimeRemaining);

      if (newTimeRemaining.isComplete && onComplete) {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    // Limpa o timer quando o componente for desmontado
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  // Verificar se já passou a data alvo
  if (timeRemaining.isComplete) {
    return (
      <div className="text-center">
        <p className="text-gray-400">Este evento já aconteceu</p>
      </div>
    );
  }

  // Formatar números para sempre ter dois dígitos
  const formatNumber = (num: number): string => num.toString().padStart(2, "0");

  // Unidades de tempo para exibição
  const timeUnits = [
    { label: "Dias", value: timeRemaining.days },
    { label: "Horas", value: timeRemaining.hours },
    { label: "Min", value: timeRemaining.minutes },
    { label: "Seg", value: timeRemaining.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {timeUnits.map((unit) => (
        <div
          key={unit.label}
          className="bg-gray-800/60 backdrop-blur-sm p-3 rounded-lg text-center min-w-[80px]"
        >
          <div className="text-xl md:text-2xl font-bold text-white">
            {unit.label === "Dias" ? unit.value : formatNumber(unit.value)}
          </div>
          <div className="text-xs text-gray-400">{unit.label}</div>
        </div>
      ))}
    </div>
  );
});

Countdown.displayName = "Countdown";

export default Countdown;
