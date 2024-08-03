document.addEventListener('alpine:init', () => {
  const PRESETS = [
    // Star Realms
    [
      {
        name: 'Players',
        items: [
          {
            name: 'P1',
            metrics: [
              {
                value: 50,
              },
            ],
          },
          {
            name: 'P2',
            metrics: [
              {
                value: 50,
              },
            ],
          },
          {
            name: 'P3',
            metrics: [
              {
                value: 50,
              },
            ],
          },
          {
            name: 'P4',
            metrics: [
              {
                value: 50,
              },
            ],
          },
        ],
      },
    ],
    // Gloomhaven: Jaws of the Lion
    [
      {
        name: 'Players',
        items: [
          {
            name: 'Demolitionist',
            metrics: [
              {
                value: 0,
              },
              {
                value: 0,
                context: 'info',
              },
            ],
          },
          {
            name: 'Hatchet',
            metrics: [
              {
                value: 0,
              },
              {
                value: 0,
                context: 'info',
              },
            ],
          },
          {
            name: 'Red Guard',
            metrics: [
              {
                value: 0,
              },
              {
                value: 0,
                context: 'info',
              },
            ],
          },
          {
            name: 'Voidwarden',
            metrics: [
              {
                value: 0,
              },
              {
                value: 0,
                context: 'info',
              },
            ],
          },
        ],
      },
      {
        name: 'Monster 1',
        items: [
          {
            name: '1',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '2',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '3',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '4',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '5',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '6',
            metrics: [
              {
                value: 0,
              },
            ],
          },
        ],
      },
      {
        name: 'Monster 2',
        items: [
          {
            name: '1',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '2',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '3',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '4',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '5',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '6',
            metrics: [
              {
                value: 0,
              },
            ],
          },
        ],
      },
      {
        name: 'Monster 3',
        items: [
          {
            name: '1',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '2',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '3',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '4',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '5',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '6',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '7',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '8',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '9',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '10',
            metrics: [
              {
                value: 0,
              },
            ],
          },
        ],
      },
      {
        name: 'Monster 4',
        items: [
          {
            name: '1',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '2',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '3',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '4',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '5',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '6',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '7',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '8',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '9',
            metrics: [
              {
                value: 0,
              },
            ],
          },
          {
            name: '10',
            metrics: [
              {
                value: 0,
              },
            ],
          },
        ],
      },
    ],
  ];

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
  const clearParams = () => {
    const url = window.location.protocol + '//' + window.location.host + window.location.pathname;
    window.history.replaceState({ path: url }, '', url);
  };

  Alpine.data('dials', function () {
    return {
      // Data
      categories: this.$persist(null),

      // Method
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
        this.categories = null;
        window.location.reload();
      },

      // Initialization
      init() {
        try {
          const params = getParams();
          this.categories = JSON.parse(params.state);
          clearParams();
        } catch (e) {
          // Ignore malformed data
        }

        if (this.categories) return;

        const promptText = 'Select a preset below:\n1. Star Realms\n2. Gloomhaven: Jaws of the Lion';
        let presetIndex;
        while (!(presetIndex >= 1 && presetIndex <= PRESETS.length)) {
          presetIndex = Math.floor(prompt(promptText));
        }
        this.categories = deepCopy(PRESETS[presetIndex - 1]);
      },
    };
  });
});
