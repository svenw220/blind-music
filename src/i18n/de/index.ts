// This is just an example,
// so you can safely delete all default props below

export default {
  cancel: 'abbrechen',
  save: 'speichern',
  close: 'schließen',
  topBar: {
    title: 'THERA-music',
    userSelectionHint: 'Tippen Sie hier um einen neuen Nutzer auszuwählen'
  },
  mainScreen: {
    playlist: 'Playlist',
    waitingForDevice: 'Warte auf Verbindung',
    press: 'Drücke',
    onTheTigo: 'am Tigo',
    activityRange: 'Aktivitätsskala',
    activity: 'Aktivität',
    activityExplanation: 'Der Aktivitätswert ist eine Kombination von Umdrehung pro minute und der Leistung (Watt). Der grüne Bereich zeigt, welcher Teil der Aktivität zur Kontrolle der Musik verwendet wird.'
  },
  musicControl: {
    noTitleSelected: 'Kein Stück ausgewählt',
    hint: 'Gehe zur Musikbibliothek auf der linken Seite',
    loadingSong: 'Lade Musik',
  },
  playlistsPanel: {
    title: 'Musikauswahl',
    jymminExplanation: 'powered by',
    login: 'Einloggen',
    logout: 'Ausloggen'
  },
  userPanel: {
    name: 'Name',
    pseudonym: 'Pseudonym',
    currentUser: 'Aktueller Spieler',
    userSelection: 'Spielerauswahl',
    addUser: 'Füge neuen Spieler hinzu',

  },
  helpPanel: {
    title: 'Hilfe',
    moreSupport: 'Weitere Hilfe',
    rebootBluetooth: 'Bluetooth Neustarten',
    body: {
      questions: [
        {
          q: 'Warum ist THERA-music nicht mit meinem THERA-Trainer tigo verbunden?',
          a: [
            'Stellen Sie sicher, dass das Bluetooth am Tablet aktiviert ist.',
            'Stellen Sie sicher, dass das Programm "Gruppentherapie" am tigo ausgewählt ist.',
            'Stellen Sie sicher, dass Sie THERA-music als server in den Wireless-Einstellungen des THERA-Trainer tigo ausgewählt haben.',
            'Versuchen Sie die Bluetooth Verbindung neu zu starten:',
            'Wenn die obigen Schritte das Problem nicht gelöst haben: Starten sie THERA-music und/oder ihren tigo neu.'
          ]
        },
        {
          q: 'Warum höre ich keinen Ton?',
          a: [
            'Stellen Sie sicher, dass der Stummschaltknopf nicht aktiv ist (wenn der Knopf rot ist, ist der Ton stummgeschaltet)',
            'Stellen Sie sicher, dass der Ton des Tablets laut gestellt ist (Hardwareknöpfe am oberen Rand des Tablets)',
            'Wenn das Tablet mit einem Lautsprecher oder Kopfhörer verbunden ist – stellen sie sicher, dass das Gerät angeschaltet ist'
          ]
        },
      ]
    }
  },
  sessionFinishedPanel: {
    title: 'Übungszusammenfassung',
    exerciseTime: 'Übungsdauer',
    averageSpeed: 'Durchschnittliche Geschwindigkeit',
    averagePower: 'Durchschnittliche Leistung',
    yourPlaylist: 'Ihre Playlist',
    power: 'Leistung (W)',
    rpm: 'U/min'
  }
};
