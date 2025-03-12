import ItemBox from '../components/ItemBox';
import { useEffect, useState, useCallback, useMemo } from 'react';
// import Options from './Options';
import Effect, {
  EffectTypes,
  effectTypes,
} from '../components/effect-styled/Effect';
// import ToggleButton from '../components/ToggleButton';

interface Settings {
  color: { r: number; g: number; b: number };
  radius: number;
  size: number;
  selectedEffect: EffectTypes;
  effectType: string;
  useInfinity: boolean;
}

// 디바운스 함수 정의
function debounce(func: (...args: unknown[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const Popup = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>({
    color: { r: 255, g: 0, b: 0 },
    radius: 0,
    size: 10,
    selectedEffect: effectTypes[0] as EffectTypes,
    effectType: 'default',
    useInfinity: false,
  });
  // const [isPanelOpen, setIsPanelOpen] = useState(false);
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

  // 디바운스된 저장 함수 생성
  const debouncedSaveSettings = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        const newSettings = args[0] as Settings;
        if (isChrome) {
          chrome.storage.sync.set({ settings: newSettings }, () => {
            console.log('Settings saved:', newSettings);
          });
        }
      }, 1000), // 1초 대기
    [isChrome]
  );

  useEffect(() => {
    if (!isInitialized) return;
    setSettings((prev) => ({ ...prev, ...settings }));
    debouncedSaveSettings(settings); // 디바운스된 저장 함수 호출
  }, [settings, isInitialized, debouncedSaveSettings]);

  const renderEffectItems = useMemo(
    () =>
      effectTypes.map((effectType) => (
        <ItemBox
          key={effectType}
          isSelected={settings.selectedEffect === effectType}
          onClick={() => handleSettingsUpdate({ selectedEffect: effectType })}
        >
          <div>effect</div>
          {/* <Effect
            effectType={effectType}
            size={`${settings.size}px`}
            color={`rgba(${settings.color.r}, ${settings.color.g}, ${settings.color.b}, 0.44)`}
            useInfinity={true}
            radius={`${settings.radius}%`}
          /> */}
        </ItemBox>
      )),
    [settings, handleSettingsUpdate]
  );

  return (
    <div className="w-full h-full mt-2 mx-2">
      <div className="flex justify-between items-center mx-4">
        {/* <ToggleButton
          label="Options"
          checked={isPanelOpen}
          onChange={() => setIsPanelOpen((prev) => !prev)}
        /> */}
      </div>
      <div
        className={`flex ${isPanelOpen ? 'flex-row' : 'flex-col'} mx-4 border border-gray-200 p-1`}
      >
        <div
          className={`${isPanelOpen ? 'flex-grow' : 'w-full'} grid grid-cols-3 gap-4`}
        >
          {renderEffectItems}
        </div>
        {/* {isPanelOpen && (
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
        )} */}
      </div>
    </div>
  );
};

export default Popup;
