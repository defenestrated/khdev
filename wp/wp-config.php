<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'katiehenry');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ' Q:HD&dCIGChIkf(q`.Ufr9~qC{::aK$8{@|d}@kQ p~%t6YqfYB= yB|AJ&^x.8');
define('SECURE_AUTH_KEY',  'g][f}QJRK%,i3Hp;~G>UJ=]Iu>-W~E`O0<+kH/y2!,/V$M&&T?X0SJxQ?q-q*27`');
define('LOGGED_IN_KEY',    '*k.W/4l&J| KLK,r,f}yWe_HSMt3j9TUc !++_vO[ &=~b:lq~Yugoj`e2F<8QOe');
define('NONCE_KEY',        '(<v5Fz=!$~5!%klk+vH!m}K5D<FJrEo51U@k*hc,:/3kl7vza5Jbd[FSBNg=t/rv');
define('AUTH_SALT',        'Ts7fx^OvN,B2GfWu@C)A6W1[ L+z>fj8pc$kMKh~UwCnng|jw# ZOMAMT$?nfzMl');
define('SECURE_AUTH_SALT', 'G!(m]7aci8e8IXF+@(&&ja2w.dtbVOq)zuM>}Hy2X%t?{`k#H6]IX#Y~0SX1p^Lf');
define('LOGGED_IN_SALT',   ']>fbPw`Fi=*Hj_BbWLl{0:}N8tGt]_7d;x}uo+GZOUeVYFY`R6IT%B2TS?c8L(Fp');
define('NONCE_SALT',       ':fZZn|$w9x*%y-,FIpO7Y;krw%-G)|;+&+K8Hn>M+btWs.a3>]AI#,R|Q4u>U@x;');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
