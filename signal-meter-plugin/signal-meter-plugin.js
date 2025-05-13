(function() {
    // Wait a moment for the page to fully render
    setTimeout(initAnalogMeter, 1000);
    
    function initAnalogMeter() {
        console.log("Analog meter plugin initializing...");
        
        // Find the signal panel by looking for the heading text
        const signalPanels = document.querySelectorAll('.panel-33');
        let signalPanel = null;
        
        for (let panel of signalPanels) {
            const heading = panel.querySelector('h2');
            if (heading && heading.textContent.trim() === 'SIGNAL') {
                signalPanel = panel;
                break;
            }
        }
        
        if (!signalPanel) {
            console.error('Signal panel not found');
            // Try again in a second
            setTimeout(initAnalogMeter, 1000);
            return;
        }
        
        console.log("Signal panel found:", signalPanel);
        
        // Save references to the signal elements before clearing
        const signalHeading = signalPanel.querySelector('h2');
        const signalValue = signalPanel.querySelector('#data-signal');
        const signalDecimal = signalPanel.querySelector('#data-signal-decimal');
        const signalUnit = signalPanel.querySelector('.signal-units');
        
        // Store the original content
        const originalContent = signalPanel.innerHTML;
        
        // Clear the panel's contents
        signalPanel.innerHTML = '';
        
        // Create a canvas that fills the entire panel
        const signalMeter = document.createElement('canvas');
        signalMeter.id = 'signal-meter-canvas';
        signalMeter.style.width = '100%';
        signalMeter.style.height = '100%';
        signalMeter.style.display = 'block';
        signalPanel.appendChild(signalMeter);
        
        // Set canvas dimensions
        const ctx = signalMeter.getContext('2d');
        signalMeter.width = signalPanel.offsetWidth;
        signalMeter.height = signalPanel.offsetHeight;
        
        console.log("Canvas dimensions:", signalMeter.width, "x", signalMeter.height);
        
        // Load the background image
        const backgroundImage = new Image();
        backgroundImage.src = 'images3/signal-meter-background.png'; // Relative path
        
        console.log("Loading background image from:", backgroundImage.src);
        
        backgroundImage.onload = function() {
            console.log("Background image loaded successfully");
            
            // Create hidden elements to store the signal value
            const hiddenSignal = document.createElement('span');
            hiddenSignal.id = 'data-signal';
            hiddenSignal.style.display = 'none';
            if (signalValue) hiddenSignal.textContent = signalValue.textContent;
            signalPanel.appendChild(hiddenSignal);
            
            const hiddenDecimal = document.createElement('span');
            hiddenDecimal.id = 'data-signal-decimal';
            hiddenDecimal.style.display = 'none';
            if (signalDecimal) hiddenDecimal.textContent = signalDecimal.textContent;
            signalPanel.appendChild(hiddenDecimal);
            
            // Create a hidden element for the signal unit
            const hiddenUnit = document.createElement('span');
            hiddenUnit.className = 'signal-units';
            hiddenUnit.style.display = 'none';
            if (signalUnit) hiddenUnit.textContent = signalUnit.textContent;
            signalPanel.appendChild(hiddenUnit);
            
            // Start updating the meter
            updateMeter();
        };
        
        backgroundImage.onerror = function() {
            console.error("Failed to load background image:", backgroundImage.src);
            // Try with absolute path
            backgroundImage.src = '/images3/signal-meter-background.png';
            
            backgroundImage.onerror = function() {
                console.error("Failed to load background image with absolute path");
                // Restore original content if image fails to load
                signalPanel.innerHTML = originalContent;
            };
        };
        
        function updateMeter() {
            // Get current signal value
            const signalElement = document.getElementById('data-signal');
            const decimalElement = document.getElementById('data-signal-decimal');
            
            if (!signalElement) {
                requestAnimationFrame(updateMeter);
                return;
            }
            
            const signalValue = parseFloat(signalElement.textContent || '0');
            const decimalValue = parseFloat((decimalElement?.textContent || '.0').replace(/[^\d.-]/g, ''));
            const fullValue = signalValue + (isNaN(decimalValue) ? 0 : decimalValue);
            
            // Draw the meter
            drawSignalMeter(fullValue, ctx, backgroundImage, signalMeter);
            
            // Schedule next update
            requestAnimationFrame(updateMeter);
        }
        
        // Handle window resize
        window.addEventListener('resize', function() {
            signalMeter.width = signalPanel.offsetWidth;
            signalMeter.height = signalPanel.offsetHeight;
            
            const signalElement = document.getElementById('data-signal');
            if (signalElement) {
                const signalValue = parseFloat(signalElement.textContent || '0');
                const decimalElement = document.getElementById('data-signal-decimal');
                const decimalValue = parseFloat((decimalElement?.textContent || '.0').replace(/[^\d.-]/g, ''));
                const fullValue = signalValue + (isNaN(decimalValue) ? 0 : decimalValue);
                drawSignalMeter(fullValue, ctx, backgroundImage, signalMeter);
            }
        });
    }

    function drawSignalMeter(signalValue, ctx, backgroundImage, signalMeter) {
        // Clear the canvas
        ctx.clearRect(0, 0, signalMeter.width, signalMeter.height);
        
        // Draw the background image
        ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height);
        
        // Map signal value to needle position (adjust these values based on your meter scale)
        // For FM signals, typical values might be 0-100 dBf
        const minSignal = 0;
        const maxSignal = 100;
        const normalizedValue = Math.min(100, Math.max(0, 
            ((signalValue - minSignal) / (maxSignal - minSignal)) * 100));
        
        // Calculate needle angle (in radians)
        // Assuming the meter goes from -60 degrees to +60 degrees
        const minAngle = -Math.PI / 3; // -60 degrees
        const maxAngle = Math.PI / 3;  // +60 degrees
        const needleAngle = minAngle + (normalizedValue / 100) * (maxAngle - minAngle);
        
        // Calculate needle dimensions
        const centerX = signalMeter.width / 2;
        const centerY = signalMeter.height * 0.75; // Position pivot point near bottom
        const needleLength = Math.min(signalMeter.width, signalMeter.height) * 0.4;
        
        // Calculate needle endpoint
        const endX = centerX + Math.sin(needleAngle) * needleLength;
        const endY = centerY - Math.cos(needleAngle) * needleLength;
        
        // Draw the needle
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#ff0000'; // Red needle
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw the pivot point
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    console.log("Analog meter plugin loaded");
})();
