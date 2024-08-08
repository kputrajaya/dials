document.addEventListener('alpine:init', () => {
  const PRESETS = {
    'Gloomhaven: Jaws of the Lion': [
      {
        name: 'Players',
        open: true,
        items: [
          { name: 'Demolitionist', metrics: [{ value: 8 }, { value: 0, context: 'info' }] },
          { name: 'Hatchet', metrics: [{ value: 8 }, { value: 0, context: 'info' }] },
          { name: 'Red Guard', metrics: [{ value: 10 }, { value: 0, context: 'info' }] },
          { name: 'Voidwarden', metrics: [{ value: 6 }, { value: 0, context: 'info' }] },
        ],
      },
      ...[...Array(5).keys()].map((i) => ({
        name: `Monster ${i + 1}`,
        open: false,
        items: [...Array(10).keys()].map((j) => ({ name: `${j + 1}`, metrics: [{ value: 0 }] })),
      })),
    ],
    'Star Realms': [
      {
        name: 'Players',
        open: true,
        items: [
          { name: 'P1', metrics: [{ value: 50 }] },
          { name: 'P2', metrics: [{ value: 50 }] },
          { name: 'P3', metrics: [{ value: 0 }] },
          { name: 'P4', metrics: [{ value: 0 }] },
        ],
      },
    ],
  };

  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
  const getParams = () => {
    const params = {};
    const search = window.location.search;
    if (search) {
      search
        .substring(1)
        .split('&')
        .forEach((param) => {
          const [key, value] = param.split('=');
          params[key] = decodeURIComponent(value).replace(/\+/g, ' ').replace(/\|/g, '\n');
        });
    }
    return params;
  };

  Alpine.data('dials', function () {
    return {
      // Constants
      presetKeys: Object.keys(PRESETS),

      // Data
      categories: this.$persist([]),
      lastJson: null,

      // Method
      itemActive(item) {
        return item.metrics.some((metric) => metric.value > 0);
      },
      loadPreset(presetKey) {
        this.categories = deepCopy(PRESETS[presetKey]);
      },
      metricDecrease(metric) {
        if (metric.value > 0) {
          metric.value--;
        } else {
          metric.value = 0;
        }
      },
      metricIncrease(metric) {
        metric.value++;
      },
      metricBlur(metric) {
        const safeValue = Math.max(0, Math.floor(metric.value) || 0);
        metric.value = null;
        metric.value = safeValue;
      },
      reset() {
        const response = prompt('Reset values? Type "y" to continue.') || '';
        if (response.trim().toLowerCase() !== 'y') return;
        this.categories = [];
      },

      // Initialization
      init() {
        const connect = (subKey) => {
          const ws = new WebSocket('wss://pubsub.h.kvn.pt/');
          ws.onmessage = (event) => {
            console.log('Received data');
            this.lastJson = event.data;
            this.categories = JSON.parse(event.data);
          };
          ws.onopen = () => {
            console.log('Subscribing to:', subKey);
            ws.send(JSON.stringify({ action: 'sub', key: subKey }));
          };
          ws.onclose = (e) => {
            console.log('Socket closed:', e.reason);
            setTimeout(() => connect(subKey), 1000);
          };
          ws.onerror = function (err) {
            console.error('Socket error:', err.message);
            ws.close();
          };
          this.$watch('categories', (value) => {
            if (JSON.stringify(this.categories) === this.lastJson) return;
            console.log('Sending data');
            ws.send(JSON.stringify({ action: 'pub', key: subKey, data: value }));
          });
        };

        const params = getParams();
        if (params.k) {
          connect('dials:' + params.k);
        }
      },
    };
  });
});
