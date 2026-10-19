/* eslint-disable */
// GENERATED — do not edit. Source: the app repo's supabase/functions/_shared/planCatalog.ts,
// written by its scripts/web/website-catalog.mjs. After any price change there, re-run that script
// and commit this file. The app's __tests__/websiteCatalogParity.test.ts fails while they differ.
// Every figure is final (exact store prices; per-month lines and savings already rounded down).
export const CATALOG_SHA = '575c356ccfa539e5';

/* BEGIN CATALOG */
export const CATALOG = {
  "currencies": [
    "USD",
    "INR",
    "EUR",
    "GBP"
  ],
  "maxCircles": 3,
  "freeCircles": 2,
  "eventCircleMembers": 15,
  "storeTrial": {
    "tier": "platinum",
    "circles": 1,
    "period": "annual",
    "days": 7
  },
  "freeWeek": {
    "tier": "platinum",
    "days": 7,
    "memberCap": 5
  },
  "extraCirclePrice": {
    "monthly": {
      "USD": 4,
      "INR": 150,
      "EUR": 3,
      "GBP": 3
    },
    "annual": {
      "USD": 48,
      "INR": 1800,
      "EUR": 36,
      "GBP": 36
    }
  },
  "prices": {
    "gold": {
      "1": {
        "monthly": {
          "USD": 9.99,
          "INR": 299,
          "EUR": 5.99,
          "GBP": 6.99
        },
        "annual": {
          "USD": 95.99,
          "INR": 2999,
          "EUR": 59.99,
          "GBP": 71.99
        },
        "perMonthOfAnnual": {
          "USD": 7.99,
          "INR": 249,
          "EUR": 4.99,
          "GBP": 5.99
        },
        "annualSavingPct": {
          "USD": 19,
          "INR": 16,
          "EUR": 16,
          "GBP": 14
        }
      },
      "2": {
        "monthly": {
          "USD": 13.99,
          "INR": 449,
          "EUR": 8.99,
          "GBP": 9.99
        },
        "annual": {
          "USD": 143.99,
          "INR": 4799,
          "EUR": 95.99,
          "GBP": 107.99
        },
        "perMonthOfAnnual": {
          "USD": 11.99,
          "INR": 399,
          "EUR": 7.99,
          "GBP": 8.99
        },
        "annualSavingPct": {
          "USD": 14,
          "INR": 10,
          "EUR": 11,
          "GBP": 9
        }
      },
      "3": {
        "monthly": {
          "USD": 17.99,
          "INR": 599,
          "EUR": 11.99,
          "GBP": 12.99
        },
        "annual": {
          "USD": 191.99,
          "INR": 6599,
          "EUR": 131.99,
          "GBP": 143.99
        },
        "perMonthOfAnnual": {
          "USD": 15.99,
          "INR": 549,
          "EUR": 10.99,
          "GBP": 11.99
        },
        "annualSavingPct": {
          "USD": 11,
          "INR": 8,
          "EUR": 8,
          "GBP": 7
        }
      }
    },
    "platinum": {
      "1": {
        "monthly": {
          "USD": 14.99,
          "INR": 499,
          "EUR": 8.99,
          "GBP": 8.99
        },
        "annual": {
          "USD": 143.99,
          "INR": 4799,
          "EUR": 83.99,
          "GBP": 83.99
        },
        "perMonthOfAnnual": {
          "USD": 11.99,
          "INR": 399,
          "EUR": 6.99,
          "GBP": 6.99
        },
        "annualSavingPct": {
          "USD": 19,
          "INR": 19,
          "EUR": 22,
          "GBP": 22
        }
      },
      "2": {
        "monthly": {
          "USD": 18.99,
          "INR": 649,
          "EUR": 11.99,
          "GBP": 11.99
        },
        "annual": {
          "USD": 191.99,
          "INR": 6599,
          "EUR": 119.99,
          "GBP": 119.99
        },
        "perMonthOfAnnual": {
          "USD": 15.99,
          "INR": 549,
          "EUR": 9.99,
          "GBP": 9.99
        },
        "annualSavingPct": {
          "USD": 15,
          "INR": 15,
          "EUR": 16,
          "GBP": 16
        }
      },
      "3": {
        "monthly": {
          "USD": 22.99,
          "INR": 799,
          "EUR": 14.99,
          "GBP": 14.99
        },
        "annual": {
          "USD": 239.99,
          "INR": 8399,
          "EUR": 155.99,
          "GBP": 155.99
        },
        "perMonthOfAnnual": {
          "USD": 19.99,
          "INR": 699,
          "EUR": 12.99,
          "GBP": 12.99
        },
        "annualSavingPct": {
          "USD": 13,
          "INR": 12,
          "EUR": 13,
          "GBP": 13
        }
      }
    },
    "infinite": {
      "1": {
        "monthly": {
          "USD": 19.99,
          "INR": 799,
          "EUR": 11.99,
          "GBP": 11.99
        },
        "annual": {
          "USD": 191.99,
          "INR": 7799,
          "EUR": 119.99,
          "GBP": 119.99
        },
        "perMonthOfAnnual": {
          "USD": 15.99,
          "INR": 649,
          "EUR": 9.99,
          "GBP": 9.99
        },
        "annualSavingPct": {
          "USD": 19,
          "INR": 18,
          "EUR": 16,
          "GBP": 16
        }
      },
      "2": {
        "monthly": {
          "USD": 23.99,
          "INR": 949,
          "EUR": 14.99,
          "GBP": 14.99
        },
        "annual": {
          "USD": 239.99,
          "INR": 9599,
          "EUR": 155.99,
          "GBP": 155.99
        },
        "perMonthOfAnnual": {
          "USD": 19.99,
          "INR": 799,
          "EUR": 12.99,
          "GBP": 12.99
        },
        "annualSavingPct": {
          "USD": 16,
          "INR": 15,
          "EUR": 13,
          "GBP": 13
        }
      },
      "3": {
        "monthly": {
          "USD": 27.99,
          "INR": 1099,
          "EUR": 17.99,
          "GBP": 17.99
        },
        "annual": {
          "USD": 299.99,
          "INR": 11399,
          "EUR": 191.99,
          "GBP": 191.99
        },
        "perMonthOfAnnual": {
          "USD": 24.99,
          "INR": 949,
          "EUR": 15.99,
          "GBP": 15.99
        },
        "annualSavingPct": {
          "USD": 10,
          "INR": 13,
          "EUR": 11,
          "GBP": 11
        }
      }
    }
  },
  "zones": {
    "INR": [
      "Asia/Kolkata",
      "Asia/Calcutta"
    ],
    "GBP": [
      "Europe/Belfast",
      "Europe/Guernsey",
      "Europe/Isle_of_Man",
      "Europe/Jersey",
      "Europe/London"
    ],
    "EUR": [
      "Africa/Ceuta",
      "Asia/Famagusta",
      "Asia/Nicosia",
      "Atlantic/Azores",
      "Atlantic/Canary",
      "Atlantic/Madeira",
      "Europe/Amsterdam",
      "Europe/Andorra",
      "Europe/Athens",
      "Europe/Berlin",
      "Europe/Bratislava",
      "Europe/Brussels",
      "Europe/Busingen",
      "Europe/Dublin",
      "Europe/Helsinki",
      "Europe/Lisbon",
      "Europe/Ljubljana",
      "Europe/Luxembourg",
      "Europe/Madrid",
      "Europe/Malta",
      "Europe/Mariehamn",
      "Europe/Monaco",
      "Europe/Nicosia",
      "Europe/Paris",
      "Europe/Podgorica",
      "Europe/Riga",
      "Europe/Rome",
      "Europe/San_Marino",
      "Europe/Sofia",
      "Europe/Tallinn",
      "Europe/Vatican",
      "Europe/Vienna",
      "Europe/Vilnius",
      "Europe/Zagreb"
    ]
  }
} as const;
/* END CATALOG */
