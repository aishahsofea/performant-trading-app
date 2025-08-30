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
      <label className="block text-sm font-medium mb-2 text-content-primary" htmlFor={id}>
        {label}
      </label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={(e) => handleChange?.(e.target.value)}
        className="w-full min-w-[160px] border border-border-primary text-content-primary rounded-md px-3 py-2.5 text-sm hover:border-border-secondary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-colors cursor-pointer"
        style={{
          colorScheme: "dark",
        }}
      />
    </>
  );
};
