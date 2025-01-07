<?php
// iniliaze WeatherAPI Class
class WeatherAPI {
    private static $api_url = 'https://api.openweathermap.org/data/2.5/forecast';
    private static $api_key = 'Your API KEY Here'; 

    public static function get_weather($city) {
        $cache_key = 'weather_' . sanitize_title($city);
        $cached_data = get_transient($cache_key);

        if ($cached_data) {
            return $cached_data;
        }

        // API Request for Weather Report
        $response = wp_remote_get(self::$api_url . "?q=$city&units=metric&appid=" . self::$api_key);

        if (is_wp_error($response)) {
            return null;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);
        
        // Set Transient cache
        set_transient($cache_key, $data, 30 * MINUTE_IN_SECONDS);

        return $data;
    }
}
