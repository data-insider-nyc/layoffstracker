import React from "react";

interface KpiCardProps {
  title: string;
  value: number | string;
  note?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, note = "" }) => {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US").format(value)
      : value;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 text-center border dark:border-gray-700 transition-colors duration-200">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-2xl font-medium text-gray-900 dark:text-white">{formattedValue}</p>
      {note && <h3 className="text-sm text-blue-500 dark:text-blue-400">{note}</h3>}
    </div>
  );
};

export default KpiCard;