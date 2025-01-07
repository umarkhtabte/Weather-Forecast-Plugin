jQuery(document).ready(function ($) {
    let timer;

    // Limit date range to 5 days
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date(new Date().setDate(new Date().getDate() + 5))
        .toISOString()
        .split('T')[0];

    $('#date-picker-start, #date-picker-end').attr('min', today).attr('max', maxDate);

    // Show message on first load
    $('#weather-cards').html('<div class="error-message">Please enter a city to fetch weather data.</div>');

    // Fetch weather data when city or date changes
    $('#city-search, #date-picker-start, #date-picker-end').on('input', function () {
        fetchWeatherData();
    });

    // Clear filters when "Clear Filters" button is clicked
    $('#clear-filters').on('click', function () {
        $('#city-search').val('');
        $('#date-picker-start').val('');
        $('#date-picker-end').val('');
        fetchWeatherData();
    });

    function fetchWeatherData() {
        clearTimeout(timer);

        const city = $('#city-search').val();
        const startDate = $('#date-picker-start').val();
        const endDate = $('#date-picker-end').val();

        timer = setTimeout(() => {
            if (!city) {
                $('#weather-cards').html('<div class="error-message">Please enter a city to fetch weather data.</div>');
                return;
            }

            $('#weather-cards').html('<div class="loading-spinner"><i class="fa fa-spinner fa-spin"></i></div>');

            $.ajax({
                url: iw_ajax.url,
                type: 'POST',
                data: {
                    action: 'fetch_weather',
                    city,
                    startDate,
                    endDate,
                },
                success: function (response) {
                    $('#weather-cards').empty();

                    const filteredData = response.list.filter(item => {
                        const itemDate = item.dt_txt.split(' ')[0];
                        return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
                    });

                    if (filteredData.length === 0) {
                        $('#weather-cards').html('<div class="no-data-message">No weather data available for the selected range.</div>');
                        return;
                    }

                    filteredData.forEach((item, index) => {
                        if (index % 8 === 0) { // Display one card per day
                            const { backgroundColor, textClass, boxShadow, borderRadius } = getBackgroundColor(item.weather[0].main);
                    
                            const weatherCard = `
                                <div class="weather-card" style="background: ${backgroundColor}; box-shadow: ${boxShadow}; border-radius: ${borderRadius};">
                                    <div class="day ${textClass}">${new Date(item.dt_txt).toLocaleString('en-us', { weekday: 'long' })}</div>
                                    <div class="date ${textClass}">${new Date(item.dt_txt).toLocaleDateString()}</div>
                                    <div class="temperature ${textClass}">${item.main.temp}°C</div>
                                    <div class="status ${textClass}">${item.weather[0].description}</div>
                                    <div class="details ${textClass}">
                                        <span>🌬️ <strong>Wind:</strong> ${item.wind.speed} m/s</span>
                                        <span>☔ <strong>Rain:</strong> ${item.pop * 100}%</span>
                                    </div>
                                </div>`;
                    
                            $('#weather-cards').append(weatherCard);
                        }
                    });
                },
            });
        }, 300);
    }

    // Get dynamic background colors based on weather type
    function getBackgroundColor(weather) {
        let backgroundColor = '';
        let textClass = 'text-light';

        // Modern glossy design with rich gradients
        switch (weather) {
            case 'Clear':
                backgroundColor = 'linear-gradient(180deg, #ffbb33, #ffcc00)'; 
                textClass = 'text-dark';
                break;
            case 'Rain':
                backgroundColor = 'linear-gradient(180deg, #127ad1, #b5d2ef)'; 
                break;
            case 'Clouds':
                backgroundColor = 'linear-gradient(180deg, #93b2c1, #e9efef)'; 
                textClass = 'text-dark';
                break;
            case 'Snow':
                backgroundColor = 'linear-gradient(180deg, #89b8e0, #a2c2e7)'; 
                textClass = 'text-dark';
                break;
            default:
                backgroundColor = 'linear-gradient(180deg, #4f9fd3, #74b9f1)'; 
        }

        const boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
        const borderRadius = '12px';

        return {
            backgroundColor: backgroundColor,
            textClass: textClass,
            boxShadow: boxShadow,
            borderRadius: borderRadius
        };
    }

});
