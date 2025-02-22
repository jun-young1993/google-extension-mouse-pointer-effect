import ItemBox from '../components/ItemBox';
import { useEffect, useState } from 'react';
import Options from './Options';
import Effect, {
  EffectTypes,
  effectTypes,
} from '../components/effect-styled/Effect';
import ToggleButton from './ToggleButton';

const Popup = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [color, setColor] = useState<{ r: number; g: number; b: number }>({
    r: 255,
    g: 0,
    b: 0,
  });
  const [radius, setRadius] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedEffect, setSelectedEffect] = useState<EffectTypes>(
    effectTypes[0]
  );
  // const [isChanged, setIsChanged] = useState<boolean>(false);
  useEffect(() => {
    const loadColor = async () => {
      const storedColor = await chrome.storage.sync.get(['color']);
      const storedRadius = await chrome.storage.sync.get(['radius']);
      const storedSize = await chrome.storage.sync.get(['size']);
      const storedSelectedEffect = await chrome.storage.sync.get([
        'selectedEffect',
      ]);
      if (storedColor.color) {
        setColor(storedColor.color);
      }
      if (storedRadius.radius) {
        setRadius(storedRadius.radius);
      }
      if (storedSize.size) {
        setSize(storedSize.size);
      }
      if (storedSelectedEffect.selectedEffect) {
        setSelectedEffect(storedSelectedEffect.selectedEffect);
      }
    };
    loadColor();
  }, []);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const saveOptions = () => {
    chrome.storage.sync.set({
      color,
      radius,
      size,
      selectedEffect,
    });
  };

  return (
    <div className="w-full h-full mt-2 mx-2">
      <div className="flex justify-between items-center mx-4">
        <button
          type="button"
          className="text-xs text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          // disabled={isChanged === false}
          onClick={saveOptions}
        >
          Save Settings
        </button>
        <ToggleButton
          label="Options"
          checked={isPanelOpen}
          onChange={togglePanel}
        />
      </div>
      <div className={`flex ${isPanelOpen ? 'flex-row' : 'flex-col'} mx-4`}>
        <div
          className={`${isPanelOpen ? 'flex-grow' : 'w-full'} grid grid-cols-3 gap-4`}
        >
          {effectTypes.map((effectType) => (
            <ItemBox
              key={effectType}
              isSelected={selectedEffect == effectType}
              onClick={() => {
                setSelectedEffect(effectType);
                // setIsChanged(true);
              }}
            >
              <Effect
                effectType={effectType}
                size={`${size}px`}
                color={`rgba(${color.r}, ${color.g}, ${color.b}, 0.44)`}
                useInfinity={true}
                radius={`${radius}%`}
              />
            </ItemBox>
          ))}
        </div>
        {isPanelOpen && (
          <div className="flex-grow-2 shadow-lg p-4 h-full">
            <Options
              onColorChange={(color) => {
                setColor(color);
                // setIsChanged(true);
              }}
              colors={color}
              radius={radius}
              onRadiusChange={(value) => {
                setRadius(value);
                // setIsChanged(true);
              }}
              size={size}
              onSizeChange={(value) => {
                setSize(value);
                // setIsChanged(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
