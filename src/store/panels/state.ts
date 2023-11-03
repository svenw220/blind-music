export interface PanelStateInterface {
  showHelp: boolean;
  showConnectionTroubleShooting: boolean;
  showSliderHelp: boolean;
}

function state(): PanelStateInterface {
  return {
    showHelp: false,
    showConnectionTroubleShooting: false,
    showSliderHelp: false,
  };
}

export default state;
