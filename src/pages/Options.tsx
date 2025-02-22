import ColorPicker, { ColorPickerProps } from '../components/ColorPicker';
import RangeInput from '../components/RangeInput';
interface Props {
  onColorChange: ColorPickerProps['onChange'];
  colors: ColorPickerProps['colors'];
  radius: number;
  onRadiusChange: (value: number) => void;
  size: number;
  onSizeChange: (value: number) => void;
}
const Options = ({
  onColorChange,
  colors,
  radius,
  onRadiusChange,
  size,
  onSizeChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <ColorPicker
        onChange={(color) => {
          onColorChange(color);
        }}
        colors={colors}
      />
      <RangeInput
        label="Radius"
        value={radius}
        onChange={(value) => {
          onRadiusChange(value);
        }}
        min={0}
        max={100}
      />
      <RangeInput
        label="Size"
        value={size}
        onChange={(value) => {
          onSizeChange(value);
        }}
        min={0}
        max={100}
      />
    </div>
  );
};

export default Options;
