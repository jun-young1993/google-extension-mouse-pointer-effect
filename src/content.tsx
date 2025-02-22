import Effect from './components/effect-styled/Effect';
import ReactDOM from 'react-dom/client';

// 페이지 로드 시 즉시 실행
applyStyle();
chrome.storage.sync.get(['selected'], (result) => {
  if (result.selected) {
    applyStyle();
  }
});

chrome.runtime.onMessage.addListener(() => {
  applyStyle();
});

function applyStyle() {
  document.addEventListener(
    'click',
    function (e) {
      // id로 ripple 요소 체크
      const id = 'google-extension-mouse-pointer-effect';
      console.log('document.getElementById(id)', document.getElementById(id));
      if (!document.getElementById(id)) {
        const ripple = document.createElement('div');
        ripple.id = id;
        document.body.appendChild(ripple);
        // React 요소를 DOM에 렌더링

        chrome.storage.sync.get(
          ['color', 'size', 'radius', 'selectedEffect'],
          (result) => {
            console.log('result', result);
            const size = `${result.size || 20}px`;
            const background = result.color
              ? `rgba(${result.color.r}, ${result.color.g}, ${result.color.b}, 0.44)`
              : 'rgba(255, 0, 0, 0.44)';
            const radius = `${result.radius || 0}%`;
            const root = ReactDOM.createRoot(ripple);
            const effectType = result.selectedEffect || 'ripple';
            root.render(
              <Effect
                effectType={effectType}
                radius={radius}
                size={size}
                color={background}
              />
            );

            ripple.style.width = size;
            ripple.style.height = size;
            ripple.style.position = 'absolute';
            ripple.style.left = `${e.pageX - 10}px`;
            ripple.style.top = `${e.pageY - 10}px`;
            ripple.style.pointerEvents = 'none';
            setTimeout(() => {
              root.unmount(); // React 컴포넌트 정리
              ripple.remove();
            }, 500);
          }
        );
      }
    },
    { capture: true }
  );
}
