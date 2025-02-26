interface RangeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  accentColor?: string;
  min: number;
  max: number;
}
const RangeInput = ({
  label,
  value,
  onChange,
  accentColor = 'blue',
  min,
  max,
}: RangeInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };
  return (
    <div className="inline-flex items-center gap-2">
      <label
        htmlFor={`${label}-range`}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        id={`${label}-range`}
        type="range"
        min={min}
        max={max}
        style={{
          accentColor: `${accentColor}`,
        }}
        value={value}
        onChange={handleChange}
        className="w-full h-2 rounded-lg cursor-pointer"
      />
    </div>
  );
};

export default RangeInput;
