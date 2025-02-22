import { useEffect, useState } from 'react';
import ColorRange from './ColorRange';
export interface ColorPickerProps {
  onChange: (color: { r: number; g: number; b: number }) => void;
  colors: {
    r: number;
    g: number;
    b: number;
  };
}
const ColorPicker = ({ colors, onChange }: ColorPickerProps) => {
  const [color, setColor] = useState(colors);
  useEffect(() => {
    onChange(color);
  }, [color]);
  return (
    <div className="flex flex-col gap-4">
      <ColorRange
        label="Red"
        value={color.r}
        onChange={(value) => setColor({ ...color, r: value })}
        accentColor={`rgb(${color.r}, 0, 0)`}
      />
      <ColorRange
        label="Green"
        value={color.g}
        onChange={(value) => setColor({ ...color, g: value })}
        accentColor={`rgb(0, ${color.g}, 0)`}
      />
      <ColorRange
        label="Blue"
        value={color.b}
        onChange={(value) => setColor({ ...color, b: value })}
        accentColor={`rgb(0, 0, ${color.b})`}
      />
    </div>
  );
};

export default ColorPicker;
