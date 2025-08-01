export const playBipSound = () => {
  const audio = new Audio("/beep.mp3");
  audio.play();
};
