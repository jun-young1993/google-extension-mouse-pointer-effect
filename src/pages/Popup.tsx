import ItemBox from '../components/ItemBox';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Options from './Options';
import Effect, {
  EffectTypes,
  effectTypes,
} from '../components/effect-styled/Effect';
import ToggleButton from './ToggleButton';

const Popup = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [settings, setSettings] = useState({
    color: { r: 255, g: 0, b: 0 },
    radius: 0,
    size: 10,
    selectedEffect: effectTypes[0] as EffectTypes,
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const stored = await chrome.storage.sync.get(['settings']);
      if (stored.settings) {
        setSettings((prev) => ({
          ...prev,
          ...(stored.settings.color && { color: stored.settings.color }),
          ...(stored.settings.radius && { radius: stored.settings.radius }),
          ...(stored.settings.size && { size: stored.settings.size }),
          ...(stored.settings.selectedEffect && {
            selectedEffect: stored.settings.selectedEffect,
          }),
        }));
        setIsInitialized(true);
      }
    };

    loadSettings();
    window.addEventListener('storage', loadSettings);
    return () => window.removeEventListener('storage', loadSettings);
  }, []);

  const handleSettingsUpdate = useCallback(
    (newSettings: Partial<typeof settings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  useEffect(() => {
    if (!isInitialized) return;

    chrome.storage.sync.set({
      settings,
    });
  }, [settings, isInitialized]);

  const renderEffectItems = useMemo(
    () =>
      effectTypes.map((effectType) => (
        <ItemBox
          key={effectType}
          isSelected={settings.selectedEffect === effectType}
          onClick={() => handleSettingsUpdate({ selectedEffect: effectType })}
        >
          <Effect
            effectType={effectType}
            size={`${settings.size}px`}
            color={`rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, 0.44)`}
            useInfinity={true}
            radius={`${settings.radius}%`}
          />
        </ItemBox>
      )),
    [settings, handleSettingsUpdate]
  );

  return (
    <div className="w-full h-full mt-2 mx-2">
      <div className="flex justify-between items-center mx-4">
        <ToggleButton
          label="Options"
          checked={isPanelOpen}
          onChange={() => setIsPanelOpen((prev) => !prev)}
        />
      </div>
      <div className={`flex ${isPanelOpen ? 'flex-row' : 'flex-col'} mx-4`}>
        <div
          className={`${isPanelOpen ? 'flex-grow' : 'w-full'} grid grid-cols-3 gap-4`}
        >
          {renderEffectItems}
        </div>
        {isPanelOpen && (
          <div className="flex-grow-2 shadow-lg p-4 h-full">
            <Options
              onColorChange={(color) => handleSettingsUpdate({ color })}
              colors={settings.color}
              radius={settings.radius}
              onRadiusChange={(radius) => handleSettingsUpdate({ radius })}
              size={settings.size}
              onSizeChange={(size) => handleSettingsUpdate({ size })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
