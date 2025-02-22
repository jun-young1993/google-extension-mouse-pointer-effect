import Effect from './components/effect-styled/Effect';
import ReactDOM from 'react-dom/client';

// 전역 변수로 설정값 저장
let cachedSettings = {
  color: { r: 255, g: 0, b: 0 },
  size: 20,
  radius: 0,
  selectedEffect: 'ripple' as const,
};

// 초기 설정값 로드
function loadSettings() {
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings) {
      cachedSettings = result.settings;
    }
  });
}

// 페이지 로드 시 즉시 실행
loadSettings();
applyStyle();

// chrome storage 변경 감지
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    cachedSettings = changes.settings.newValue;
  }
});

function applyStyle() {
  document.addEventListener(
    'click',
    function (e) {
      const id = 'google-extension-mouse-pointer-effect';
      if (!document.getElementById(id)) {
        const ripple = document.createElement('div');
        ripple.id = id;
        document.body.appendChild(ripple);

        const root = ReactDOM.createRoot(ripple);
        root.render(
          <Effect
            effectType={cachedSettings.selectedEffect}
            radius={`${cachedSettings.radius}%`}
            size={`${cachedSettings.size}px`}
            color={`rgba(${cachedSettings.color.r}, ${cachedSettings.color.g}, ${cachedSettings.color.b}, 0.44)`}
          />
        );

        ripple.style.width = `${cachedSettings.size}px`;
        ripple.style.height = `${cachedSettings.size}px`;
        ripple.style.position = 'absolute';
        ripple.style.left = `${e.pageX - 10}px`;
        ripple.style.top = `${e.pageY - 10}px`;
        ripple.style.pointerEvents = 'none';

        setTimeout(() => {
          root.unmount();
          ripple.remove();
        }, 500);
      }
    },
    { capture: true }
  );
}
