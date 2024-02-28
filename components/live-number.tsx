import React from 'react';
import numeral from 'numeral';
import { cn } from '@/lib/utils';

interface LiveNumberProps {
  num: number;
  format?: string;
  live?: boolean;
  className?: string;
  sign?: boolean;
}

const getColorClass = (value: number): string => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';

  return ''; // Return an empty string if value is 0 or not a valid number
};

const getDisplayNum = (num: number, formattedNum: string, shouldSign: boolean): string => {
  if (!shouldSign || num === 0) return formattedNum;
  const sign = num > 0 ? '+' : '';

  return `${sign}${formattedNum}`;
};

const LiveNumber: React.FC<LiveNumberProps> = ({
  num,
  format = '0,0.00a',
  live = false,
  className,
  sign = false,
}) => {
  const threshold = 1e-6;
  const isValidNumber = isFinite(num) && Math.abs(num) >= threshold;
  const val = isValidNumber ? num : 0;
  const formattedNum = numeral(val).format(format).toUpperCase();
  const displayNum = getDisplayNum(val, formattedNum, sign);
  const colorClass = getColorClass(val);
  const finalClassName = live ? cn(className, colorClass) : className;

  return <span className={finalClassName}>{displayNum}</span>;
};

export default LiveNumber;
