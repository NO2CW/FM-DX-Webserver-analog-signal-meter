(function() {
    function initAnalogMeter() {
        document.addEventListener('DOMContentLoaded', function() {
            const panels = Array.from(document.querySelectorAll('.panel-33'));
            const container = panels.find(panel => panel.querySelector('h2') && panel.querySelector('h2').textContent.includes('SIGNAL'));

            if (!container) {
                console.error('Signal panel container not found');
                return;
            }

            // Adjust heading and following container margins and padding to reduce vertical space
            const signalHeading = container.querySelector('.signal-heading');
            if (signalHeading) {
                signalHeading.style.marginBottom = '5px'; // Reduces the space below the heading
            }

            const signalDataContainer = container.querySelector('.text-big');
            if (signalDataContainer) {
                signalDataContainer.style.marginTop = '0px'; // Reduces the space above the signal data
            }

            // Hide the highest signal container
            const highestSignalContainer = document.querySelector('.highest-signal-container');
            if (highestSignalContainer) {
                highestSignalContainer.style.display = 'none';
            }

            // Adjust the class for smaller text size on the signal number, decimal, and units
            const dataSignal = document.getElementById('data-signal');
            const dataSignalDecimal = document.getElementById('data-signal-decimal');
            const signalUnits = document.querySelectorAll('.signal-units');
            if (dataSignal) {
                dataSignal.className = 'text-medium';
            }
            if (dataSignalDecimal) {
                dataSignalDecimal.className = 'text-medium';
            }
            signalUnits.forEach(function(unit) {
                unit.className = 'text-medium';
            });

            const signalMeter = document.createElement('canvas');
            signalMeter.id = 'signal-meter-canvas';
            signalMeter.style.width = '200px';
            signalMeter.style.height = '100px';
            signalMeter.style.border = '1px solid #000';
            container.appendChild(signalMeter);

            const ctx = signalMeter.getContext('2d');
            signalMeter.width = 200;
            signalMeter.height = 100;

            const backgroundImage = new Image();
            backgroundImage.src = 'images3/signal-meter-background.png'; // Ensure path is correct
            backgroundImage.onload = function() {
                ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height);
            };

            setInterval(function() {
                const signalStrengthText = document.getElementById('data-signal') ? document.getElementById('data-signal').textContent : '0';
                const signalStrength = parseFloat(signalStrengthText);
                
                if (!isNaN(signalStrength)) {
                    drawSignalMeter(signalStrength, ctx, backgroundImage, signalMeter);
                }
            }, 1000);
        });
    }

    function drawSignalMeter(signalValue, ctx, backgroundImage, signalMeter) {
        // Clear the canvas before redrawing
        ctx.clearRect(0, 0, signalMeter.width, signalMeter.height);

        // Redraw the background image
        ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height);

        // Calculate the needle position
        const normalizedStrength = ((signalValue - 5) / (90 - 5)) * 100;
        const needlePosition = normalizedStrength * (signalMeter.width / 100);

        // Draw the needle
        ctx.beginPath();
        ctx.moveTo(signalMeter.width / 2, signalMeter.height);
        ctx.lineTo(needlePosition, signalMeter.height / 2);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.stroke();
    }

    initAnalogMeter();
})();
