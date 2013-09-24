<?php
/* -----------------  custom post types  ------------------- */


add_action( 'init', 'create_post_types' );

function create_post_types() {
	register_post_type( 'play',
		array(
			'labels' => array(
				'name' => __( 'Plays' ),
				'singular_name' => __( 'Play' ),
				'add_new_item' => _x('Add new play', 'play'),
				'edit_item' => _x('Edit play', 'play'),
			),
		'public' => true,
		'hierarchical' => true,
		'has_archive' => true,
		'rewrite' => array('slug' => 'plays'),
		'supports' => array( 'title', 'page-attributes' ),
		'menu_position' => 5
		)
	);
	
	register_post_type( 'press',
		array(
			'labels' => array(
				'name' => __( 'Press' ),
				'singular_name' => __( 'Press Quote' ),
				'add_new_item' => _x('Add new press quote', 'press'),
				'edit_item' => _x('Edit press quote', 'press'),
			),
		'public' => true,
		'hierarchical' => true,
		'has_archive' => true,
		'rewrite' => array('slug' => 'press'),
		'supports' => array( 'title', 'page-attributes' ),
		'menu_position' => 5
		)
	);
}

add_theme_support( 'post-thumbnails' );

/* --------------------------------------------------------- */


/* -----------------  custom taxonomies  ------------------- */


add_action( 'init', 'spawn_taxonomies' );

function spawn_taxonomies() {
	register_taxonomy(
		'parent_plays',
		'press',
		array(
			'label' => __( 'Play(s) referenced' ),
			'rewrite' => array( 'slug' => 'parent_plays' )
		)
	);
}


/* --------------------------------------------------------- */


/* --------------------- gallery rewrite ------------------- */


add_shortcode('gallery', 'my_gallery_shortcode');    
function my_gallery_shortcode($attr) {
    $post = get_post();

static $instance = 0;
$instance++;

if ( ! empty( $attr['ids'] ) ) {
    // 'ids' is explicitly ordered, unless you specify otherwise.
    if ( empty( $attr['orderby'] ) )
        $attr['orderby'] = 'post__in';
    $attr['include'] = $attr['ids'];
}

// Allow plugins/themes to override the default gallery template.
$output = apply_filters('post_gallery', '', $attr);
if ( $output != '' )
    return $output;

// We're trusting author input, so let's at least make sure it looks like a valid orderby statement
if ( isset( $attr['orderby'] ) ) {
    $attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
    if ( !$attr['orderby'] )
        unset( $attr['orderby'] );
}

extract(shortcode_atts(array(
    'order'      => 'ASC',
    'orderby'    => 'menu_order ID',
    'id'         => $post->ID,
    'itemtag'    => 'div',
    'icontag'    => 'div',
    'captiontag' => 'p',
    'columns'    => 3,
    'size'       => array(100,100),
    'include'    => '',
    'exclude'    => ''
), $attr));

$id = intval($id);
if ( 'RAND' == $order )
    $orderby = 'none';

if ( !empty($include) ) {
    $_attachments = get_posts( array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );

    $attachments = array();
    foreach ( $_attachments as $key => $val ) {
        $attachments[$val->ID] = $_attachments[$key];
    }
} elseif ( !empty($exclude) ) {
    $attachments = get_children( array('post_parent' => $id, 'exclude' => $exclude, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
} else {
    $attachments = get_children( array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
}

if ( empty($attachments) )
    return '';

if ( is_feed() ) {
    $output = "\n";
    foreach ( $attachments as $att_id => $attachment )
        $output .= wp_get_attachment_link($att_id, $size, true) . "\n";
    return $output;
}

$itemtag = tag_escape($itemtag);
$captiontag = tag_escape($captiontag);
$icontag = tag_escape($icontag);
$valid_tags = wp_kses_allowed_html( 'post' );
if ( ! isset( $valid_tags[ $itemtag ] ) )
    $itemtag = 'div';
if ( ! isset( $valid_tags[ $captiontag ] ) )
    $captiontag = 'p';
if ( ! isset( $valid_tags[ $icontag ] ) )
    $icontag = 'div';

$columns = intval($columns);
$itemwidth = $columns > 0 ? floor(100/$columns) : 100;
$float = is_rtl() ? 'right' : 'left';

$selector = "gallery-{$instance}";

$gallery_style = $gallery_div = '';
if ( apply_filters( 'use_default_gallery_style', true ) )
    $gallery_style = "
    <style type='text/css'>
    <!-- in scratchpad -->
    </style>";
$size_class = sanitize_html_class( $size );
$gallery_div = "<div id='$selector' class='gallery gallery-" . $post->post_name . "'>";
$output = apply_filters( 'gallery_style', $gallery_style . "\n\t\t" . $gallery_div );

$i = 0;
foreach ( $attachments as $id => $attachment ) {
/*     $link = isset($attr['link']) && 'file' == $attr['link'] ? wp_get_attachment_link($id, $size, false, false) : wp_get_attachment_link($id, $size, true, false); */
	$link = wp_get_attachment_image( $id, $size );
    
    $href = "galleries/" . $post->post_type . "/" . $post->post_name . "/" . $attachment->post_name;
    $output .= "<a href='" . $href . "'><{$itemtag} class='gthumb'>";
    $output .= "
        <{$icontag} class='gfill'>
	        	$link
        </{$icontag}>";
    $output .= "</{$itemtag}></a>";
/*
    if ( $columns > 0 && ++$i % $columns == 0 )
        $output .= '<br style="clear: both" />';
*/
}

$output .= "
        <br style='clear: both;' />
    </div>\n";

return $output;
}

// search function to return image id from given url:

function get_image_id_from_url( $attachment_url = '' ) {
 
	global $wpdb;
	$attachment_id = false;
 
	// If there is no url, return.
	if ( '' == $attachment_url )
		return;
 
	// Get the upload directory paths
	$upload_dir_paths = wp_upload_dir();
 
	// Make sure the upload path base directory exists in the attachment URL, to verify that we're working with a media library image
	if ( false !== strpos( $attachment_url, $upload_dir_paths['baseurl'] ) ) {
 
		// If this is the URL of an auto-generated thumbnail, get the URL of the original image
		$attachment_url = preg_replace( '/-\d+x\d+(?=\.(jpg|jpeg|png|gif)$)/i', '', $attachment_url );
 
		// Remove the upload path base directory from the attachment URL
		$attachment_url = str_replace( $upload_dir_paths['baseurl'] . '/', '', $attachment_url );
 
		// Finally, run a custom database query to get the attachment ID from the modified attachment URL
		$attachment_id = $wpdb->get_var( $wpdb->prepare( "SELECT wposts.ID FROM $wpdb->posts wposts, $wpdb->postmeta wpostmeta WHERE wposts.ID = wpostmeta.post_id AND wpostmeta.meta_key = '_wp_attached_file' AND wpostmeta.meta_value = '%s' AND wposts.post_type = 'attachment'", $attachment_url ) );
 
	}
 
	return $attachment_id;
}

/* --------------------------------------------------------- */

?>
