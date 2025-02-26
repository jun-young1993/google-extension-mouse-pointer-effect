import Effect from './components/effect-styled/Effect';
import ReactDOM from 'react-dom/client';
import Trail from './components/trail-styled/Trail';

const effectDomId = 'google-extension-mouse-pointer-effect';
const trailDomId = 'google-extension-mouse-pointer-trail';
// 전역 변수로 설정값 저장
let cachedSettings = {
  color: { r: 255, g: 0, b: 0 },
  size: 20,
  radius: 0,
  selectedEffect: 'ripple' as const,
  selectedTrail: 'sparkle' as const,
};

// 초기 설정값 로드
function loadSettings(callback: () => void) {
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings) {
      cachedSettings = result.settings;
      callback();
    } else {
      callback();
    }
  });
}

function removeExistingElements() {
  const effectElement = document.getElementById(effectDomId);
  const trailElement = document.getElementById(trailDomId);

  if (effectElement) {
    const effectRoot = ReactDOM.createRoot(effectElement);
    effectRoot.unmount();
    effectElement.remove();
  }

  if (trailElement) {
    const trailRoot = ReactDOM.createRoot(trailElement);
    trailRoot.unmount();
    trailElement.remove();
  }
}
// chrome storage 변경 감지
chrome.storage.onChanged.addListener((changes) => {
  console.log('storage changed', changes);
  if (changes.settings) {
    cachedSettings = changes.settings.newValue;
    removeExistingElements();
    applyStyle();
    applyTrail();
  }
});

function applyStyle() {
  document.addEventListener(
    'click',
    function (e) {
      if (!document.getElementById(effectDomId)) {
        const ripple = document.createElement('div');
        ripple.id = effectDomId;
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

function applyTrail() {
  if (!document.getElementById(trailDomId)) {
    const trail = document.createElement('div');
    trail.id = trailDomId;
    document.body.appendChild(trail);
    const root = ReactDOM.createRoot(trail);
    root.render(
      <Trail
        trailType={cachedSettings.selectedTrail}
        size={`${cachedSettings.size}px`}
        color={`rgba(${cachedSettings.color.r}, ${cachedSettings.color.g}, ${cachedSettings.color.b}, 0.44)`}
        useInfinity={true}
      />
    );
  }
}
console.log('content.tsx loaded');
loadSettings(() => {
  console.log('loadSettings');
  applyStyle();
  applyTrail();
});
