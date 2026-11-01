// Spieler-Datenbank. Wird im Admin-Bereich gepflegt und von dort als Datei exportiert.
// roles:  Rollen-Rangfolge { Position: Rang } – 1 = Lieblingsrolle, fehlende Position = spielt sie nicht
// pools:  Helden, die jemand gern spielt – self = eigene Bewertung (1-5), team = Bewertung der Mitspieler (1-5, optional)
// tryout: Helden, die jemand mal ausprobieren möchte (pro Position)
// vibecheck: Helden nur mit Ansage
// lineups: Aufstellungen – welche Person spielt in dieser Kombination welche Position
// conflicts: Lane-Konflikte – diese beiden nicht zusammen auf eine Lane (Pos 1+5 bzw. 3+4)
// plays: eigene Draft-Ideen · hiddenPlays: ausgeblendete Vorlagen aus data/plays.js
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
            "hero": 6,
            "self": 3
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
            "hero": 114,
            "self": 2
          },
          {
            "hero": 44,
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
            "hero": 128,
            "self": 3
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
            "hero": 138,
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
          {
            "hero": 145
          },
          {
            "hero": 20
          },
          {
            "hero": 93
          }
        ],
        "3": [
          {
            "hero": 49
          },
          {
            "hero": 39
          },
          {
            "hero": 47
          },
          {
            "hero": 155
          },
          {
            "hero": 14
          }
        ],
        "4": [
          {
            "hero": 90
          },
          {
            "hero": 136
          },
          {
            "hero": 62
          },
          {
            "hero": 121
          },
          {
            "hero": 86
          }
        ],
        "5": [
          {
            "hero": 27
          },
          {
            "hero": 83
          }
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
        },
        {
          "hero": 32,
          "note": "Nur nach Vibecheck bei EriC"
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
          {
            "hero": 6
          }
        ],
        "4": [
          {
            "hero": 123
          },
          {
            "hero": 53
          }
        ],
        "5": [
          {
            "hero": 112
          },
          {
            "hero": 131
          },
          {
            "hero": 121
          }
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
        },
        {
          "hero": 6,
          "note": "Nur nach Vibecheck bei EriC"
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
        "1": [
          {
            "hero": 6,
            "self": 3
          },
          {
            "hero": 8,
            "self": 3
          },
          {
            "hero": 44,
            "self": 2
          }
        ],
        "2": [],
        "3": [
          {
            "hero": 29,
            "self": 3
          },
          {
            "hero": 47,
            "self": 3
          },
          {
            "hero": 2,
            "self": 2
          }
        ],
        "4": [
          {
            "hero": 31,
            "self": 5
          },
          {
            "hero": 75,
            "self": 5
          },
          {
            "hero": 30,
            "self": 5
          },
          {
            "hero": 64,
            "self": 4
          },
          {
            "hero": 84,
            "self": 4
          },
          {
            "hero": 35,
            "self": 4
          },
          {
            "hero": 128,
            "self": 3
          },
          {
            "hero": 110,
            "self": 2
          },
          {
            "hero": 5,
            "self": 1
          }
        ],
        "5": [
          {
            "hero": 31,
            "self": 5
          },
          {
            "hero": 75,
            "self": 5
          },
          {
            "hero": 30,
            "self": 5
          },
          {
            "hero": 5,
            "self": 4
          },
          {
            "hero": 64,
            "self": 4
          },
          {
            "hero": 84,
            "self": 4
          },
          {
            "hero": 26,
            "self": 3
          },
          {
            "hero": 68,
            "self": 2
          },
          {
            "hero": 87,
            "self": 2
          },
          {
            "hero": 101,
            "self": 2
          },
          {
            "hero": 112,
            "self": 2
          }
        ]
      },
      "tryout": {},
      "vibecheck": [
        {
          "hero": 35,
          "note": "Nur nach Vibecheck."
        },
        {
          "hero": 110,
          "note": "Nur nach Vibecheck."
        }
      ],
      "roles": {
        "1": 3,
        "3": 4,
        "4": 1,
        "5": 2
      }
    },
    {
      "id": "spieler4",
      "name": "A5.snackerino",
      "pools": {
        "1": [
          {
            "hero": 46,
            "self": 5
          },
          {
            "hero": 81,
            "self": 4
          },
          {
            "hero": 94,
            "self": 4
          },
          {
            "hero": 109,
            "self": 4
          },
          {
            "hero": 95,
            "self": 4
          },
          {
            "hero": 70,
            "self": 4
          },
          {
            "hero": 8,
            "self": 3
          },
          {
            "hero": 54,
            "self": 3
          },
          {
            "hero": 42,
            "self": 3
          },
          {
            "hero": 12,
            "self": 2
          }
        ],
        "2": [
          {
            "hero": 43,
            "self": 5
          },
          {
            "hero": 36,
            "self": 5
          },
          {
            "hero": 35,
            "self": 5
          },
          {
            "hero": 46,
            "self": 5
          },
          {
            "hero": 22,
            "self": 5
          },
          {
            "hero": 60,
            "self": 4
          },
          {
            "hero": 113,
            "self": 3
          },
          {
            "hero": 106,
            "self": 3
          },
          {
            "hero": 25,
            "self": 3
          }
        ],
        "3": [
          {
            "hero": 43,
            "self": 5
          },
          {
            "hero": 36,
            "self": 5
          },
          {
            "hero": 60,
            "self": 5
          },
          {
            "hero": 99,
            "self": 4
          },
          {
            "hero": 81,
            "self": 4
          },
          {
            "hero": 69,
            "self": 4
          },
          {
            "hero": 42,
            "self": 4
          }
        ],
        "4": [
          {
            "hero": 62,
            "self": 4
          },
          {
            "hero": 51,
            "self": 2
          },
          {
            "hero": 7,
            "self": 1
          }
        ],
        "5": [
          {
            "hero": 3,
            "self": 5
          },
          {
            "hero": 85,
            "self": 4
          },
          {
            "hero": 83,
            "self": 3
          },
          {
            "hero": 75,
            "self": 2
          }
        ]
      },
      "tryout": {},
      "vibecheck": [
        {
          "hero": 28,
          "note": "Henning muss los."
        },
        {
          "hero": 62,
          "note": "Nur nach Vibecheck."
        },
        {
          "hero": 35,
          "note": "Greedy Greedy"
        },
        {
          "hero": 46,
          "note": "Greedy Greedy"
        },
        {
          "hero": 25,
          "note": "Nur nach Vibecheck bei EriC"
        }
      ],
      "roles": {
        "1": 3,
        "2": 1,
        "3": 2,
        "4": 5,
        "5": 4
      }
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
          {
            "hero": 110
          }
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
        "3": [
          {
            "hero": 110,
            "self": 3
          },
          {
            "hero": 137,
            "self": 3
          },
          {
            "hero": 71,
            "self": 2
          },
          {
            "hero": 99,
            "self": 1
          }
        ],
        "4": [
          {
            "hero": 45,
            "self": 5
          },
          {
            "hero": 131,
            "self": 5
          },
          {
            "hero": 105,
            "self": 5
          },
          {
            "hero": 68,
            "self": 4
          },
          {
            "hero": 31,
            "self": 4
          },
          {
            "hero": 37,
            "self": 4
          },
          {
            "hero": 121,
            "self": 3
          },
          {
            "hero": 110,
            "self": 3
          },
          {
            "hero": 86,
            "self": 2
          },
          {
            "hero": 112,
            "self": 2
          }
        ],
        "5": [
          {
            "hero": 45,
            "self": 5
          },
          {
            "hero": 131,
            "self": 5
          },
          {
            "hero": 105,
            "self": 5
          },
          {
            "hero": 30,
            "self": 5
          },
          {
            "hero": 87,
            "self": 4
          },
          {
            "hero": 111,
            "self": 4
          },
          {
            "hero": 27,
            "self": 4
          },
          {
            "hero": 26,
            "self": 3
          },
          {
            "hero": 40,
            "self": 3
          }
        ]
      },
      "tryout": {},
      "vibecheck": [],
      "roles": {
        "3": 3,
        "4": 1,
        "5": 2
      }
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
        "1": [
          {
            "hero": 48,
            "self": 4
          },
          {
            "hero": 6,
            "self": 3
          },
          {
            "hero": 8,
            "self": 3
          },
          {
            "hero": 89,
            "self": 3
          },
          {
            "hero": 1,
            "self": 2
          },
          {
            "hero": 44,
            "self": 2
          }
        ],
        "2": [
          {
            "hero": 35,
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
            "hero": 78,
            "self": 5
          },
          {
            "hero": 135,
            "self": 4
          },
          {
            "hero": 108,
            "self": 3
          },
          {
            "hero": 84,
            "self": 2
          },
          {
            "hero": 29,
            "self": 2
          },
          {
            "hero": 20,
            "self": 2
          }
        ],
        "4": [
          {
            "hero": 123,
            "self": 4
          },
          {
            "hero": 128,
            "self": 4
          },
          {
            "hero": 64,
            "self": 3
          },
          {
            "hero": 84,
            "self": 3
          },
          {
            "hero": 40,
            "self": 3
          }
        ],
        "5": [
          {
            "hero": 5,
            "self": 3
          },
          {
            "hero": 26,
            "self": 2
          },
          {
            "hero": 27,
            "self": 2
          },
          {
            "hero": 40,
            "self": 2
          },
          {
            "hero": 30,
            "self": 2
          }
        ]
      },
      "tryout": {
        "3": [
          {
            "hero": 120
          }
        ]
      },
      "vibecheck": [
        {
          "hero": 2,
          "note": "Du feedest, wenn Du hinten bist. "
        },
        {
          "hero": 96,
          "note": "Du feedest, wenn Du hinten bist. "
        },
        {
          "hero": 105,
          "note": "Du hast da Bock drauf, aber deine 'Freunde' auch?"
        },
        {
          "hero": 53,
          "note": "Nur nach Vibecheck bei EriC"
        }
      ],
      "roles": {
        "1": 2,
        "2": 4,
        "3": 1,
        "4": 3
      }
    },
    {
      "id": "spieler9",
      "name": "Biebs",
      "pools": {
        "1": [
          {
            "hero": 44,
            "self": 4
          },
          {
            "hero": 8,
            "self": 3
          },
          {
            "hero": 54,
            "self": 3
          },
          {
            "hero": 138,
            "self": 3
          },
          {
            "hero": 70,
            "self": 3
          },
          {
            "hero": 6,
            "self": 2
          }
        ],
        "2": [
          {
            "hero": 73,
            "self": 3
          },
          {
            "hero": 25,
            "self": 2
          }
        ],
        "3": [
          {
            "hero": 2,
            "self": 4
          },
          {
            "hero": 104,
            "self": 4
          },
          {
            "hero": 96,
            "self": 3
          },
          {
            "hero": 28,
            "self": 3
          },
          {
            "hero": 34,
            "self": 2
          }
        ],
        "4": [],
        "5": []
      },
      "tryout": {},
      "vibecheck": [],
      "roles": {
        "1": 1,
        "2": 3,
        "3": 2,
        "4": 5,
        "5": 4
      }
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
    },
    {
      "id": "l1791041336520",
      "note": "Beste Kombination",
      "assign": {
        "1": "spieler2",
        "2": "spieler4",
        "3": "spieler1",
        "4": "spieler3",
        "5": "spieler5"
      }
    },
    {
      "id": "l1791041376860",
      "note": "High Rank Order",
      "assign": {
        "1": "spieler1",
        "2": "spieler5",
        "3": "spieler4",
        "4": "spieler2",
        "5": "spieler3"
      }
    }
  ],
  "conflicts": [
    {
      "a": "spieler1",
      "b": "spieler4",
      "note": "Zu hohes MMR, müssen eigentlich beide Core spielen"
    },
    {
      "a": "spieler1",
      "b": "spieler5",
      "note": "Spielstile synergieren nicht, Lane frustriert unnötig."
    }
  ],
  "plays": [],
  "hiddenPlays": []
};
