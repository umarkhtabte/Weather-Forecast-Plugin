<?php
/*
Plugin Name: Interactive Weather Dashboard
Description: Displays a 5-day weather forecast with dynamic styling and filtering. Add this shortcode "[interactive_weather]".
Version: 1.0
Author: Umar Khtab
Author URL: https://umarkhtab.wuaze.com/
*/

// Define constants
define('IW_PLUGIN_DIR', plugin_dir_path(__FILE__));

// Include core files
require_once IW_PLUGIN_DIR . 'includes/class-weather-api.php';
require_once IW_PLUGIN_DIR . 'includes/class-weather-shortcode.php';

// Initialize shortcodes
add_action('init', ['WeatherShortcode', 'init']);

// Clear all cache on deactivation
register_deactivation_hook(__FILE__, 'IW_plugin_clear_transients');

function IW_plugin_clear_transients() {
    wp_cache_flush();
}

