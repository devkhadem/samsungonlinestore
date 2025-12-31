document.addEventListener('DOMContentLoaded', () => {
    const countdown = () => {
        const endDate = new Date();
        // Set target date 7 days from now for demonstration
        endDate.setDate(endDate.getDate() + 7); 
        // Or set a specific date like: new Date('December 25, 2025 00:00:00')

        const timerBoxes = document.querySelectorAll('.countdown-timer .timer-box');
        const daysSpan = timerBoxes[0].querySelector('.timer-value');
        const hoursSpan = timerBoxes[1].querySelector('.timer-value');
        const minutesSpan = timerBoxes[2].querySelector('.timer-value');
        const secondsSpan = timerBoxes[3].querySelector('.timer-value');

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                // Timer is over
                clearInterval(interval);
                document.querySelector('.countdown-timer').innerHTML = '<span class="timer-value">EXPIRED</span>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysSpan.textContent = String(days).padStart(2, '0');
            hoursSpan.textContent = String(hours).padStart(2, '0');
            minutesSpan.textContent = String(minutes).padStart(2, '0');
            secondsSpan.textContent = String(seconds).padStart(2, '0');
        };

        const interval = setInterval(updateTimer, 1000);
        updateTimer(); // Initial call to display immediately
    };

    countdown();
});