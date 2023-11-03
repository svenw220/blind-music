// This is just an example,
// so you can safely delete all default props below

export default {
  cancel: 'cancel',
  save: 'save',
  close: 'close',
  topBar: {
    title: 'THERA-music',
    userSelectionHint: 'Click here to select a user'
  },
  mainScreen: {
    playlist: 'Playlist',
    waitingForDevice: 'Waiting for Connection',
    press: 'Press',
    onTheTigo: 'on the Tigo',
    activityRange: 'Activity Range',
    activity: 'Activity',
    activityExplanation: 'The activity is a combination of RPM and Power. The green area shows you which part of the activity controls the music.'
  },
  musicControl: {
    noTitleSelected: 'no title selected',
    hint: 'Go to the music library on the left',
    loadingSong: 'loading song',
  },
  playlistsPanel: {
    title: 'Playlists',
    jymminExplanation: 'powered by',
    login: 'Login',
    logout: 'Logout'
  },
  userPanel: {
    name: 'name',
    pseudonym: 'pseudonym',
    currentUser: 'current user',
    userSelection: 'user selection',
    addUser: 'add new user',

  },
  helpPanel: {
    title: 'Help Panel',
    moreSupport: 'Get more support',
    rebootBluetooth: 'reboot bluetooth',
    body: {
      questions: [
        {
          q: 'Why is THERA-music not connected to my THERA-Trainer tigo?',
          a: [
            'Ensure, that the Bluetooth of the Tablet is switched on.',
            'Ensure that the program "Group Therapy" is selected on the tigo.',
            'Ensure that you selected THERA-music as a server in the WI-FI settings of the THERA-Trainer tigo',
            'Try to reboot the Bluetooth Connection:',
            'If the steps above didn’t solve your problem: Restart THERA-music or reconnect THERA-music with your tigo'
          ]
        },
        {
          q: 'Why can\'t I hear the sound?',
          a: [
            'Ensure that the mute button is not active (when the button is red, the tablet is on mute)',
            'Ensure that the sound is turned on at your tablet',
            'If the tablet is connected to a music output device (headset, Bluetooth loudspeakers) – ensure that the device is turned on and its battery is full'
          ]
        },
      ]
    }
  },
  sessionFinishedPanel: {
    title: 'Exercise Summary',
    exerciseTime: 'Exercise time',
    averageSpeed: 'Average speed',
    averagePower: 'Average power',
    yourPlaylist: 'Your playlist',
    power: 'Power (W)',
    rpm: 'RPM'
  }
};
