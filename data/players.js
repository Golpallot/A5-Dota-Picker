// Spieler-Datenbank. Wird im Admin-Bereich gepflegt und von dort als Datei exportiert.
// roles:  Rollen-Rangfolge { Position: Rang } – 1 = Lieblingsrolle, fehlende Position = spielt sie nicht
// pools:  Helden, die jemand gern spielt – self = eigene Bewertung (1-5), team = Bewertung der Mitspieler (1-5, optional)
// tryout: Helden, die jemand mal ausprobieren möchte (pro Position)
// vibecheck: Helden nur mit Ansage
// lineups: Aufstellungen – welche Person spielt in dieser Kombination welche Position
window.DOTA_PLAYERS = {
  "players": [
    {
      "id": "spieler1",
      "name": "A5.MaStr",
      "pools": {
        "1": [
          {
            "hero": 8,
            "self": 5
          },
          {
            "hero": 54,
            "self": 5
          },
          {
            "hero": 32,
            "self": 5
          },
          {
            "hero": 70,
            "self": 5
          },
          {
            "hero": 6,
            "self": 4
          },
          {
            "hero": 53,
            "self": 4
          },
          {
            "hero": 15,
            "self": 4
          },
          {
            "hero": 35,
            "self": 4
          },
          {
            "hero": 95,
            "self": 4
          },
          {
            "hero": 41,
            "self": 3
          },
          {
            "hero": 48,
            "self": 3
          },
          {
            "hero": 138,
            "self": 3
          },
          {
            "hero": 18,
            "self": 3
          },
          {
            "hero": 19,
            "self": 3
          },
          {
            "hero": 21,
            "self": 3
          },
          {
            "hero": 42,
            "self": 3
          },
          {
            "hero": 4,
            "self": 2
          },
          {
            "hero": 72,
            "self": 2
          },
          {
            "hero": 114,
            "self": 2
          },
          {
            "hero": 44,
            "self": 2
          },
          {
            "hero": 93,
            "self": 2
          }
        ],
        "2": [],
        "3": [
          {
            "hero": 135,
            "self": 5
          },
          {
            "hero": 120,
            "self": 5
          },
          {
            "hero": 29,
            "self": 5
          },
          {
            "hero": 2,
            "self": 4
          },
          {
            "hero": 96,
            "self": 4
          },
          {
            "hero": 97,
            "self": 4
          },
          {
            "hero": 15,
            "self": 4
          },
          {
            "hero": 71,
            "self": 4
          },
          {
            "hero": 69,
            "self": 3
          },
          {
            "hero": 7,
            "self": 3
          },
          {
            "hero": 129,
            "self": 3
          },
          {
            "hero": 60,
            "self": 3
          },
          {
            "hero": 84,
            "self": 3
          },
          {
            "hero": 137,
            "self": 3
          },
          {
            "hero": 28,
            "self": 3
          },
          {
            "hero": 128,
            "self": 3
          },
          {
            "hero": 99,
            "self": 2
          },
          {
            "hero": 57,
            "self": 2
          },
          {
            "hero": 85,
            "self": 2
          }
        ],
        "4": [
          {
            "hero": 51,
            "self": 5
          },
          {
            "hero": 128,
            "self": 5
          },
          {
            "hero": 21,
            "self": 5
          },
          {
            "hero": 64,
            "self": 4
          },
          {
            "hero": 9,
            "self": 4
          },
          {
            "hero": 85,
            "self": 4
          },
          {
            "hero": 112,
            "self": 4
          },
          {
            "hero": 3,
            "self": 3
          },
          {
            "hero": 7,
            "self": 3
          },
          {
            "hero": 26,
            "self": 3
          },
          {
            "hero": 136,
            "self": 3
          },
          {
            "hero": 88,
            "self": 3
          },
          {
            "hero": 45,
            "self": 3
          },
          {
            "hero": 86,
            "self": 3
          },
          {
            "hero": 155,
            "self": 2
          },
          {
            "hero": 53,
            "self": 2
          },
          {
            "hero": 20,
            "self": 2
          },
          {
            "hero": 22,
            "self": 2
          }
        ],
        "5": [
          {
            "hero": 51,
            "self": 5
          },
          {
            "hero": 87,
            "self": 4
          },
          {
            "hero": 64,
            "self": 4
          },
          {
            "hero": 112,
            "self": 4
          },
          {
            "hero": 3,
            "self": 3
          },
          {
            "hero": 31,
            "self": 3
          },
          {
            "hero": 26,
            "self": 3
          },
          {
            "hero": 85,
            "self": 3
          },
          {
            "hero": 20,
            "self": 3
          },
          {
            "hero": 30,
            "self": 3
          }
        ]
      },
      "tryout": {
        "1": [
          1,
          145,
          20
        ],
        "3": [
          49,
          39,
          47,
          155,
          14
        ],
        "4": [
          90,
          136,
          62,
          121,
          86
        ],
        "5": [
          27,
          83
        ]
      },
      "vibecheck": [
        {
          "hero": 55,
          "note": "Nur wenn der Helm nicht mehr Meta ist."
        },
        {
          "hero": 104,
          "note": "Tu es nicht Max."
        },
        {
          "hero": 63,
          "note": "Macht Spaß, passt aber null zu meinem Spielstil."
        }
      ],
      "roles": {
        "1": 2,
        "3": 1,
        "4": 3,
        "5": 4
      }
    },
    {
      "id": "spieler2",
      "name": "A5.Kashrakh",
      "pools": {
        "1": [
          {
            "hero": 94,
            "self": 4
          },
          {
            "hero": 54,
            "self": 3
          },
          {
            "hero": 44,
            "self": 3
          },
          {
            "hero": 8,
            "self": 2
          },
          {
            "hero": 12,
            "self": 2
          }
        ],
        "2": [
          {
            "hero": 47,
            "self": 3
          },
          {
            "hero": 57,
            "self": 2
          },
          {
            "hero": 35,
            "self": 2
          },
          {
            "hero": 75,
            "self": 1
          }
        ],
        "3": [
          {
            "hero": 104,
            "self": 5
          },
          {
            "hero": 29,
            "self": 4
          },
          {
            "hero": 2,
            "self": 3
          },
          {
            "hero": 84,
            "self": 3
          },
          {
            "hero": 135,
            "self": 2
          },
          {
            "hero": 36,
            "self": 2
          },
          {
            "hero": 57,
            "self": 2
          },
          {
            "hero": 47,
            "self": 1
          }
        ],
        "4": [
          {
            "hero": 75,
            "self": 5
          },
          {
            "hero": 31,
            "self": 4
          },
          {
            "hero": 26,
            "self": 3
          },
          {
            "hero": 27,
            "self": 3
          },
          {
            "hero": 64,
            "self": 2
          },
          {
            "hero": 71,
            "self": 2
          },
          {
            "hero": 85,
            "self": 1
          }
        ],
        "5": [
          {
            "hero": 75,
            "self": 5
          },
          {
            "hero": 31,
            "self": 4
          },
          {
            "hero": 50,
            "self": 3
          },
          {
            "hero": 64,
            "self": 3
          },
          {
            "hero": 26,
            "self": 3
          },
          {
            "hero": 37,
            "self": 1
          }
        ]
      },
      "tryout": {
        "1": [
          6
        ],
        "4": [
          123,
          53
        ],
        "5": [
          112,
          131,
          121
        ]
      },
      "vibecheck": [
        {
          "hero": 71,
          "note": "Nur nach Vibecheck."
        },
        {
          "hero": 84,
          "note": "So schlimm ist der Ogre gar nicht, es könnte auch der Bara sein."
        },
        {
          "hero": 121,
          "note": "Nur, wenn es entsprechende Kombis gibt (also kein First Pick)."
        },
        {
          "hero": 131,
          "note": "Als Counter zu Necro, LC, Juggernaut."
        }
      ],
      "roles": {
        "1": 3,
        "2": 5,
        "3": 1,
        "4": 2,
        "5": 4
      }
    },
    {
      "id": "spieler3",
      "name": "A5.VaniC",
      "pools": {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
      },
      "tryout": {},
      "vibecheck": [],
      "roles": {}
    },
    {
      "id": "spieler4",
      "name": "A5.snackerino",
      "pools": {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
      },
      "tryout": {},
      "vibecheck": [
        {
          "hero": 28,
          "note": "Henning muss los."
        }
      ],
      "roles": {}
    },
    {
      "id": "spieler5",
      "name": "A5.AlAchami",
      "pools": {
        "1": [],
        "2": [
          {
            "hero": 36,
            "self": 3
          },
          {
            "hero": 43,
            "self": 2
          },
          {
            "hero": 25,
            "self": 2
          },
          {
            "hero": 128,
            "self": 2
          },
          {
            "hero": 47,
            "self": 2
          },
          {
            "hero": 22,
            "self": 2
          }
        ],
        "3": [
          {
            "hero": 42,
            "self": 3
          },
          {
            "hero": 2,
            "self": 2
          },
          {
            "hero": 29,
            "self": 1
          }
        ],
        "4": [
          {
            "hero": 26,
            "self": 2
          },
          {
            "hero": 27,
            "self": 2
          },
          {
            "hero": 75,
            "self": 2
          },
          {
            "hero": 62,
            "self": 1
          },
          {
            "hero": 9,
            "self": 1
          }
        ],
        "5": [
          {
            "hero": 40,
            "self": 5
          },
          {
            "hero": 5,
            "self": 4
          },
          {
            "hero": 31,
            "self": 4
          },
          {
            "hero": 26,
            "self": 3
          },
          {
            "hero": 27,
            "self": 3
          },
          {
            "hero": 83,
            "self": 3
          },
          {
            "hero": 20,
            "self": 3
          },
          {
            "hero": 30,
            "self": 3
          },
          {
            "hero": 64,
            "self": 2
          },
          {
            "hero": 25,
            "self": 2
          },
          {
            "hero": 128,
            "self": 2
          },
          {
            "hero": 112,
            "self": 2
          }
        ]
      },
      "tryout": {
        "2": [
          110
        ]
      },
      "vibecheck": [],
      "roles": {
        "2": 3,
        "3": 4,
        "4": 2,
        "5": 1
      }
    },
    {
      "id": "spieler6",
      "name": "Zucchinizocker",
      "pools": {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
      },
      "tryout": {},
      "vibecheck": [],
      "roles": {}
    },
    {
      "id": "spieler7",
      "name": "kl3inhirn",
      "pools": {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
      },
      "tryout": {},
      "vibecheck": [],
      "roles": {}
    },
    {
      "id": "spieler8",
      "name": "A5.BizepsBärchen",
      "pools": {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
      },
      "tryout": {},
      "vibecheck": [],
      "roles": {}
    },
    {
      "id": "spieler9",
      "name": "Biebs",
      "pools": {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
      },
      "tryout": {},
      "vibecheck": [],
      "roles": {}
    },
    {
      "id": "spieler10",
      "name": "ClassicCoreExp",
      "pools": {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": []
      },
      "tryout": {},
      "vibecheck": [],
      "roles": {}
    }
  ],
  "lineups": [
    {
      "id": "l1",
      "note": "Standard zu dritt",
      "assign": {
        "1": "spieler2",
        "2": null,
        "3": "spieler1",
        "4": null,
        "5": "spieler3"
      }
    },
    {
      "id": "l2",
      "note": "Wenn Spieler 1 Support will",
      "assign": {
        "1": "spieler2",
        "2": null,
        "3": null,
        "4": "spieler1",
        "5": "spieler3"
      }
    },
    {
      "id": "l3",
      "note": "",
      "assign": {
        "1": "spieler2",
        "2": null,
        "3": "spieler1",
        "4": null,
        "5": null
      }
    }
  ]
};
