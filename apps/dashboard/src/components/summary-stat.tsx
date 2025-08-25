type SummaryStatProps = {
  icon: string;
  title: string;
  value: number | string;
};

export const SummaryStat = ({ icon, title, value }: SummaryStatProps) => {
  return (
    <div className="p-6 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <div className="py-4 px-5 rounded-full bg-gray-900 mr-4">
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
          <p className="text-3xl font-bold text-blue-600">{value}</p>
        </div>
      </div>
    </div>
  );
};
