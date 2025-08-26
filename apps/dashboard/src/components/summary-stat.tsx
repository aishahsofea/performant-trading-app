type SummaryStatProps = {
  icon: string;
  title: string;
  value: number | string;
};

export const SummaryStat = ({ icon, title, value }: SummaryStatProps) => {
  return (
    <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg shadow-lg">
      <div className="flex items-center">
        <div className="py-4 px-5 rounded-full bg-gray-700 border border-gray-600 mr-4">
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-3xl font-bold text-violet-400">{value}</p>
        </div>
      </div>
    </div>
  );
};
