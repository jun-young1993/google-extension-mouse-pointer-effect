import RangeInput from './RangeInput';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  accentColor: string;
}
const ColorRange = ({ label, value, onChange, accentColor }: Props) => {
  return (
    <>
      <RangeInput
        label={label}
        value={value}
        onChange={onChange}
        accentColor={accentColor}
        min={0}
        max={255}
      />
    </>
  );
};

export default ColorRange;
