type DateInputProps = {
  label: string;
  id: string;
  value?: string;
  handleChange?: (date: string) => void;
};

export const DateInput = ({
  label,
  id,
  value,
  handleChange,
}: DateInputProps) => {
  return (
    <>
      <label className="block text-sm font-medium mb-2 text-white" htmlFor={id}>
        {label}
      </label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={(e) => handleChange?.(e.target.value)}
        className="w-full min-w-[160px] border border-gray-600 text-white rounded-md px-3 py-2.5 text-sm hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors cursor-pointer"
        style={{
          colorScheme: "dark",
        }}
      />
    </>
  );
};
