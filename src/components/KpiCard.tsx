import React from "react";

interface KpiCardProps {
  title: string;
  value: number | string;
  note: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, note }) => {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US").format(value)
      : value;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-center">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-medium text-gray-900">{formattedValue}</p>
      <h3 className="text-sm text-blue-500">{note}</h3>
    </div>
  );
};

export default KpiCard;