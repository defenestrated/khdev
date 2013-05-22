<?php
/*
Plugin Name: Extra Post Metadata
Description: adds extra meta fields to posts and plays, like the cast information and press. Don't deactivate this!
Version: 1.0
Author: Sam Galison
Author URI: http://samgalison.com
License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
*/

/* Define the custom box */

add_action( 'add_meta_boxes', 'extrameta_add_custom_box' );

// backwards compatible (before WP 3.0)
// add_action( 'admin_init', 'extrameta_add_custom_box', 1 );

/* Do something with the data entered */
add_action( 'save_post', 'extrameta_save_postdata' );

/* Adds a box to the main column on the Post and Page edit screens */
function extrameta_add_custom_box() {
    add_meta_box(
    	'quotebox',
        __( ':: Quote info ::', 'press_textdomain' ),
        'press_box',
        'press' 
    );
    
    add_meta_box(
    	'playbox1',
        __( ':: Play info ::', 'press_textdomain' ),
        'play_box1',
        'play' 
    );
    
    add_meta_box(
    	'playbox2',
        __( ':: Play details ::', 'press_textdomain' ),
        'play_box2',
        'play' 
    );
 }

function press_box( $post ) {

	// Use nonce for verification
	wp_nonce_field( plugin_basename( __FILE__ ), 'extrameta_noncename' );
	
	// The actual fields for data entry
	
	if (get_post_meta($post->ID, 'press_name', true)) $pressname_filler = get_post_meta($post->ID, 'press_name', true); // show what's already set	
	if (get_post_meta($post->ID, 'press_src', true)) $presssrc_filler = get_post_meta($post->ID, 'press_src', true); // show what's already set	
	
	if (get_post_meta($post->ID, 'press_quote', true)) $pressquote_filler =get_post_meta($post->ID, 'press_quote', true);
	else $pressquote_filler = 'quote goes here!';
	
	echo '- put "REMOVE" in all caps in any box to clear it -';
	
	wp_editor( $pressquote_filler , 'press_quote', $settings = array(
		"wpautop" => false,
		"media_buttons" => false,
		"textarea_rows" => 5
	) );
	echo
		'</br></br><label for="press_name">
			author / organization\'s name, e.g. "So-and-so, of the New York Times"</br>
		</label>';
	echo '<input type="text" id="press_name" name="press_name" value="' . $pressname_filler . '"size="70" maxlength="200" /><br/>';

	echo
		'</br><label for="press_src">
			web source of the news article, e.g. http://www.something...</br>
		</label>';
	echo '<input type="text" id="press_src" name="press_src" value="' . $presssrc_filler . '"size="70" maxlength="400" /><br/>';
	
	
}

function play_box1( $post ) {
	
	// Use nonce for verification
	wp_nonce_field( plugin_basename( __FILE__ ), 'extrameta_noncename' );
	
	if (get_post_meta($post->ID, 'blurb', true)) $blurb_filler =get_post_meta($post->ID, 'blurb', true);
	else $blurb_filler = 'synopsis of the play (if you want one)';
	
	if (get_post_meta($post->ID, 'length', true)) $length_filler = get_post_meta($post->ID, 'length', true); // show what's already set	
	if (get_post_meta($post->ID, 'cast', true)) $cast_filler = get_post_meta($post->ID, 'cast', true); // show what's already set
	if (get_post_meta($post->ID, 'publisher', true)) $pub_filler = get_post_meta($post->ID, 'publisher', true); // show what's already set
	if (get_post_meta($post->ID, 'pub_link', true)) $publink_filler = get_post_meta($post->ID, 'pub_link', true); // show what's already set
	
	if (get_post_meta($post->ID, 'details', true)) $details_filler =get_post_meta($post->ID, 'details', true);
	else $details_filler = 'more detailed description / production history (if you want it)';
	
	echo '- put "REMOVE" in all caps in any box to clear it -';
	
	wp_editor( $blurb_filler, 'blurb', $settings = array(
		"wpautop" => false,
		"media_buttons" => false,
		"textarea_rows" => 5
	) );
	echo
		'</br><label for="length">
			the play\'s approximate runtime</br>
		</label>';
	echo '<input type="text" id="length" name="length" value="' . $length_filler . '"size="50" maxlength="50" /><br/>';
	
	echo
		'</br><label for="cast">
			casting breakdown</br>
		</label>';
	echo '<input type="text" id="cast" name="cast" value="' . $cast_filler . '"size="50" maxlength="50" /><br/>';
	
	echo
		'</br><label for="publisher">
			publisher</br>
		</label>';
	echo '<input type="text" id="publisher" name="publisher" value="' . $pub_filler . '"size="100" maxlength="100" /><br/>';
	
	echo
		'</br><label for="pub_link">
			link to the publisher\'s (or seller\'s) website</br>
		</label>';
	echo '<input type="text" id="pub_link" name="pub_link" value="' . $publink_filler . '"size="70" maxlength="400" /><br/>';
}
function play_box2( $post ) {
	
	// Use nonce for verification
	wp_nonce_field( plugin_basename( __FILE__ ), 'extrameta_noncename' );
	
	if (get_post_meta($post->ID, 'details', true)) $pressquote_filler =get_post_meta($post->ID, 'details', true);
	else $details_filler = 'further details or production history of the play (if you want it)';
	
	wp_editor( $details_filler, 'details', $settings = array() );
}




/* When the post is saved, saves our custom data */
function extrameta_save_postdata( $post_id ) {
	// verify if this is an auto save routine. 
	// If it is our form has not been submitted, so we dont want to do anything
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) 
	  return;
	
	// verify this came from the our screen and with proper authorization,
	// because save_post can be triggered at other times
	
	if ( !wp_verify_nonce( $_POST['extrameta_noncename'], plugin_basename( __FILE__ ) ) )
	  return;
	
	
	// Check permissions
	if ( 'page' == $_POST['post_type'] ) 
	{
	if ( !current_user_can( 'edit_page', $post_id ) )
	    return;
	}
	else
	{
	if ( !current_user_can( 'edit_post', $post_id ) )
	    return;
	}
	
	// OK, we're authenticated: we need to find and save the data
	
	$prname = $_POST['press_name'];
	$prsrc = $_POST['press_src'];
	$prquote = $_POST['press_quote'];
		
	if ($prname) {
		if ($prname === 'REMOVE') {
	  	delete_post_meta($post_id, 'press_name');
		}
		else update_post_meta($post_id, 'press_name', $prname);
	}
	if ($prsrc) {
		if ($prsrc === 'REMOVE') {
	  	delete_post_meta($post_id, 'press_src');
		}
		else update_post_meta($post_id, 'press_src', $prsrc);
	}
	if ($prquote) {
		if ($prquote === 'REMOVE' || $prquote === $pressquote_filler) {
	  	delete_post_meta($post_id, 'press_quote');
		}
		else update_post_meta($post_id, 'press_quote', $prquote);
	}
	
	
	$blurb = array($_POST['blurb'], 'blurb');
	$length = array($_POST['length'], 'length');
	$cast = array($_POST['cast'],'cast');
	$publisher = array($_POST['publisher'], 'publisher');
	$publink = array($_POST['pub_link'], 'pub_link');
	$details = array($_POST['details'], 'details');

	
	$playthings = array($blurb, $length, $cast, $publisher, $publink, $details);
	
	foreach ($playthings as $plarr) {
		if ($plarr[0]) {
			if ($plarr[0] === 'REMOVE') delete_post_meta($post_id, $plarr[1]);
			else update_post_meta($post_id, $plarr[1], $plarr[0]);
		}	
	}
}
?>