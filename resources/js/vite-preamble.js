// This file sets up the React Fast Refresh preamble that @vitejs/plugin-react expects
if (import.meta.hot) {
  const RefreshRuntime = await import('/@react-refresh');

  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;

  // Set up the actual refresh runtime
  RefreshRuntime.injectIntoGlobalHook(window);
  window.$RefreshReg$ = (type, id) => {
    RefreshRuntime.register(type, import.meta.url + ' ' + id);
  };
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
