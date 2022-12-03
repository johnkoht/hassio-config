var CONFIG = {
  customTheme: "CUSTOM_THEMES.TRANSPARENT", // CUSTOM_THEMES.TRANSPARENT, CUSTOM_THEMES.MATERIAL, CUSTOM_THEMES.MOBILE, CUSTOM_THEMES.COMPACT, CUSTOM_THEMES.HOMEKIT, CUSTOM_THEMES.WINPHONE, CUSTOM_THEMES.WIN95
  transition: TRANSITIONS.ANIMATED_GPU, //ANIMATED or SIMPLE (better perfomance)
  entitySize: ENTITY_SIZES.NORMAL, //SMALL, BIG are available
  tileSize: 150,
  tileMargin: 6,
  serverUrl: 'http://' + location.hostname + ':8123',
  wsUrl: 'ws://' + location.hostname + ':8123/api/websocket',
  authToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhOTc3MjU5ZjZjOTQ0YTdlYTE3OGQ3MDAwNjE0ZGU4OSIsImlhdCI6MTY0Njk2NjE4NSwiZXhwIjoxOTYyMzI2MTg1fQ.SwVpdXq4DzYJgiPwUNjRYCDdXxQ6WmwKLJ-Td5DnPug", // optional long-lived token (CAUTION: only if TileBoard is not exposed to the internet)
  //googleApiKey: "XXXXXXXXXX", // Required if you are using Google Maps for device tracker
  //mapboxToken: "XXXXXXXXXX", // Required if you are using Mapbox for device tracker
  debug: false, // Prints entities and state change info to the console.
  pingConnection: true, //ping connection to prevent silent disconnections
  locale: 'en-us', // locale for date and number formats - available locales: it, de, es, fr, pt, ru, nl, pl, en-gb, en-us (default). See readme on adding custom locales.
  // next fields are optional
  events: [],
  timeFormat: 24,
  menuPosition: MENU_POSITIONS.LEFT, // or BOTTOM
  hideScrollbar: false, // horizontal scrollbar
  groupsAlign: GROUP_ALIGNS.HORIZONTALLY, // HORIZONTALLY, VERTICALLY, GRID
  onReady: function() {},

  header: { // https://github.com/resoai/TileBoard/wiki/Header-configuration
    styles: {
      margin: '30px 130px 0',
      fontSize: '28px'
    },
    right: [{
        type: HEADER_ITEMS.CUSTOM_HTML,
        html: 'MyCity'
      },
      {
        type: HEADER_ITEMS.WEATHER,
        styles: {
          margin: '0'
        },
        icon: '&weather.mycity.state',
        state: '&weather.mycity.state',
        icons: {
          'clear-day': 'clear',
          'clear-night': 'nt-clear',
          'cloudy': 'cloudy',
          'exceptional': 'unknown',
          'fog': 'fog',
          'hail': 'sleet',
          'lightning': 'chancestorms',
          'lightning-rainy': 'tstorms',
          'partly-cloudy-day': 'partlycloudy',
          'partly-cloudy-night': 'nt-partlycloudy',
          'partlycloudy': 'partlycloudy',
          'pouring': 'rain',
          'snowy': 'snow',
          'snowy-rainy': 'sleet',
          'wind': 'unknown',
          'windy': 'unknown',
          'windy-variant': 'unknown'
        },
        states: {
          'clear-night': 'Clear, night',
          'cloudy': 'Cloudy',
          'exceptional': 'Exceptional',
          'fog': 'Fog',
          'hail': 'Hail',
          'lightning': 'Lightning',
          'lightning-rainy': 'Lightning, rainy',
          'partlycloudy': 'Partly cloudy',
          'pouring': 'Pouring',
          'rainy': 'Rainy',
          'snowy': 'Snowy',
          'snowy-rainy': 'Snowy, rainy',
          'sunny': 'Sunny',
          'windy': 'Windy',
          'windy-variant': 'Windy'
        },
        fields: {
          temperature: '&weather.mycity.attributes.temperature',
          temperatureUnit: '°C',
        }
      }
    ],
    left: [{
        type: HEADER_ITEMS.CUSTOM_HTML,
        html: '<b><i>Home Sweet Home</b></i>'
      },
      {
        type: HEADER_ITEMS.DATETIME,
        dateFormat: 'EEEE, dd LLLL', //https://docs.angularjs.org/api/ng/filter/date
      },
      // {
      //    type: HEADER_ITEMS.DATE,
      //    dateFormat: 'EEEE, LLLL dd', //https://docs.angularjs.org/api/ng/filter/date
      // },
      // {
      //    type: HEADER_ITEMS.TIME,
      // },
    ]
  },

  /*screensaver: {// optional. https://github.com/resoai/TileBoard/wiki/Screensaver-configuration
   timeout: 300, // after 5 mins of inactive
   slidesTimeout: 10, // 10s for one slide
   styles: { fontSize: '40px' },
   leftBottom: [{ type: SCREENSAVER_ITEMS.DATETIME }], // put datetime to the left-bottom of screensaver
   slides: [
    { bg: 'images/bg1.jpeg' },
    {
     bg: 'images/bg2.png',
     rightTop: [ // put text to the 2nd slide
        {
         type: SCREENSAVER_ITEMS.CUSTOM_HTML,
         html: 'Welcome to the <b>TileBoard</b>',
         styles: { fontSize: '40px' }
        }
     ]
    },
    { bg: 'images/bg3.jpg' }
   ]
  },*/

  pages: [{
      title: 'Main page',
      bg: 'images/bg1.jpeg',
      icon: 'mdi-home-outline', // home icon
      groups: [{
          title: 'First group',
          width: 2,
          height: 3,
          // row: 0,  // optional; index of the row used for the GRID layout. If not specified, the default is 0
          items: [{
              position: [0, 0],
              width: 2,
              type: TYPES.TEXT_LIST,
              id: {}, // using empty object for an unknown id
              state: false, // disable state element
              list: [{
                  title: 'Sun.sun state',
                  icon: 'mdi-weather-sunny',
                  value: '&sun.sun.state'
                },
                {
                  title: 'Custom',
                  icon: 'mdi-clock-outline',
                  value: 'value'
                }
              ]
            },
            {
              position: [0, 1], // [x, y]
              width: 1,
              type: TYPES.SENSOR,
              id: 'binary_sensor.updater',
              state: '@attributes.release_notes' // https://github.com/resoai/TileBoard/wiki/Templates
            },
            {
              title: 'Heating',
              position: [1, 1],
              id: {
                attributes: {
                  current_temperature: 11
                }
              },
              type: TYPES.CLIMATE,
              unit: '°C',
              useHvacMode: true, // Optional: enables HVAC mode (by default uses PRESET mode)
              state: function(item, entity) {
                return 'Actual: ' + this.$scope.filterNumber(entity.attributes.current_temperature, 1) + ' °C';
              },
              states: {
                'auto': 'Automatic',
                'heat': 'Manual',
                'off': 'Off'
              },
            },
          ]
        },

        {
          title: 'Interior Lights',
          width: 3,
          height: 3,
          // row: 0,  // optional; index of the row used for the GRID layout. If not specified, the default is 0
          items: [
            {
              position: [0, 0],
              width: 1,
              id: "group.kitchen_lights",
              title: "Kitchen Lights",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [1, 0],
              width: 1,
              id: "light.family_room_main_lights",
              title: "Family Room Lights",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [2, 0],
              width: 1,
              id: "group.playroom_lights",
              title: "Playroom Lights",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [0, 1],
              width: 1,
              id: "group.office_lights",
              title: "Office Lights",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [1, 1],
              width: 1,
              id: "light.mudroom_main_lights",
              title: "Mudroom Lights",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [2, 1],
              width: 1,
              id: "light.main_bedroom_main_lights",
              title: "Main Bedrooom Lights",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
          ],
        },

        {
          title: 'Exterior Lights',
          width: 1,
          height: 3,
          // row: 1,  // optional; index of the row used for the GRID layout. If not specified, the default is 0
          items: [
            {
              position: [0, 0],
              width: 1,
              id: "light.exterior_driveway_sconces",
              title: "Driveway Sconces",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [1, 0],
              width: 1,
              id: "light.exterior_front_porch_pendant",
              title: "Front Porch Pendant",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [2, 0],
              width: 1,
              id: "light.exterior_garage_sconces",
              title: "Garage Sconces",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [0, 1],
              width: 1,
              id: "light.exterior_hue_outdoor_spot_1",
              title: "Hut Spot 1",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [1, 1],
              width: 1,
              id: "light.exterior_hue_outdoor_spot_2",
              title: "Hut Spot 2",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [2, 1],
              width: 1,
              id: "light.exterior_hue_outdoor_spot_3",
              title: "Hut Spot 3",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [0, 2],
              width: 1,
              id: "light.exterior_back_porch_lights",
              title: "Back Porch Sconces",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [1, 2],
              width: 1,
              id: "light.exterior_backyard_flood_east",
              title: "Backyard Flood East",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
            {
              position: [2, 2],
              width: 1,
              id: "light.exterior_backyard_flood_west",
              title: "Backyard Flood West",
              type: TYPES.LIGHT,
              states: {
                on: "On",
                off: "Off"
              },
              icons: {
                on: "mdi-lightbulb-on",
                off: "mdi-lightbulb"
              }
            },
          ]
        }
      ]
    },
    {
      title: 'Second page',
      bg: 'images/bg2.png',
      icon: 'mdi-numeric-2-box-outline',
      groups: [{
        title: '',
        width: 4,
        height: 3,
        items: [{
            position: [0, 0],
            width: 2,
            title: 'Short instruction',
            type: TYPES.TEXT_LIST,
            id: {}, // using empty object for an unknown id
            state: false, // disable state element
            list: [{
                title: 'Read',
                icon: 'mdi-numeric-1-box-outline',
                value: 'README.md'
              },
              {
                title: 'Ask on forum',
                icon: 'mdi-numeric-2-box-outline',
                value: 'home-assistant.io'
              },
              {
                title: 'Open an issue',
                icon: 'mdi-numeric-3-box-outline',
                value: 'github.com'
              },
            ]
          },
          {
            position: [2, 0],
            width: 2,
            title: 'System Status',
            type: TYPES.TEXT_LIST,
            id: {}, // using empty object for an unknown id
            state: false, // disable state element
            list: [{
              title: 'Free Memory',
              icon: 'mdi-memory',
              value: function() {
                // var freeMemory = this.parseFieldValue('&sensor.memory_free.state')
                var freeMemory = 15.444 // Just an example.
                return this.$scope.filterNumber(freeMemory, 1) + ' GB';
              }
            }, ]
          },
          {
            position: [0, 1.5],
            width: 1.5,
            height: 1.5,
            title: 'My Gauge Title',
            subtitle: '',
            type: TYPES.GAUGE,
            // id: 'sensor.my_sample_sensor', // Assign the sensor you want to display on the gauge
            id: {
              state: 11111
            }, // Remove after choosing to actual sensor ID
            value: function(item, entity) {
              return entity.state;
            },
            settings: {
              size: 200, // Defaults to 50% of either height or width, whichever is smaller
              type: 'full', // Options are: 'full', 'semi', and 'arch'. Defaults to 'full'
              min: 0, // Defaults to 0
              max: 25000, // Defaults to 100
              cap: 'round', // Options are: 'round', 'butt'. Defaults to 'butt'
              thick: 8, // Defaults to 6
              label: 'My Gauge', // Defaults to undefined
              append: '@attributes.unit_of_measurement', // Defaults to undefined
              prepend: '$', // Defaults to undefined
              duration: 1500, // Defaults to 1500ms
              thresholds: {
                0: {
                  color: 'green'
                },
                80: {
                  color: 'red'
                }
              }, // Defaults to undefined
              labelOnly: false, // Defaults to false
              foregroundColor: 'rgba(0, 150, 136, 1)', // Defaults to rgba(0, 150, 136, 1)
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // Defaults to rgba(0, 0, 0, 0.1)
              fractionSize: 0, // Number of decimal places to round the number to. Defaults to current locale formatting
            },
          },
        ]
      }, ]
    }
  ],
}