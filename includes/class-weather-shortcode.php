<?php
class WeatherShortcode {
    public static function init() {
        add_shortcode('interactive_weather', [self::class, 'render_weather']);
        add_action('wp_enqueue_scripts', [self::class, 'enqueue_assets']);
        add_action('wp_ajax_fetch_weather', [self::class, 'fetch_weather']);
        add_action('wp_ajax_nopriv_fetch_weather', [self::class, 'fetch_weather']);
    }

    public static function render_weather() {
        ob_start(); ?>
      <div id="weather-section">
            <h2 class="weather-heading">Weather Forecast</h2>
            <div class="weather-description">Select a city and date range to see the weather forecast.</div>

            <!-- Filter Bar (Search City and Date Picker) -->
            <div class="filter-bar">
                <div class="filter-item">
                    <label for="city-search">City</label>
                    <input id="city-search" type="text" placeholder="Enter City">
                </div>
                <div class="filter-item">
                    <label for="date-picker-start">Start Date</label>
                    <input id="date-picker-start" type="date" placeholder="Start Date">
                </div>
                <div class="filter-item">
                    <label for="date-picker-end">End Date</label>
                    <input id="date-picker-end" type="date">
                </div>
                
            </div>
            <button id="clear-filters" class="clear-filter-button">Clear Filters</button>
            <!-- Weather Cards Grid -->
            <div id="weather-cards" class="weather-grid"></div>
        </div>


        <?php
        return ob_get_clean();
    }
    
    
    public static function enqueue_assets() {
        wp_enqueue_style('iw-style', plugins_url('../assets/css/style.css', __FILE__));
        wp_enqueue_script('iw-script', plugins_url('../assets/js/script.js', __FILE__), ['jquery'], null, true);
        wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css', array(), '6.0.0', 'all');
        wp_localize_script('iw-script', 'iw_ajax', [
            'url' => admin_url('admin-ajax.php'),
        ]);
    }

    public static function fetch_weather() {
        $city = sanitize_text_field($_POST['city']);
        $weather_data = WeatherAPI::get_weather($city);
        wp_send_json($weather_data);
    }
}
