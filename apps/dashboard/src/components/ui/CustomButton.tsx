type CustomButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  text: string;
};

export const CustomButton = ({
  disabled,
  onClick,
  text,
}: CustomButtonProps) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-purple-600 text-white px-6 py-2.5 rounded-md hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {text}
    </button>
  );
};
