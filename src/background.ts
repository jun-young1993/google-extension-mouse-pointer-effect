chrome.runtime.onInstalled.addListener(() => {
  chrome.scripting
    .registerContentScripts([
      {
        id: 'session-script',
        js: ['content.js'],
        css: ['tailwind.css'],
        persistAcrossSessions: false,
        matches: ['<all_urls>'], // 모든 URL에 적용
        runAt: 'document_idle', // 돔 완전히 실행후를 보장
        // runAt: "document_start",
      },
    ])
    .then(() => console.log('Content Script registered successfully'))
    .catch((err) => console.error('Error registering content script', err));
});
