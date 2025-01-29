export function countupTimer(value: number) {
    const hours = Math.floor((value % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((value % (60 * 60)) / 60);
    const seconds = value % 60;
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
  }
