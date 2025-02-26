import ItemBox from '../components/ItemBox';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Options from './Options';
import Effect, {
  EffectTypes,
  effectTypes,
} from '../components/effect-styled/Effect';
import ToggleButton from '../components/ToggleButton';
import Tabs from '../components/Tabs';
import Trail, {
  trailTypes,
  TrailTypes,
} from '../components/trail-styled/Trail';

const tabs = ['Effect', 'Trail'];

interface Settings {
  color: { r: number; g: number; b: number };
  radius: number;
  size: number;
  selectedEffect: EffectTypes;
  selectedTrail: TrailTypes;
  effectType: string;
  useInfinity: boolean;
}

const Popup = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>({
    color: { r: 255, g: 0, b: 0 },
    radius: 0,
    size: 10,
    selectedEffect: effectTypes[0] as EffectTypes,
    selectedTrail: trailTypes[0] as TrailTypes,
    effectType: 'default',
    useInfinity: false,
  });
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';
  const isChrome = chrome.storage ? true : false;
  const loadSettings = async () => {
    try {
      if (isChrome) {
        const result = await chrome.storage.sync.get({
          effectType: 'default',
          useInfinity: false,
        });
        setSettings((prev) => ({
          ...prev,
          ...result,
          ...(result.color && { color: result.color }),
          ...(result.radius && { radius: result.radius }),
          ...(result.size && { size: result.size }),
          ...(result.selectedEffect && {
            selectedEffect: result.selectedEffect,
          }),
          ...(result.selectedTrail && { selectedTrail: result.selectedTrail }),
        }));
        setIsInitialized(true);
      } else {
        throw new Error('Not running in Chrome browser');
      }
    } catch (error) {
      console.error('[loadSettings error]', error);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSettingsUpdate = useCallback(
    (newSettings: Partial<typeof settings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  useEffect(() => {
    if (!isInitialized) return;
    setSettings((prev) => ({ ...prev, ...settings }));
    if (isChrome) {
      chrome.storage.sync.set({
        settings,
      });
    }
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

  const renderTrailItems = useMemo(() => {
    return trailTypes.map((trailType) => (
      <ItemBox
        key={trailType}
        isSelected={settings.selectedTrail === trailType}
        onClick={() => handleSettingsUpdate({ selectedTrail: trailType })}
      >
        <Trail
          trailType={trailType}
          size={`${settings.size}px`}
          color={`rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, 0.44)`}
          usePreview={true}
          effectType={settings.selectedEffect}
          useInfinity={true}
        />
      </ItemBox>
    ));
  }, [settings]);
  return (
    <div className="w-full h-full mt-2 mx-2">
      <div className="flex justify-between items-center mx-4">
        <ToggleButton
          label="Options"
          checked={isPanelOpen}
          onChange={() => setIsPanelOpen((prev) => !prev)}
        />
      </div>
      <Tabs items={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div
        className={`flex ${isPanelOpen ? 'flex-row' : 'flex-col'} mx-4 border border-gray-200 p-1`}
      >
        <div
          className={`${isPanelOpen ? 'flex-grow' : 'w-full'} grid grid-cols-3 gap-4`}
        >
          {activeTab === tabs[0] && renderEffectItems}
          {activeTab === tabs[1] && renderTrailItems}
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
      {isDev && (
        <Trail
          trailType={settings.selectedTrail}
          size={`${settings.size}px`}
          color={`rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, 0.44)`}
          useInfinity={false}
        />
      )}
    </div>
  );
};

export default Popup;
