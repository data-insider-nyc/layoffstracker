import React from "react";

interface KpiCardProps {
  title: string;
  value: number | string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value }) => {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US").format(value)
      : value;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
    </div>
  );
};

export default KpiCard;