
export const startTimer = (timeInMilliseconds: number, onSecond?: (timeInSeconds: number) => void) => {
    const startTime = performance.now();
    const endTime = startTime + timeInMilliseconds;
    let animationFrameId: number;
    let lastSecond = Math.ceil(timeInMilliseconds / 1000);
    if (onSecond) {
        onSecond(lastSecond);
    }

    const updateTimer = () => {
        const now = performance.now();
        const remainingTime = Math.max(0, endTime - now);

        const timeInSeconds = Math.ceil(remainingTime / 1000);

        if (onSecond && timeInSeconds !== lastSecond) {
            lastSecond = timeInSeconds;
            onSecond(timeInSeconds);
        }

        if (remainingTime > 0) {
            animationFrameId = requestAnimationFrame(updateTimer);
        }
    };

    updateTimer();

    return () => cancelAnimationFrame(animationFrameId);
}