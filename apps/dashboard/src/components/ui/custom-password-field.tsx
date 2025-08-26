import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type CustomPasswordFieldProps = {
  id: string;
  label: string;
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
  error?: string;
  placeholder?: string;
};

export const CustomPasswordField = ({
  id,
  label,
  password,
  onChange,
  isDisabled,
  error,
  placeholder,
}: CustomPasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-2 text-gray-200"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={id}
          value={password}
          onChange={onChange}
          className="w-full border border-gray-600 rounded-md px-3 py-2.5 pr-10 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors placeholder-gray-400"
          placeholder={placeholder ?? "Enter your password"}
          disabled={isDisabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors cursor-pointer"
          disabled={isDisabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400 font-medium" role="alert">
          {error}
        </p>
      )}
    </>
  );
};
